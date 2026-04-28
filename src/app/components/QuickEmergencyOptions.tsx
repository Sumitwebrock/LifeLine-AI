import { Heart, Flame, Car, Cloud, Shield } from 'lucide-react';

const options = [
  { icon: Heart, label: 'Medical', color: 'bg-red-100 text-red-600 hover:bg-red-200' },
  { icon: Flame, label: 'Fire', color: 'bg-orange-100 text-orange-600 hover:bg-orange-200' },
  { icon: Car, label: 'Accident', color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
  { icon: Cloud, label: 'Disaster', color: 'bg-purple-100 text-purple-600 hover:bg-purple-200' },
  { icon: Shield, label: 'Safety', color: 'bg-green-100 text-green-600 hover:bg-green-200' },
];

export function QuickEmergencyOptions() {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {options.map((option, index) => (
        <button
          key={option.label}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${option.color} transition-all shadow-sm hover:shadow-md`}
        >
          <option.icon className="w-6 h-6" />
          <span className="text-sm font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
