'use client';

import { BusRoute } from '@/lib/busTrackingData';
import { Check, Circle } from 'lucide-react';

interface StopsTimelineProps {
  route: BusRoute;
}

export function StopsTimeline({ route }: StopsTimelineProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Stops</h3>

      {/* Horizontal scrollable timeline for mobile, grid for desktop */}
      <div className="overflow-x-auto md:overflow-visible">
        <div className="flex md:flex-col gap-3 pb-2 md:pb-0 min-w-max md:min-w-full">
          {route.stops.map((stop, index) => (
            <div key={stop.id} className="flex items-start gap-3 flex-1 md:flex-initial">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                {/* Stop circle */}
                <div className="relative">
                  {stop.status === 'completed' && (
                    <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-green-600 flex items-center justify-center shadow">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {stop.status === 'current' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-3 border-blue-600 flex items-center justify-center shadow animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                  {stop.status === 'upcoming' && (
                    <div className="w-8 h-8 rounded-full border-2 border-gray-400 bg-white flex items-center justify-center">
                      <Circle className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Connector line */}
                {index < route.stops.length - 1 && (
                  <div
                    className="w-1 h-12 md:h-8 my-1 transition-all"
                    style={{
                      backgroundColor:
                        stop.status === 'completed' ? '#10b981' :
                        stop.status === 'current' ? '#3b82f6' :
                        '#d1d5db',
                    }}
                  ></div>
                )}
              </div>

              {/* Stop info */}
              <div className="pt-1 flex-1">
                <p className={`font-semibold text-sm ${
                  stop.status === 'completed' ? 'text-green-700' :
                  stop.status === 'current' ? 'text-blue-700' :
                  'text-gray-600'
                }`}>
                  {stop.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stop.status === 'completed' && 'Completed'}
                  {stop.status === 'current' && 'Current Stop'}
                  {stop.status === 'upcoming' && 'Upcoming'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
