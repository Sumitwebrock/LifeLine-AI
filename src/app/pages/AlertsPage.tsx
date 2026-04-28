import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bell, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const alerts = [
  { id: 1, title: 'New Emergency Alert', message: 'Medical emergency reported in Downtown Area', time: '2 min ago', type: 'Emergency', read: false },
  { id: 2, title: 'Responder Assigned', message: 'Dr. Sarah Johnson accepted emergency #1247', time: '5 min ago', type: 'Update', read: false },
  { id: 3, title: 'Resource Low', message: 'Blood type AB- running low at Central Hospital', time: '15 min ago', type: 'Warning', read: false },
  { id: 4, title: 'Weather Alert', message: 'Heavy rain expected - Flood risk in 6 hours', time: '1 hour ago', type: 'Weather', read: true },
  { id: 5, title: 'Emergency Resolved', message: 'Medical emergency #1245 successfully resolved', time: '2 hours ago', type: 'Success', read: true },
  { id: 6, title: 'System Update', message: 'AI matching algorithm improved - 5% faster response', time: '3 hours ago', type: 'Info', read: true },
];

export function AlertsPage() {
  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications & Alerts</h1>
          <p className="text-gray-600">Stay updated with real-time system notifications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Mark All Read</Button>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Unread', value: '5', icon: Bell, color: 'bg-red-50 text-red-600' },
          { label: 'Today', value: '24', icon: Clock, color: 'bg-blue-50 text-blue-600' },
          { label: 'Emergency', value: '8', icon: Bell, color: 'bg-orange-50 text-orange-600' },
          { label: 'Resolved', value: '16', icon: CheckCircle, color: 'bg-green-50 text-green-600' },
        ].map((stat) => (
          <Card key={stat.label} className={`p-4 ${stat.color}`}>
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="w-5 h-5" />
              <p className="text-sm font-medium">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className={`p-5 hover:shadow-lg transition-all ${
              alert.read ? 'bg-white' : 'bg-blue-50 border-2 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                alert.type === 'Emergency' ? 'bg-red-100 text-red-600' :
                alert.type === 'Warning' ? 'bg-orange-100 text-orange-600' :
                alert.type === 'Success' ? 'bg-green-100 text-green-600' :
                alert.type === 'Weather' ? 'bg-purple-100 text-purple-600' :
                alert.type === 'Update' ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {alert.type === 'Emergency' && <Bell className="w-5 h-5" />}
                {alert.type === 'Warning' && <Bell className="w-5 h-5" />}
                {alert.type === 'Success' && <CheckCircle className="w-5 h-5" />}
                {alert.type === 'Weather' && <span className="text-lg">🌧️</span>}
                {alert.type === 'Update' && <Bell className="w-5 h-5" />}
                {alert.type === 'Info' && <Bell className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900">{alert.title}</h3>
                  {!alert.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <Badge className={
                    alert.type === 'Emergency' ? 'bg-red-500 text-white' :
                    alert.type === 'Warning' ? 'bg-orange-500 text-white' :
                    alert.type === 'Success' ? 'bg-green-500 text-white' :
                    alert.type === 'Weather' ? 'bg-purple-500 text-white' :
                    alert.type === 'Update' ? 'bg-blue-500 text-white' :
                    'bg-gray-500 text-white'
                  }>
                    {alert.type}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-2">{alert.message}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {alert.time}
                </div>
              </div>

              <div className="flex gap-2">
                {!alert.read && (
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" variant="ghost">
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
