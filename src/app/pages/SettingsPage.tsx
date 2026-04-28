import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Bell, Shield, Globe, Smartphone, Wifi } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your preferences and system configuration</p>
      </div>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Emergency Alerts', desc: 'Receive alerts for nearby emergencies' },
            { label: 'Responder Updates', desc: 'Get notified when responders are assigned' },
            { label: 'Resource Warnings', desc: 'Alerts for low resource availability' },
            { label: 'Weather Predictions', desc: 'AI-powered weather and disaster forecasts' },
            { label: 'System Updates', desc: 'Important platform updates and improvements' },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{setting.label}</p>
                <p className="text-sm text-gray-600">{setting.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-green-600" />
          <h3 className="font-bold text-lg text-gray-900">Privacy & Security</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Share Location', desc: 'Allow emergency responders to see your location' },
            { label: 'Two-Factor Authentication', desc: 'Extra security for your account' },
            { label: 'Data Encryption', desc: 'Encrypt all sensitive emergency data' },
            { label: 'Anonymous Mode', desc: 'Hide your identity from non-responders' },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{setting.label}</p>
                <p className="text-sm text-gray-600">{setting.desc}</p>
              </div>
              <Switch defaultChecked={setting.label !== 'Anonymous Mode'} />
            </div>
          ))}
        </div>
        <Button className="mt-4 bg-red-500 hover:bg-red-600">Change Password</Button>
      </Card>

      {/* Network Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Wifi className="w-6 h-6 text-purple-600" />
          <h3 className="font-bold text-lg text-gray-900">Network Settings</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Auto-Sync', desc: 'Automatically sync when online' },
            { label: 'Low Data Mode', desc: 'Reduce data usage for emergencies' },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{setting.label}</p>
                <p className="text-sm text-gray-600">{setting.desc}</p>
              </div>
              <Switch defaultChecked={setting.label === 'Auto-Sync'} />
            </div>
          ))}
        </div>
      </Card>

      {/* Language & Region */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-orange-600" />
          <h3 className="font-bold text-lg text-gray-900">Language & Region</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Language</Label>
            <select className="w-full mt-2 p-2 border border-gray-300 rounded-lg">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <Label>Time Zone</Label>
            <select className="w-full mt-2 p-2 border border-gray-300 rounded-lg">
              <option>Pacific Time (PT)</option>
              <option>Eastern Time (ET)</option>
              <option>Central Time (CT)</option>
              <option>Mountain Time (MT)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-2 border-red-200 bg-red-50">
        <h3 className="font-bold text-lg text-red-900 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100">
            Clear All Data
          </Button>
          <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100">
            Deactivate Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
