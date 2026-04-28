import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { getEmergencyAlerts } from "../lib/emergencyAlerts";

type LatLng = [number, number];

export function LiveMap() {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  const [showEmergencies, setShowEmergencies] = useState(true);
  const [showResponders, setShowResponders] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);

  const [alerts, setAlerts] = useState<any[]>([]);

  // 🏥 Static hospitals (you can upgrade later to API)
  const hospitals: LatLng[] = [
    [21.1430, 74.8760],
    [21.1480, 74.8820],
  ];

  // 🔴 Load alerts (REAL DATA)
  useEffect(() => {
    setAlerts(getEmergencyAlerts());

    const refresh = () => setAlerts(getEmergencyAlerts());
    window.addEventListener("emergency_alert_update", refresh);

    return () => window.removeEventListener("emergency_alert_update", refresh);
  }, []);

  // 📍 Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  if (!userLocation) {
    return <div className="h-full flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="h-full w-full relative">

      {/* 🟠 FILTERS */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-xl shadow-md space-y-2">
        <label className="block text-sm">
          <input type="checkbox" checked={showEmergencies} onChange={() => setShowEmergencies(!showEmergencies)} /> Emergencies
        </label>
        <label className="block text-sm">
          <input type="checkbox" checked={showResponders} onChange={() => setShowResponders(!showResponders)} /> Responders
        </label>
        <label className="block text-sm">
          <input type="checkbox" checked={showHospitals} onChange={() => setShowHospitals(!showHospitals)} /> Hospitals
        </label>
      </div>

      {/* 🗺️ MAP */}
      <MapContainer center={userLocation} zoom={15} className="h-full w-full rounded-xl">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔵 USER */}
        <Marker position={userLocation}>
          <Popup>📍 You are here</Popup>
        </Marker>

        {/* 🔴 REAL EMERGENCIES */}
        {showEmergencies &&
          alerts.map((alert) => {
            const [lat, lng] = alert.coordinates.split(",").map(Number);

            return (
              <Marker key={alert.id} position={[lat, lng]}>
                <Popup>
                  🚨 {alert.type} <br />
                  {alert.location} <br />
                  Status: {alert.status}
                </Popup>
              </Marker>
            );
          })}

        {/* 🟢 RESPONDERS (when accepted) */}
        {showResponders &&
          alerts
            .filter((a) => a.status.includes("Accepted"))
            .map((alert) => {
              const [lat, lng] = alert.coordinates.split(",").map(Number);

              return (
                <Marker key={alert.id + "-responder"} position={[lat + 0.001, lng + 0.001]}>
                  <Popup>👨‍⚕️ Responder on the way</Popup>
                </Marker>
              );
            })}

        {/* 🏥 HOSPITALS */}
        {showHospitals &&
          hospitals.map((pos, i) => (
            <Marker key={i} position={pos}>
              <Popup>🏥 Hospital</Popup>
            </Marker>
          ))}

        {/* 🧠 HEATMAP (based on real alerts) */}
        {alerts.map((alert, i) => {
          const [lat, lng] = alert.coordinates.split(",").map(Number);

          return (
            <Circle
              key={i}
              center={[lat, lng]}
              radius={200}
              pathOptions={{ color: "red", fillOpacity: 0.3 }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}