import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, Phone, MapPin, Shield, Award } from 'lucide-react';

export function ProfilePage() {
  // ✅ FIX 1: ADD STATE (THIS WAS MISSING)
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ fallback local user
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    if (!token) {
      console.log("No token → using local user");
      return;
    }

    fetch("http://localhost:4000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Session expired");
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch(() => {
        console.log("⚠️ Backend failed, using local user");
      });
  }, []);

  // 🔥 Save profile
  const handleSave = () => {
    const first = (document.getElementById("firstName") as HTMLInputElement).value;
    const last = (document.getElementById("lastName") as HTMLInputElement).value;

    const updatedUser = {
      name: `${first} ${last}`,
      email: (document.getElementById("email") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      location: (document.getElementById("address") as HTMLInputElement).value,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // ✅ FIX 2: NO BLANK SCREEN
  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600">Manage your account and emergency information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <Card className="p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl">
              👤
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {user.name}
            </h2>

            <p className="text-gray-600 mb-4"></p>
            <Badge className="bg-blue-100 text-blue-700">Verified User</Badge>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">{user.location}</p>
              </div>
            </div>
          </div>

          <Button className="w-full mt-6 bg-red-500 hover:bg-red-600">
            Edit Profile
          </Button>
        </Card>

        {/* Right Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Info */}
          <Card className="p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Personal Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input id="firstName" defaultValue={user.name?.split(" ")[0] || ""} />
              <Input id="lastName" defaultValue={user.name?.split(" ")[1] || ""} />
              <Input id="email" defaultValue={user.email} />
              <Input id="phone" defaultValue={user.phone} />
              <Input id="address" defaultValue={user.location} className="col-span-2" />
            </div>

            <Button onClick={handleSave} className="mt-4 bg-red-500 hover:bg-red-600">
              Save Changes
            </Button>
          </Card>

        </div>
      </div>
    </div>
  );
}