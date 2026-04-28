import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, MapPin, AlertTriangle, Users, Clock, Activity, Droplet, Cross, Check, Circle, Phone, MessageCircle, XCircle, LogOut } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getStoredResponders, RESPONDER_STORAGE_KEY, RESPONDER_UPDATE_EVENT, ResponderProfile } from '../lib/responders';
import { publishEmergencyAlert, getEmergencyAlerts, EMERGENCY_ALERT_UPDATE_EVENT } from '../lib/emergencyAlerts';
import { getStoredUser, logout, isUserLoggedIn } from '../lib/userAuth';

const DEFAULT_LOCATION = {
  latitude: 12.9352,
  longitude: 77.6245,
};

function getMapEmbedUrl(latitude: number, longitude: number) {
  const latDelta = 0.012;
  const lonDelta = 0.018;
  const bbox = [
    longitude - lonDelta,
    latitude - latDelta,
    longitude + lonDelta,
    latitude + latDelta,
  ].join('%2C');

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [emergencyActive, setEmergencyActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastEmergency, setLastEmergency] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  async function handleSOS(typeOverride?: string) {
    setErrorMsg('');
    setLoading(true);
    // try to get geolocation, fallback to default
    let lat = 12.934;
    let lng = 77.61;
    try {
      const pos = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error('Geolocation unavailable'));
        navigator.geolocation.getCurrentPosition((p) => resolve(p), (e) => reject(e), { timeout: 5000 });
      });
      // @ts-ignore
      lat = pos.coords.latitude;
      // @ts-ignore
      lng = pos.coords.longitude;
    } catch (e) {
      // keep defaults
    }

    const payload = { type: typeOverride || 'medical', lat: Number(lat), lng: Number(lng), userId: 'user_123' };

    try {
      const res = await fetch('http://localhost:4000/api/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create emergency');
      }
      const data = await res.json();
      setLastEmergency(data.emergency || data);
      setEmergencyActive(true);
    } catch (err) {
      setErrorMsg(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }
  const [sosArming, setSosArming] = useState(false);
  const [emergencyOptionsActive, setEmergencyOptionsActive] = useState(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [locationMessage, setLocationMessage] = useState('Fetching your current location...');
  const [responders, setResponders] = useState<ResponderProfile[]>(() => getStoredResponders());
  const [alerts, setAlerts] = useState(() => getEmergencyAlerts());
  const sosTimerRef = useRef<number | null>(null);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('fallback');
      setLocationMessage('Location is unavailable. Showing Bengaluru fallback.');
      setUserLocation(DEFAULT_LOCATION);
      return;
    }

    setLocationStatus('loading');
    setLocationMessage('Fetching your current location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('ready');
        setLocationMessage('Showing your current location');
      },
      () => {
        setLocationStatus('fallback');
        setLocationMessage('Location permission denied. Showing Bengaluru fallback.');
        setUserLocation(DEFAULT_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (sosTimerRef.current) {
        window.clearTimeout(sosTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    requestUserLocation();
  }, []);

  useEffect(() => {
    const refreshResponders = () => setResponders(getStoredResponders());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === RESPONDER_STORAGE_KEY) {
        refreshResponders();
      }
    };

    window.addEventListener(RESPONDER_UPDATE_EVENT, refreshResponders);
    window.addEventListener('storage', handleStorage);

    const refreshAlerts = () => setAlerts(getEmergencyAlerts());
    window.addEventListener(EMERGENCY_ALERT_UPDATE_EVENT, refreshAlerts as EventListener);
    window.addEventListener('storage', (e) => { if (e.key === 'lifeline-emergency-alerts') refreshAlerts(); });

    return () => {
      window.removeEventListener(RESPONDER_UPDATE_EVENT, refreshResponders);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(EMERGENCY_ALERT_UPDATE_EVENT, refreshAlerts as EventListener);
    };
  }, []);

  const activateSosOptions = () => {
    if (sosArming || emergencyOptionsActive) {
      return;
    }

    setEmergencyActive(true);
    setSosArming(true);
    sosTimerRef.current = window.setTimeout(() => {
      setSosArming(false);
      setEmergencyOptionsActive(true);
    }, 2000);
  };

  const cancelSosOptions = () => {
    if (sosTimerRef.current) {
      window.clearTimeout(sosTimerRef.current);
      sosTimerRef.current = null;
    }

    setSosArming(false);
    setEmergencyOptionsActive(false);
    setSelectedEmergencyType(null);
  };

  const selectEmergencyType = (type: string) => {
    setSelectedEmergencyType(type);
    publishEmergencyAlert({
      type,
      location: locationStatus === 'ready' ? 'User current location' : 'Bengaluru fallback location',
      coordinates: `${userLocation.latitude.toFixed(5)}, ${userLocation.longitude.toFixed(5)}`,
    });
    // send to backend
    handleSOS(type);
  };

  return (
    <div className="dashboard-white min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Good Morning, {user?.name}! 👋</h1>
            <p className="text-slate-400 mt-1">Stay safe. We're always here to help.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell className="h-6 w-6 text-slate-300 hover:text-white transition-colors" />
              <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">3</span>
            </div>
            <div className="text-right border-l border-slate-700 pl-6">
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.location}</p>
            </div>
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDEBAR - Emergency Control */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          
          {/* Emergency Quick Access Card */}
          <Card className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 border border-white/20 hover:border-white/30 transition-all">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Emergency Quick Access
            </h2>
            <p className="text-xs text-slate-300 mb-4">Help is just one tap away!</p>
            
            {/* SOS Button */}
            <button 
              onClick={activateSosOptions}
              className="w-full h-28 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 mb-4 flex items-center justify-center active:scale-95 disabled:cursor-wait disabled:opacity-80"
              disabled={sosArming}
            >
              {sosArming ? '2 sec...' : emergencyOptionsActive ? 'SOS Active' : 'SOS'}
            </button>
            <p className="text-center text-xs text-slate-300 mb-4">
              {loading
                ? 'Sending SOS...'
                : errorMsg
                ? `Error: ${errorMsg}`
                : lastEmergency
                ? `SOS sent — id: ${lastEmergency.id}`
                : emergencyOptionsActive
                ? 'Choose emergency type'
                : sosArming
                ? 'Activating emergency options'
                : 'Tap SOS first'}
            </p>

            {/* Emergency Types */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🏥', label: 'Medical' },
                { icon: '🔥', label: 'Fire' },
                { icon: '🚗', label: 'Accident' },
                { icon: '🛡️', label: 'Disaster' },
              ].map((item) => {
                const selected = selectedEmergencyType === item.label;

                return (
                <button
                  key={item.label}
                  disabled={!emergencyOptionsActive}
                  onClick={() => selectEmergencyType(item.label)}
                  className={`rounded-lg border p-2 text-center transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 ${
                    selected
                      ? 'border-red-500 bg-red-50 shadow-md ring-2 ring-red-100'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className={`text-xs font-semibold ${selected ? 'text-red-700' : 'text-slate-200'}`}>{item.label}</p>
                </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={cancelSosOptions}
              className="mt-3 h-7 w-full border-red-200 text-xs text-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
          </Card>

          {/* Nearby Resources Card */}
          <Card className="h-[365px] bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 border border-white/20">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              Nearby Resources
            </h2>
            <div className="space-y-2">
              {[
                { icon: '🏥', name: 'City Hospital', distance: '1.4 km', status: 'Open' },
                { icon: '🚑', name: 'Red Cross', distance: '1.8 km', status: 'Open' },
                { icon: '🏠', name: 'Shelter', distance: '2.3 km', status: 'Available' },
                { icon: '💉', name: 'Blood Bank', distance: '3.1 km', status: 'Open' },
              ].map((resource) => (
                <div key={resource.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <span className="text-lg">{resource.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-100 text-xs truncate">{resource.name}</p>
                    <p className="text-xs text-slate-400">{resource.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* CENTER COLUMN - Map & Details */}
        <div className="col-span-1 lg:col-span-5 space-y-4">
          
          {/* Live Map Card */}
          <Card className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 border border-white/20 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                Live Map
              </h2>
              <Badge className="bg-green-400/20 text-green-200 text-xs">Live Tracking</Badge>
            </div>
            
            <div className="relative h-80 w-full overflow-hidden rounded-xl border border-white/20 bg-slate-100">
              <iframe
                title="Live user location map"
                src={getMapEmbedUrl(userLocation.latitude, userLocation.longitude)}
                className="h-full w-full border-0"
                loading="lazy"
              />

              <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs shadow-md">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${locationStatus === 'ready' ? 'bg-green-500' : locationStatus === 'loading' ? 'bg-yellow-500' : 'bg-orange-500'}`}></span>
                  <span className="font-semibold text-gray-900">{locationMessage}</span>
                </div>
                <p className="mt-1 text-gray-600">
                  {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}
                </p>
              </div>

              <button
                onClick={requestUserLocation}
                className="absolute right-4 top-4 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-gray-900 shadow-md hover:bg-white"
              >
                Use my location
              </button>

              <div className="absolute bottom-4 left-4 rounded-lg border border-gray-200 bg-white/95 p-3 text-xs shadow-md">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-900">Your emergency location</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Live Feed Card */}
          <Card className="h-[365px] bg-white/10 backdrop-blur rounded-2xl shadow-lg p-6 border border-white/20">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-400" />
              Live Feed
            </h2>
            <div className="space-y-3">
              {(() => {
                // build a simple feed from local emergency alerts (newest first)
                const feed: { time: string; event: string }[] = [];
                alerts.forEach((a) => {
                  feed.push({ time: a.time, event: `🚨 ${a.type} reported in ${a.location}` });
                  if (a.status && a.status !== 'New') {
                    feed.push({ time: a.time, event: `✅ ${a.status}` });
                  }
                });

                if (feed.length === 0) {
                  return <div className="text-sm text-slate-400">No live feed yet.</div>;
                }

                return feed.map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border-l-4 border-orange-400">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100 text-sm">{item.event}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </Card>

        </div>

        {/* RIGHT SIDEBAR - Emergency & Status */}
        <div className="col-span-1 lg:col-span-4 space-y-4">
          
          {/* ETA Card */}
          <Card className="mx-auto w-full max-w-md bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-lg p-6 text-center text-white border-0">
            <h2 className="text-base font-bold mb-3 flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" />
              Estimated Arrival
            </h2>
            <div className="flex justify-center mb-3">
              <div className="relative w-28 h-28 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                <div className="text-center">
                  <span className="text-5xl font-bold">2</span>
                  <p className="text-lg font-semibold">min</p>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold">Stay calm, help is on the way!</p>
          </Card>

          {/* Active Emergency Card */}
          <Card className="mx-auto min-h-[560px] w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold text-red-600">Active Emergency</h2>
              <Badge className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] text-red-600 border border-red-100">High Priority</Badge>
            </div>

            <div className="mb-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50">
                  <Cross className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-sm font-bold text-gray-900">Medical Emergency</p>
              </div>
              <div className="ml-9 space-y-1 text-[11px] text-gray-600">
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-green-600" />
                  Koramangala 4th Block, Bengaluru
                </p>
                <p className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  10:24 AM - May 25, 2024
                </p>
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-2 text-xs font-bold text-gray-900">Status</p>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { label: 'Alert Sent', active: true, icon: Check },
                  { label: 'Matched', active: true, icon: Check },
                  { label: 'On the Way', active: false, icon: AlertTriangle },
                  { label: 'Arrived', active: false, icon: Circle },
                  { label: 'Resolved', active: false, icon: Circle },
                ].map((status) => (
                  <div key={status.label} className="text-center">
                    <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                      <status.icon className={`h-3.5 w-3.5 ${status.active ? 'text-green-600' : status.label === 'On the Way' ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-[9px] font-medium leading-tight text-gray-700">{status.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-900">Responders</p>
                <button className="text-[10px] font-semibold text-blue-600">View All</button>
              </div>
              <div className="space-y-2">
                {responders.slice(0, 3).map((responder) => (
                  <div key={responder.name} className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-base">{responder.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-gray-900">{responder.name}</p>
                      <p className="text-[10px] text-gray-600">{responder.role}</p>
                    </div>
                    <button className="flex h-7 w-7 items-center justify-center rounded-full text-green-600 hover:bg-green-50">
                      <Phone className="h-3.5 w-3.5" />
                    </button>
                    <button className="flex h-7 w-7 items-center justify-center rounded-full text-green-600 hover:bg-green-50">
                      <MessageCircle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="mt-3 h-9 w-full border-red-500 text-xs font-bold text-red-600 hover:bg-red-50">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Emergency
            </Button>
          </Card>

        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Responders List Card */}
        <Card className="bg-white/10 backdrop-blur rounded-2xl shadow-lg p-4 border border-white/20">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            Responders
          </h2>
          <div className="space-y-2">
            {responders.map((responder) => (
              <div key={responder.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <span className="text-xl">{responder.avatar}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-100 text-xs">{responder.name}</p>
                  <p className="text-xs text-slate-400">{responder.role}</p>
                  <p className="text-[11px] text-green-300 mt-1">Live - {responder.status}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-white/20 rounded-lg transition-colors text-base">☎️</button>
                  <button className="p-1 hover:bg-white/20 rounded-lg transition-colors text-base">💬</button>
                </div>
              </div>
            ))}
            <Button className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-xs">Connect Emergency</Button>
          </div>
        </Card>

        {/* AI Prediction Card */}
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl shadow-lg p-4 border-2 border-blue-400/50">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-400" />
            AI Prediction
          </h2>
          <p className="text-sm text-slate-200">⚠️ Heavy rain expected in next 6 hours in Bangalore. Flood risk in low-lying areas.</p>
          <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm">View Full Report →</Button>
        </Card>
      </div>
    </div>
  );
}
