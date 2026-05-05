'use client';

import { BusRoute } from '@/lib/busTrackingData';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, AlertCircle } from 'lucide-react';

interface TrackingPanelProps {
  route: BusRoute;
}

export function TrackingPanel({ route }: TrackingPanelProps) {
  const statusColor = route.status === 'On Time' 
    ? 'bg-green-100/80 text-green-800 border-green-300' 
    : 'bg-orange-100/80 text-orange-800 border-orange-300';

  return (
    <div className="space-y-4">
      {/* Bus Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{route.busNumber}</h2>
            <p className="text-gray-600 mt-1 font-medium">{route.routeName}</p>
          </div>
          <Badge className={`${statusColor} border-2 py-2 px-3 text-sm font-semibold`}>
            {route.status}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Journey Progress</span>
            <span className="text-sm font-bold text-gray-800">{route.progress}%</span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden border border-gray-300/50">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${route.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* ETA Card */}
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Estimated Arrival</p>
              <p className="text-lg font-bold text-gray-800">{route.eta}</p>
            </div>
          </div>
        </div>

        {/* Driver Card */}
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Driver</p>
              <p className="text-lg font-bold text-gray-800">{route.driver}</p>
            </div>
          </div>
        </div>

        {/* Current Location Card */}
        <div className="glass-card p-4 rounded-xl sm:col-span-2">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 font-medium">Current Location</p>
              <p className="text-lg font-bold text-gray-800">{route.currentLocation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      {route.status === 'Delayed' && (
        <div className="glass-card p-4 rounded-xl border-l-4 border-orange-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-800">Bus is running behind schedule</p>
              <p className="text-sm text-orange-700 mt-1">The bus may arrive a few minutes later than expected.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
