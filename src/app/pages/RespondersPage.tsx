import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Phone, MessageCircle, MapPin, Star } from 'lucide-react';
import { getStoredResponders, RESPONDER_STORAGE_KEY, RESPONDER_UPDATE_EVENT, ResponderProfile } from '../lib/responders';

export function RespondersPage() {
  const navigate = useNavigate();
  const [responders, setResponders] = useState<ResponderProfile[]>(() => getStoredResponders());

  useEffect(() => {
    const refreshResponders = () => setResponders(getStoredResponders());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === RESPONDER_STORAGE_KEY) {
        refreshResponders();
      }
    };

    window.addEventListener(RESPONDER_UPDATE_EVENT, refreshResponders);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(RESPONDER_UPDATE_EVENT, refreshResponders);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emergency Responders</h1>
          <p className="text-gray-600">Manage and connect with your response network</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600" onClick={() => navigate('/responder')}>Add Responder</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Responders', value: String(responders.length), color: 'bg-blue-50 text-blue-600' },
          { label: 'On Duty', value: String(responders.filter((responder) => responder.status === 'On Duty').length), color: 'bg-green-50 text-green-600' },
          { label: 'Responding', value: String(responders.filter((responder) => responder.status === 'On the way' || responder.status === 'Accepted').length), color: 'bg-purple-50 text-purple-600' },
          { label: 'Avg Rating', value: '4.8', color: 'bg-yellow-50 text-yellow-600' },
        ].map((stat) => (
          <Card key={stat.label} className={`p-4 ${stat.color}`}>
            <p className="text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Responders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {responders.map((responder) => (
          <Card key={responder.id} className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-700">{responder.avatar}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate">{responder.name}</h3>
                <p className="text-sm text-gray-600">{responder.role}</p>
                <Badge className={
                  responder.status === 'On Duty' || responder.status === 'On the way' ? 'bg-green-100 text-green-700 mt-2' :
                  responder.status === 'Available' ? 'bg-blue-100 text-blue-700 mt-2' :
                  'bg-gray-100 text-gray-700 mt-2'
                }>
                  {responder.status}
                </Badge>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  <span className="font-semibold">{responder.rating}</span>
                </div>
                <span>{responder.emergencies} emergencies</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {responder.distance} away
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-2">
                <Phone className="w-4 h-4" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="flex-1 gap-2">
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
