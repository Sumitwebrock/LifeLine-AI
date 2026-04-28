import { LiveMap } from '../components/LiveMap';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Filter, Search } from 'lucide-react';
import { Input } from '../components/ui/input';

export function MapPage() {
  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emergency Map</h1>
          <p className="text-gray-600">Real-time visualization of emergencies and responders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Map Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Emergencies', value: '12', color: 'bg-red-50 text-red-600 border-red-200' },
          { label: 'Available Responders', value: '48', color: 'bg-green-50 text-green-600 border-green-200' },
          { label: 'En Route', value: '23', color: 'bg-blue-50 text-blue-600 border-blue-200' },
          { label: 'Resources', value: '156', color: 'bg-purple-50 text-purple-600 border-purple-200' },
        ].map((stat) => (
          <Card key={stat.label} className={`p-4 border-2 ${stat.color}`}>
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Full Map View */}
      <div className="h-[600px]">
        <LiveMap />
      </div>

      {/* Map Legend */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: '📍', label: 'Your Location', color: 'text-blue-600' },
            { icon: '🚨', label: 'Emergency', color: 'text-red-600' },
            { icon: '👨‍⚕️', label: 'Medical Responder', color: 'text-green-600' },
            { icon: '🏥', label: 'Hospital', color: 'text-red-500' },
            { icon: '🏠', label: 'Shelter', color: 'text-blue-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
