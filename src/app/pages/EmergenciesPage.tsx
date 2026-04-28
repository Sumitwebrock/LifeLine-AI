import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { AlertCircle, Clock, MapPin, User } from 'lucide-react';

const emergencies = [
  { id: 1, type: 'Medical Emergency', severity: 'Critical', location: 'Downtown Area, Sector 7', time: '2 min ago', responders: 3, status: 'In Progress' },
  { id: 2, type: 'Fire', severity: 'High', location: 'Residential Zone, Block 12', time: '5 min ago', responders: 5, status: 'Responding' },
  { id: 3, type: 'Accident', severity: 'Medium', location: 'Highway 45, Exit 8', time: '12 min ago', responders: 2, status: 'Resolved' },
  { id: 4, type: 'Disaster', severity: 'Critical', location: 'East District, Zone 3', time: '15 min ago', responders: 8, status: 'In Progress' },
  { id: 5, type: 'Safety Threat', severity: 'Low', location: 'Shopping Mall, Level 2', time: '20 min ago', responders: 1, status: 'Monitoring' },
];

export function EmergenciesPage() {
  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Emergencies</h1>
          <p className="text-gray-600">Monitor and manage ongoing emergency situations</p>
        </div>
        <Badge className="bg-red-500 text-white text-lg px-4 py-2">
          {emergencies.filter(e => e.status === 'In Progress').length} Active
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Today', value: '47', icon: AlertCircle, color: 'bg-blue-50 text-blue-600' },
          { label: 'In Progress', value: '12', icon: Clock, color: 'bg-red-50 text-red-600' },
          { label: 'Resolved', value: '35', icon: '✓', color: 'bg-green-50 text-green-600' },
          { label: 'Avg Response', value: '2.3 min', icon: Clock, color: 'bg-purple-50 text-purple-600' },
        ].map((stat) => (
          <Card key={stat.label} className={`p-4 ${stat.color}`}>
            <div className="flex items-center gap-2 mb-2">
              {typeof stat.icon === 'string' ? (
                <span className="text-xl">{stat.icon}</span>
              ) : (
                <stat.icon className="w-5 h-5" />
              )}
              <p className="text-sm font-medium">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Emergency List */}
      <div className="space-y-4">
        {emergencies.map((emergency) => (
          <Card key={emergency.id} className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{emergency.type}</h3>
                  <Badge className={
                    emergency.severity === 'Critical' ? 'bg-red-500 text-white' :
                    emergency.severity === 'High' ? 'bg-orange-500 text-white' :
                    emergency.severity === 'Medium' ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'
                  }>
                    {emergency.severity}
                  </Badge>
                  <Badge className={
                    emergency.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    emergency.status === 'Responding' ? 'bg-purple-100 text-purple-700' :
                    emergency.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {emergency.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {emergency.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {emergency.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {emergency.responders} responders
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm" className="bg-red-500 hover:bg-red-600">Manage</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
