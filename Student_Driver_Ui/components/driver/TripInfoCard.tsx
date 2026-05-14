'use client';

import { MapPin, Clock, Users, Navigation, ChevronRight, Zap } from 'lucide-react';

interface TripInfoCardProps {
  route: string;
  currentStop: string;
  nextStop: string;
  eta: string;
  distanceKm: number;
  passengers: number;
  capacity: number;
  speed: number;
  status: 'offline' | 'on-trip' | 'paused' | 'delayed';
}

const STATUS_STYLES = {
  offline:  'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'on-trip':'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  paused:   'bg-amber-500/20 text-amber-400 border-amber-500/30',
  delayed:  'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_LABELS = {
  offline: 'Offline',
  'on-trip': 'On Trip',
  paused: 'Paused',
  delayed: 'Delayed',
};

export function TripInfoCard({
  route, currentStop, nextStop, eta, distanceKm, passengers, capacity, speed, status,
}: TripInfoCardProps) {
  const occupancy = Math.round((passengers / capacity) * 100);

  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-4">
      {/* Route + status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-gray-400 text-xs mb-0.5">Current Route</p>
          <p className="text-white font-bold text-base leading-tight">{route}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Stop info */}
      <div className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
        <div className="flex-1">
          <p className="text-gray-500 text-xs">Current Stop</p>
          <p className="text-white font-semibold text-sm mt-0.5">{currentStop}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
        <div className="flex-1 text-right">
          <p className="text-gray-500 text-xs">Next Stop</p>
          <p className="text-indigo-400 font-semibold text-sm mt-0.5">{nextStop}</p>
        </div>
      </div>

      {/* Stats grid — 2 cols on xs, 3 on sm+ */}
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <Clock className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
          <p className="text-white font-bold text-sm">{eta}</p>
          <p className="text-gray-500 text-xs">ETA</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <Navigation className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-white font-bold text-sm">{distanceKm.toFixed(1)} km</p>
          <p className="text-gray-500 text-xs">Remaining</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-white font-bold text-sm">{speed} km/h</p>
          <p className="text-gray-500 text-xs">Speed</p>
        </div>
      </div>

      {/* Passenger bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400 text-xs">Passengers</span>
          </div>
          <span className="text-white text-xs font-semibold">{passengers}/{capacity}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              occupancy > 90 ? 'bg-red-500' : occupancy > 70 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${occupancy}%` }}
          />
        </div>
      </div>
    </div>
  );
}
