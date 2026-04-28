import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export function SOSButton() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="relative w-64 h-64 rounded-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse"
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        <div className="flex flex-col items-center justify-center h-full text-white">
          <AlertTriangle className="w-16 h-16 mb-2" />
          <span className="text-3xl font-bold">SOS</span>
          <span className="text-sm mt-2">TAP FOR EMERGENCY</span>
        </div>
      </button>
      <p className="text-sm text-gray-500">Press & hold for 3 seconds</p>
    </div>
  );
}
