import { Card } from './ui/card';
import { ArrowRight } from 'lucide-react';

export function ResourceAllocationAI() {
  return (
    <Card className="p-6 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Resource Coordination</h3>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 p-4 bg-white rounded-xl border-2 border-purple-200 text-center">
          <div className="text-2xl mb-2">🚨</div>
          <p className="text-sm font-medium text-gray-700">Emergency Needs</p>
          <p className="text-xs text-gray-500 mt-1">Medical, Transport</p>
        </div>

        <ArrowRight className="w-6 h-6 text-purple-400 flex-shrink-0" />

        <div className="flex-1 p-4 bg-white rounded-xl border-2 border-indigo-200 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-sm font-medium text-gray-700">Smart Dispatch</p>
          <p className="text-xs text-gray-500 mt-1">Auto Matching</p>
        </div>

        <ArrowRight className="w-6 h-6 text-indigo-400 flex-shrink-0" />

        <div className="flex-1 p-4 bg-white rounded-xl border-2 border-green-200 text-center">
          <div className="text-2xl mb-2">✅</div>
          <p className="text-sm font-medium text-gray-700">Resources</p>
          <p className="text-xs text-gray-500 mt-1">Doctor, Ambulance</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg">
        <p className="text-xs text-gray-600">
          <span className="font-semibold text-purple-600">Smart System:</span> Matches based on proximity,
          availability, and specialization for optimal response time.
        </p>
      </div>
    </Card>
  );
}
