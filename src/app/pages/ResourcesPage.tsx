import { ResourceCards } from '../components/ResourceCards';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Hospital, Building2, Droplet, Pill, Ambulance, Users } from 'lucide-react';

export function ResourcesPage() {
  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emergency Resources</h1>
        <p className="text-gray-600">Access vital resources and facilities in your area</p>
      </div>

      {/* Resource Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Hospitals', value: '24', icon: Hospital, color: 'bg-red-50 text-red-600' },
          { label: 'Shelters', value: '18', icon: Building2, color: 'bg-blue-50 text-blue-600' },
          { label: 'Blood Banks', value: '12', icon: Droplet, color: 'bg-red-50 text-red-600' },
          { label: 'Pharmacies', value: '67', icon: Pill, color: 'bg-green-50 text-green-600' },
          { label: 'Ambulances', value: '45', icon: Ambulance, color: 'bg-purple-50 text-purple-600' },
          { label: 'Medical Staff', value: '892', icon: Users, color: 'bg-blue-50 text-blue-600' },
        ].map((stat) => (
          <Card key={stat.label} className={`p-5 ${stat.color}`}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className="w-6 h-6" />
              <p className="text-sm font-medium">{stat.label}</p>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Nearby Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceCards />

        <Card className="p-6 shadow-lg">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Resource Availability</h3>
          <div className="space-y-4">
            {[
              { name: 'Ambulances', total: 45, available: 28, inUse: 17 },
              { name: 'ICU Beds', total: 120, available: 34, inUse: 86 },
              { name: 'ER Rooms', total: 56, available: 12, inUse: 44 },
              { name: 'Blood Units (O-)', total: 450, available: 450, inUse: 0 },
            ].map((resource) => (
              <div key={resource.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900">{resource.name}</span>
                  <span className="text-gray-600">
                    <span className="text-green-600 font-semibold">{resource.available}</span> / {resource.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(resource.available / resource.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Critical Alerts */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
        <h3 className="font-bold text-lg text-gray-900 mb-3">🚨 Critical Resource Alerts</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Blood Type AB- Running Low</p>
              <p className="text-sm text-gray-600">Only 23 units remaining</p>
            </div>
            <Badge className="bg-red-500 text-white">Urgent</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">ICU Beds at Capacity</p>
              <p className="text-sm text-gray-600">St. Mary's Hospital - 98% full</p>
            </div>
            <Badge className="bg-orange-500 text-white">Warning</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
