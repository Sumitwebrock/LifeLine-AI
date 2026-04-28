import { Home, Map, AlertCircle, Users, Package, Brain, Bell, User, Settings } from 'lucide-react';
import { Badge } from './ui/badge';
import { useNavigate, useLocation } from 'react-router';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/app' },
  { icon: Map, label: 'Map', path: '/app/map' },
  // { icon: AlertCircle, label: 'Emergencies', badge: 3, path: '/app/emergencies' },
  { icon: Users, label: 'Responders', path: '/app/responders' },
  { icon: Package, label: 'Resources', path: '/app/resources' },
  { icon: Brain, label: 'Insights', path: '/app/insights' },
  { icon: Bell, label: 'Alerts', badge: 5, path: '/app/alerts' },
  { icon: User, label: 'Profile', path: '/app/profile' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

export function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 bg-[#1E293B] border-r border-gray-700 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700 cursor-pointer" onClick={() => navigate('/')}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">LifeLine</h1>
            <p className="text-xs text-gray-400">Emergency Response</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 text-left font-medium">{item.label}</span>
            {item.badge && (
              <Badge className="bg-red-500 text-white">{item.badge}</Badge>
            )}
          </button>
        ))}
      </nav>

    </div>
  );
}
