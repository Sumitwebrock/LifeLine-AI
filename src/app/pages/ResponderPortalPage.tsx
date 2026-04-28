import { FormEvent, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Activity, AlertTriangle, CheckCircle, LogIn, MapPin, Phone, UserRound } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { createResponderId, saveResponderProfile } from '../lib/responders';
import {
  EMERGENCY_ALERT_STORAGE_KEY,
  EMERGENCY_ALERT_UPDATE_EVENT,
  EmergencyAlert,
  getEmergencyAlerts,
  deleteEmergencyAlert,
  updateEmergencyAlert,
} from '../lib/emergencyAlerts';
import { getStoredResponders } from '../lib/responders';

export function ResponderPortalPage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(() => getEmergencyAlerts());
  const alertsRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState({
    name: '',
    role: 'Doctor',
    phone: '',
    location: '',
    status: 'Available',
    distance: '1.0 km',
  });

  // ✅ AUTO LOCATION FUNCTION
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

        setForm((prev) => ({
          ...prev,
          location: locationString,
        }));
      },
      () => {
        alert("Location access denied");
      }
    );
  };

  // ✅ LOGIN FUNCTION (FIXED)
  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoggedIn(true);
    getCurrentLocation(); // 🔥 auto-fill location
  };

  useEffect(() => {
    const refreshAlerts = () => setAlerts(getEmergencyAlerts());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === EMERGENCY_ALERT_STORAGE_KEY) {
        refreshAlerts();
      }
    };

    window.addEventListener(EMERGENCY_ALERT_UPDATE_EVENT, refreshAlerts);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(EMERGENCY_ALERT_UPDATE_EVENT, refreshAlerts);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (alertsRef.current) {
      alertsRef.current.scrollTop = 0;
    }
  }, [alerts.length]);

  const updateField = (field: keyof typeof form, value: string) => {
    setSaved(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const responderName = () => {
    const stored = getStoredResponders();
    const profile = stored.find((r) => r.name === form.name) || stored[0];
    return profile?.name || form.name || 'Responder';
  };

  const handleDeleteAlert = (id: string) => {
    deleteEmergencyAlert(id);
  };

  const handleAcceptAlert = (id: string) => {
    const name = responderName();
    updateEmergencyAlert(id, { status: `Accepted by ${name}` });
  };

  const handlePublishProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const initials = form.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'R';

    saveResponderProfile({
      id: createResponderId(form.name, form.phone),
      name: form.name,
      role: form.role,
      phone: form.phone,
      location: form.location,
      status: form.status,
      distance: form.distance,
      rating: 5,
      emergencies: 0,
      avatar: initials,
    });

    setSaved(true);
  };

  // 🔐 LOGIN UI
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Responder Portal</h1>
            <p className="text-gray-600">Login to receive live user emergency alerts.</p>
          </div>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <LogIn className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Responder Login</h2>
                <p className="text-sm text-gray-600">Demo login for responders</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label>Email or Phone</Label>
                <Input required placeholder="responder@lifeline.ai" />
              </div>
              <div>
                <Label>Password</Label>
                <Input required type="password" placeholder="Enter password" />
              </div>

              <Button className="w-full bg-red-500 hover:bg-red-600" type="submit">
                Login as Responder
              </Button>

              <Button className="w-full" type="button" variant="outline" onClick={() => navigate('/app')}>
                Back to User Dashboard
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // 📊 DASHBOARD (YOUR UI SAME)
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Responder Dashboard</h1>
            <p className="text-gray-600">Manage your live profile and monitor user emergency alerts.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/app')}>
            User Dashboard
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* FORM (UNCHANGED UI) */}
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Fill Responder Details</h2>
                <p className="text-sm text-gray-600">Published profiles appear live in the user dashboard.</p>
              </div>
            </div>

            <form className="grid gap-4 sm:grid-cols-2" onSubmit={handlePublishProfile}>
              <div>
                <Label>Full Name</Label>
                <Input required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              </div>

              <div>
                <Label>Role</Label>
                <select value={form.role} onChange={(e) => updateField('role', e.target.value)} className="mt-1 h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm">
                  <option>Doctor</option>
                  <option>Paramedic</option>
                  <option>Volunteer</option>
                  <option>Driver</option>
                  <option>Firefighter</option>
                </select>
              </div>

              <div>
                <Label>Phone</Label>
                <Input required value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>

              <div>
                <Label>Current Location</Label>
                <Input required value={form.location} readOnly placeholder="Fetching location..." />
              </div>

              <div>
                <Label>Status</Label>
                <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="mt-1 h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm">
                  <option>Available</option>
                  <option>On Duty</option>
                  <option>On the way</option>
                  <option>Accepted</option>
                </select>
              </div>

              <div>
                <Label>Distance</Label>
                <Input value={form.distance} onChange={(e) => updateField('distance', e.target.value)} />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
                <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
                  Publish Live Profile
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/app/responders')}>
                  View Responder Listing
                </Button>
              </div>
            </form>

            {saved && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <CheckCircle className="h-4 w-4" />
                Profile published live to the user dashboard.
              </div>
            )}
          </Card>

          {/* ALERTS (UNCHANGED) */}
          <Card className="p-6">
            <h2 className="font-bold text-gray-900 mb-4">Live User Alerts</h2>
            <div ref={alertsRef} className="space-y-3 max-h-[420px] overflow-y-auto">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-red-50 border rounded-lg">
                  <p className="font-bold">{alert.type}</p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {alert.location}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleAcceptAlert(alert.id)}>Accept</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteAlert(alert.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}