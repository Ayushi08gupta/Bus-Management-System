'use client';

import { useMemo } from 'react';
import { BusRoute } from '@/lib/busTrackingData';
import { Bus, MapPin, Circle } from 'lucide-react';

interface MapViewProps {
  route: BusRoute;
  isTracking: boolean;
}

export function MapView({ route, isTracking }: MapViewProps) {
  const stopPositions = useMemo(() => {
    return route.stops.map(stop => ({
      ...stop,
      left: `${stop.position}%`,
    }));
  }, [route.stops]);

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl overflow-hidden border border-blue-200/50 shadow-lg">
      {/* Map Background */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-sky-100 to-blue-100 overflow-hidden">
        {/* Decorative grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Route Polyline */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Curved route path */}
          <path
            d="M 5% 50% Q 35% 30%, 65% 70% T 95% 40%"
            stroke="url(#routeGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="0, 4"
          />

          {/* Completed path highlight */}
          <path
            d="M 5% 50% Q 35% 30%, 65% 70% T 95% 40%"
            stroke="#10b981"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
            style={{
              strokeDasharray: `${route.progress * 1.5}, 10000`,
              transition: 'stroke-dasharray 1s ease-out',
            }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Stop Markers */}
        <div className="absolute inset-0">
          {stopPositions.map((stop) => (
            <div
              key={stop.id}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: stop.left }}
            >
              {stop.status === 'completed' && (
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-green-600 shadow-lg flex items-center justify-center text-xs font-bold text-white">
                    ✓
                  </div>
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <p className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow">
                      {stop.name}
                    </p>
                  </div>
                </div>
              )}

              {stop.status === 'current' && (
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-3 border-blue-600 shadow-lg flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-blue-500 animate-ping opacity-75"></div>
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <p className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded shadow border border-blue-200">
                      {stop.name}
                    </p>
                  </div>
                </div>
              )}

              {stop.status === 'upcoming' && (
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-white shadow flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <p className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
                      {stop.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bus Marker - Animated */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000"
          style={{
            left: isTracking ? `${route.progress}%` : `${route.progress}%`,
          }}
        >
          <div className="relative">
            {/* Glow effect */}
            {isTracking && (
              <div className="absolute inset-0 w-12 h-12 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
            )}

            {/* Bus icon */}
            <div className="relative w-10 h-10 bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg shadow-lg border-2 border-purple-700 flex items-center justify-center transform -rotate-45 hover:scale-110 transition-transform">
              <Bus className="w-5 h-5 text-white transform rotate-45" />
            </div>

            {/* Location label */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg border border-purple-700">
                {route.currentLocation}
              </div>
              <div className="w-2 h-2 bg-purple-600 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"></div>
            </div>
          </div>
        </div>

        {/* Map controls hint */}
        {isTracking && (
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg shadow">
            <p className="text-xs text-gray-700 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Live Tracking Active
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
