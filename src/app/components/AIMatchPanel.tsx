import { UserCircle, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

const matches = [
  { name: 'Dr. Sarah Johnson', role: 'Cardiologist', distance: '0.8 km', status: 'Available', avatar: '👩‍⚕️' },
  { name: 'Mike Chen', role: 'Volunteer EMT', distance: '1.2 km', status: 'On the way', avatar: '🚑' },
  { name: 'Transport Unit 5', role: 'Ambulance', distance: '2.1 km', status: 'Available', avatar: '🚨' },
];

export function AIMatchPanel() {
  return (
    <Card className="p-6 shadow-lg border-2 border-red-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="font-bold text-lg text-gray-900">Available Responders</h3>
        <Badge className="ml-auto bg-red-100 text-red-700">3 Nearby</Badge>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.name} className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-red-200 transition-all">
            <div className="text-4xl">{match.avatar}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{match.name}</h4>
              <p className="text-sm text-gray-600">{match.role}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                {match.distance}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Badge className={match.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                {match.status}
              </Badge>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
