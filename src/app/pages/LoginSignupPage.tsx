import { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { signup, login } from '../lib/userAuth';

export function LoginSignupPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationFetching, setLocationFetching] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Bengaluru',
  });

  // Auto-fetch location on mount
  useEffect(() => {
    const fetchLocation = async () => {
      setLocationFetching(true);
      try {
        if (!navigator.geolocation) {
          setForm(prev => ({ ...prev, location: 'Bengaluru' }));
          setLocationFetching(false);
          return;
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });

        // Reverse geocode (simplified - just use coordinates as location)
        const { latitude, longitude } = position.coords;
        setForm(prev => ({ 
          ...prev, 
          location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
        }));
      } catch {
        // Fallback to default
        setForm(prev => ({ ...prev, location: 'Bengaluru' }));
      } finally {
        setLocationFetching(false);
      }
    };

    fetchLocation();
  }, []);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!form.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!form.email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!form.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    
    setLoading(true);

    try {
      const result = await signup(form.name, form.email, form.phone, form.location);
      console.log('Signup successful:', result);
      navigate('/app');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Signup failed';
      console.error('Signup error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email);
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-white to-red-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
  <h1 className="text-4xl font-bold text-red-600 mb-2">🆘 Lifeline</h1>
  <p className="text-gray-500">Emergency Response Network</p>
</div>

        <Card className="p-8 shadow-2xl">
          <div className="mb-6 flex gap-2 border-b border-gray-200">
            <button
              onClick={() => {
                setMode('signup');
                setError('');
                setForm({ name: '', email: '', phone: '', location: 'Bengaluru' });
              }}
              className={`flex-1 py-2 px-4 text-center font-semibold text-sm transition-colors ${
                mode === 'signup'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setMode('login');
                setError('');
                setForm({ name: '', email: '', phone: '', location: 'Bengaluru' });
              }}
              className={`flex-1 py-2 px-4 text-center font-semibold text-sm transition-colors ${
                mode === 'login'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-sm text-red-700 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={mode === 'signup' ? handleSignup : handleLogin} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <Label>Full Name *</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <Label>Email *</Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <Label>Location {locationFetching && '(fetching...)'}</Label>
                  <Input
                    readOnly
                    value={form.location}
                    placeholder="Fetching your location..."
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-detected from your device</p>
                </div>
              </>
            )}

            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
              type="submit"
              disabled={loading || (mode === 'signup' && locationFetching)}
            >
              {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Login to Account'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
            <p className="font-semibold mb-2">💡Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>No password required when login</li>
              <li>Login with any email </li>
              <li>Session persists until you logout</li>
            </ul>
          </div>
        </Card>

        <p className="text-center text-red-100 text-sm mt-6">
          Stay safe. We're always here to help. 🚑
        </p>
      </div>
    </div>
  );
}
