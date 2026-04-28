import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Brain, BarChart3 } from 'lucide-react';

export function AIInsightsPage() {
  const [location, setLocation] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any[]>([]);

  useEffect(() => {
  const generateAI = (lat: number, lng: number) => {
    setLocation({ lat, lng });

    // 🌦️ fake weather
    const conditions = ["Sunny", "Rainy", "Cloudy", "Storm"];
    const selected = conditions[Math.floor(Math.random() * conditions.length)];

    const temp = Math.floor(Math.random() * 10 + 25);

    setWeather({
      condition: selected,
      temp,
    });

    const insights: any[] = [];

    if (selected === "Rainy") {
      insights.push({
        title: "Flood Risk Detected",
        desc: "Low-lying areas may flood in next 4-6 hours",
        severity: "High",
        icon: "🌧️"
      });
    }

    if (selected === "Storm") {
      insights.push({
        title: "High Accident Probability",
        desc: "Visibility low, increase responder readiness",
        severity: "High",
        icon: "⚡"
      });
    }

    if (selected === "Sunny") {
      insights.push({
        title: "Heat Exposure Risk",
        desc: "High temperature may cause dehydration cases",
        severity: "Low",
        icon: "☀️"
      });
    }

    // 🕒 time logic
    const hour = new Date().getHours();

    if (hour >= 17 && hour <= 21) {
      insights.push({
        title: "Traffic Surge Detected",
        desc: "Peak hours → accident risk +30%",
        severity: "Medium",
        icon: "🚗"
      });
    }

    if (hour >= 0 && hour <= 5) {
      insights.push({
        title: "Low Activity Zone",
        desc: "Fewer responders active, delays possible",
        severity: "Low",
        icon: "🌙"
      });
    }

    // ✅ ALWAYS ensure at least 1 insight
    if (insights.length === 0) {
      insights.push({
        title: "System Stable",
        desc: "No major risks detected in your area",
        severity: "Low",
        icon: "✅"
      });
    }

    setAiInsights(insights);
  };

  // 🔥 TRY GEOLOCATION
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        generateAI(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.log("Location denied → using fallback");
        generateAI(20.5937, 78.9629); // India fallback
      }
    );
  } else {
    generateAI(20.5937, 78.9629);
  }
}, []);

  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-full">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
        <p className="text-gray-600">Performance metrics and data-driven recommendations</p>
      </div>

      {/* 📍 LOCATION + WEATHER */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <h3 className="font-bold text-lg text-gray-900 mb-3">📍 Live Location Intelligence</h3>

        {location ? (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Latitude</p>
              <p className="font-semibold">{location.lat.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-gray-500">Longitude</p>
              <p className="font-semibold">{location.lng.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-gray-500">Weather</p>
              <p className="font-semibold">
                {weather?.condition} • {weather?.temp}°C
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Fetching location...</p>
        )}
      </Card>

      {/* METRICS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Response Time', value: '2.3 min', change: '-40%', trend: 'down', color: 'bg-green-50 text-green-600' },
          { label: 'Success Rate', value: '95.2%', change: '+5%', trend: 'up', color: 'bg-blue-50 text-blue-600' },
          { label: 'Active Zones', value: '12', change: '+3', trend: 'up', color: 'bg-orange-50 text-orange-600' },
          { label: 'Match Accuracy', value: '98.7%', change: '+2%', trend: 'up', color: 'bg-purple-50 text-purple-600' },
        ].map((metric) => (
          <Card key={metric.label} className={`p-4 ${metric.color}`}>
            <p className="text-sm font-medium mb-1">{metric.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className={`flex items-center gap-1 text-sm ${metric.trend === 'down' ? 'text-green-600' : 'text-blue-600'}`}>
                {metric.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                {metric.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 🧠 AI ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-lg text-gray-900">Smart Alerts</h3>
          </div>

          <div className="space-y-3">
            {aiInsights.length > 0 ? aiInsights.map((alert) => (
              <div key={alert.title} className="p-4 bg-white rounded-xl border border-purple-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{alert.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <Badge className={
                        alert.severity === 'High' ? 'bg-red-500 text-white' :
                        alert.severity === 'Medium' ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{alert.desc}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">Generating insights...</p>
            )}
          </div>
        </Card>

        {/* RISK ZONES (STATIC KEEP SAME UI) */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="font-bold text-lg text-gray-900">High Risk Zones</h3>
          </div>

          <div className="space-y-3">
            {[
              { zone: 'Downtown Area', risk: 'High', incidents: 8, type: 'Medical' },
              { zone: 'Highway 45', risk: 'Medium', incidents: 5, type: 'Accidents' },
              { zone: 'East District', risk: 'High', incidents: 6, type: 'Safety' },
            ].map((zone) => (
              <div key={zone.zone} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{zone.zone}</h4>
                  <Badge className={
                    zone.risk === 'High' ? 'bg-red-100 text-red-700' :
                    zone.risk === 'Medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }>
                    {zone.risk} Risk
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{zone.incidents} incidents today</span>
                  <span className="text-blue-600 font-medium">{zone.type}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ANALYTICS */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-lg text-gray-900">Performance Analytics</h3>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { title: 'Matching Efficiency', value: '98.7%', desc: 'Optimal responder matches' },
            { title: 'Resource Optimization', value: '92.3%', desc: 'Efficient allocation rate' },
            { title: 'Forecast Accuracy', value: '96.1%', desc: 'Prediction reliability' },
          ].map((metric) => (
            <div key={metric.title} className="text-center p-4 bg-gradient-to-b from-blue-50 to-white rounded-xl">
              <p className="text-sm text-gray-600 mb-2">{metric.title}</p>
              <p className="text-4xl font-bold text-blue-600 mb-1">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.desc}</p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}