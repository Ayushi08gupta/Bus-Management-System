'use client';

import { CheckCircle, Circle, MapPin } from 'lucide-react';

export interface Stop {
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  time?: string;
}

export function RouteTimeline({ stops }: { stops: Stop[] }) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">Route Stops</p>
      <div className="space-y-0">
        {stops.map((stop, i) => {
          const isLast = i === stops.length - 1;
          return (
            <div key={stop.name} className="flex gap-3">
              {/* Timeline spine */}
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  stop.status === 'completed' ? 'bg-emerald-500/20' :
                  stop.status === 'current'   ? 'bg-indigo-500/30 ring-2 ring-indigo-500/60' :
                                                'bg-white/5'
                }`}>
                  {stop.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : stop.status === 'current' ? (
                    <MapPin className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 my-1 min-h-[20px] ${
                    stop.status === 'completed' ? 'bg-emerald-500/40' : 'bg-white/10'
                  }`} />
                )}
              </div>

              {/* Stop info */}
              <div className={`pb-4 flex-1 flex justify-between items-start ${isLast ? 'pb-0' : ''}`}>
                <div>
                  <p className={`font-semibold text-sm ${
                    stop.status === 'current'   ? 'text-indigo-300' :
                    stop.status === 'completed' ? 'text-gray-500 line-through' :
                                                  'text-gray-300'
                  }`}>
                    {stop.name}
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5 capitalize">{stop.status}</p>
                </div>
                {stop.time && (
                  <span className="text-gray-500 text-xs">{stop.time}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
