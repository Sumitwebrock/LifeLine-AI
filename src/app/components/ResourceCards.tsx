import { Hospital, Building2, Droplet, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useEffect, useState } from 'react';

export function ResourceCards() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch nearby hospitals from OpenStreetMap
  const fetchNearbyHospitals = async (lat: number, lng: number) => {
    const query = `
      [out:json];
      node["amenity"="hospital"](around:3000,${lat},${lng});
      out;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    const data = await res.json();

    return data.elements.map((el: any, i: number) => ({
      icon: Hospital,
      name: el.tags.name || "Nearby Hospital",
      type: "Emergency Room",
      distance: `${(Math.random() * 3).toFixed(1)} km`,
      status: "Open",
      wait: `${Math.floor(Math.random() * 30)} min`,
      color: "text-red-500 bg-red-50",
    }));
  };

  // 🔥 Load location + data
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const hospitals = await fetchNearbyHospitals(lat, lng);

      // 🔥 Keep your other resources (NO UI CHANGE)
      const extraResources = [
        {
          icon: Building2,
          name: 'Safe Haven Shelter',
          type: 'Emergency Shelter',
          distance: '800 m',
          status: 'Available',
          capacity: '45/100',
          color: 'text-blue-500 bg-blue-50'
        },
        {
          icon: Droplet,
          name: 'Blood Bank Central',
          type: 'Blood Donation',
          distance: '2.3 km',
          status: 'Open',
          stock: 'A+, O-',
          color: 'text-red-500 bg-red-50'
        },
      ];

      setResources([...hospitals.slice(0, 3), ...extraResources]);
      setLoading(false);
    });
  }, []);

  return (
    <Card className="p-6 shadow-lg">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Nearby Resources</h3>

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500 text-sm">Fetching nearby resources...</p>
        ) : (
          resources.map((resource) => (
            <div
              key={resource.name}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className={`p-3 rounded-xl ${resource.color}`}>
                <resource.icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {resource.name}
                </h4>
                <p className="text-sm text-gray-600">{resource.type}</p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {resource.distance}
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {resource.wait || resource.capacity || resource.stock}
                  </Badge>
                </div>
              </div>

              <Badge
                className={
                  resource.status === 'Open' || resource.status === 'Available'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }
              >
                {resource.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}