import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, Clock, Navigation, MapPin, Phone, MessageCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const responders = [
  { name: 'Dr. Sarah Johnson', role: 'Cardiologist', avatar: '👩‍⚕️', status: 'On the way' },
  { name: 'Mike Chen', role: 'Volunteer EMT', avatar: '🚑', status: 'Accepted' },
  { name: 'Transport Unit 5', role: 'Ambulance', avatar: '🚨', status: 'Available' },
];

const timeline = [
  { status: 'Alert Sent', time: '10:24 AM', completed: true },
  { status: 'AI Matched', time: '10:25 AM', completed: true },
  { status: 'On the Way', time: '10:26 AM', completed: true },
  { status: 'Arrived', time: 'ETA 2 min', completed: false },
];

export function RightPanel() {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6 overflow-y-auto h-full">
      {/* Active Emergency */}
      <Card className="p-5 shadow-lg border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-gray-900">Active Emergency</h3>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-semibold text-gray-900">Medical Emergency</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold text-gray-900">Downtown Area, Sector 7</p>
          </div>

          {/* Timeline */}
          <div className="pt-3 border-t border-red-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Status Timeline</p>
            <div className="space-y-3">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`mt-1 ${item.completed ? 'text-green-500' : 'text-gray-300'}`}>
                    {item.completed ? (
                      <CheckCircle className="w-4 h-4" fill="currentColor" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.status}
                    </p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Responders */}
      <Card className="p-5 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4">Active Responders</h3>
        <div className="space-y-3">
          {responders.map((responder) => (
            <div key={responder.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl">{responder.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{responder.name}</p>
                <p className="text-xs text-gray-600">{responder.role}</p>
                <Badge className="mt-1 text-xs bg-green-100 text-green-700">{responder.status}</Badge>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-5 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <h3 className="font-bold text-gray-900 mb-4">Quick Insights</h3>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <p className="text-sm font-semibold text-gray-900">High Risk Zones</p>
            </div>
            <p className="text-xs text-gray-600">3 areas with elevated emergency activity</p>
          </div>

          <div className="p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-semibold text-gray-900">Active Emergencies</p>
            </div>
            <p className="text-xs text-gray-600">12 ongoing in your region</p>
          </div>

          <div className="p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-green-500" />
              <p className="text-sm font-semibold text-gray-900">Avg Response Time</p>
            </div>
            <p className="text-xs text-gray-600">3.2 minutes (↓ 40% this month)</p>
          </div>
        </div>
      </Card>

      {/* Weather Alert */}
      <Card className="p-5 shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-xl">🌧️</div>
          <h3 className="font-bold text-gray-900">Weather Alert</h3>
        </div>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">Weather Alert:</span> Heavy rain expected
        </p>
        <p className="text-xs text-gray-600">
          Flood risk in low-lying areas within the next 6 hours. Emergency resources have been pre-allocated.
        </p>
        <Button size="sm" className="w-full mt-3 bg-red-500 hover:bg-red-600">
          View Details
        </Button>
      </Card>
    </div>
  );
}
