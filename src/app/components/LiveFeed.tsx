import { CheckCircle, Clock, Navigation, MapPin } from 'lucide-react';
import { Card } from './ui/card';

const updates = [
  { time: '2 min ago', text: 'Dr. Sarah Johnson accepted your request', icon: CheckCircle, color: 'text-green-500' },
  { time: '3 min ago', text: 'AI matched 3 nearby responders', icon: Clock, color: 'text-blue-500' },
  { time: '4 min ago', text: 'Emergency alert sent to network', icon: Navigation, color: 'text-orange-500' },
  { time: '5 min ago', text: 'Location verified: Downtown Area', icon: MapPin, color: 'text-purple-500' },
];

export function LiveFeed() {
  return (
    <Card className="p-6 shadow-lg">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Live Activity Feed</h3>
      <div className="space-y-4">
        {updates.map((update, index) => (
          <div key={index} className="flex gap-3">
            <div className={`${update.color} mt-1`}>
              <update.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{update.text}</p>
              <p className="text-xs text-gray-500 mt-1">{update.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
