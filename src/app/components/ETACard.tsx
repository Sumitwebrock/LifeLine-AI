import { Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

export function ETACard() {
  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Circular progress */}
          <div className="w-32 h-32 relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#22C55E"
                strokeWidth="8"
                fill="none"
                strokeDasharray="351.86"
                strokeDashoffset="87.96"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">2</div>
                <div className="text-sm text-gray-600">min</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="font-bold text-lg text-gray-900 mb-1">Help is on the way</h3>
          <p className="text-sm text-gray-600">Dr. Sarah Johnson is approaching</p>
        </div>

        <div className="w-full space-y-2">
          <Progress value={75} className="h-2" />
          <p className="text-xs text-center text-gray-500">3 of 4 steps completed</p>
        </div>
      </div>
    </Card>
  );
}
