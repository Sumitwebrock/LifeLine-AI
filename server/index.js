const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for emergencies
const emergencies = [];

// In-memory store for users and sessions
const users = [];
const sessions = {}; // { token: { userId, userName, email, loginTime } }

// In-memory responders (sample data)
const responders = [
  { id: uuidv4(), name: 'Dr. Priya Sharma', type: 'doctor', lat: 12.9355, lng: 77.6240, available: true },
  { id: uuidv4(), name: 'Arjun Kumar', type: 'volunteer', lat: 12.9340, lng: 77.6200, available: true },
  { id: uuidv4(), name: 'Ravi Driver', type: 'driver', lat: 12.9380, lng: 77.6220, available: true },
  { id: uuidv4(), name: 'Dr. Sameer Gupta', type: 'doctor', lat: 12.9400, lng: 77.6300, available: true },
  { id: uuidv4(), name: 'Maya Singh', type: 'volunteer', lat: 12.9300, lng: 77.6180, available: true },
  { id: uuidv4(), name: 'Karan Patel', type: 'driver', lat: 12.9320, lng: 77.6260, available: true },
];

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestResponderByType(lat, lng, role) {
  const candidates = responders.filter(r => r.type === role && r.available);
  if (!candidates.length) return null;
  let best = null;
  let bestDist = Infinity;
  for (const r of candidates) {
    const d = haversineDistance(lat, lng, r.lat, r.lng);
    if (d < bestDist) {
      bestDist = d;
      best = r;
    }
  }
  return best;
}

// Auth: Sign up / Register
app.post('/api/auth/signup', (req, res) => {
  const { name, email, phone, location } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing fields: name, email, phone required' });
  }

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists with this email' });
  }

  const userId = uuidv4();
  const user = { id: userId, name, email, phone, location: location || '', createdAt: new Date().toISOString() };
  users.push(user);

  // Create session token
  const token = uuidv4();
  sessions[token] = { userId, userName: name, email, loginTime: new Date().toISOString() };

  return res.status(201).json({
    token,
    user: { id: userId, name, email, phone, location: location || '' }
  });
});

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  // Find user by email (simplified - no password check for MVP)
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: 'User not found. Please sign up first.' });
  }

  // Create session token
  const token = uuidv4();
  sessions[token] = { userId: user.id, userName: user.name, email: user.email, loginTime: new Date().toISOString() };

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, location: user.location }
  });
});

// Auth: Get current user (validate token)
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !sessions[token]) {
    return res.status(401).json({ error: 'Unauthorized. No valid session.' });
  }

  const session = sessions[token];
  const user = users.find(u => u.id === session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, location: user.location }
  });
});

// Auth: Logout (invalidate token)
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token && sessions[token]) {
    delete sessions[token];
  }
  return res.json({ message: 'Logged out' });
});

// Create emergency
app.post('/api/emergencies', (req, res) => {
  const { type, lat, lng, userId } = req.body || {};

  if (!type || typeof lat !== 'number' || typeof lng !== 'number' || !userId) {
    return res.status(400).json({
      error: 'Missing or invalid fields. Required: type, lat(number), lng(number), userId'
    });
  }

  const emergency = {
    id: uuidv4(),
    type,
    location: { lat, lng },
    userId,
    status: 'alert_sent',
    createdAt: new Date().toISOString()
  };

  // assign nearest responders: doctor, volunteer, driver
  const assigned = {};
  const roles = ['doctor', 'volunteer', 'driver'];
  for (const role of roles) {
    const r = findNearestResponderByType(lat, lng, role);
    if (r) {
      // mark responder as assigned/unavailable
      r.available = false;
      r.assignedEmergencyId = emergency.id;
      assigned[role] = { id: r.id, name: r.name, lat: r.lat, lng: r.lng };
    } else {
      assigned[role] = null;
    }
  }

  emergency.assignedResponders = assigned;
  emergency.status = 'matched';

  emergencies.push(emergency);

  return res.status(201).json({ emergency });
});

// List responders (for debugging)
app.get('/api/responders', (req, res) => {
  res.json({ responders });
});

// List emergencies (for debugging)
app.get('/api/emergencies', (req, res) => {
  res.json({ emergencies });
});

// Get single emergency
app.get('/api/emergencies/:id', (req, res) => {
  const e = emergencies.find((x) => x.id === req.params.id);
  if (!e) return res.status(404).json({ error: 'Not found' });
  res.json({ emergency: e });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Lifeline server listening on http://localhost:${PORT}`);
});
