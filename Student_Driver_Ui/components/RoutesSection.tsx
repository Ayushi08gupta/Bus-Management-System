'use client';

import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Clock } from 'lucide-react';

const routes = [
  {
    busNumber: '01',
    startStop: 'Main Gate',
    stops: ['Main Gate', 'Tech Park', 'Central Hub', 'College'],
    duration: '45 mins',
    status: 'Active',
  },
  {
    busNumber: '12',
    startStop: 'Kolar',
    stops: ['Kolar', 'Highway Junction', 'Bus Stand', 'College'],
    duration: '35 mins',
    status: 'Active',
  },
  {
    busNumber: '24',
    startStop: 'Downtown',
    stops: ['Downtown', 'Market Street', 'North Avenue', 'College'],
    duration: '50 mins',
    status: 'Delayed',
  },
];

export function RoutesSection() {
  return (
    <section id="routes" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Available Routes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check out our comprehensive bus routes serving your college
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <Card key={index} className="glass-card p-6 card-hover relative overflow-hidden">
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <Badge
                  className={`${
                    route.status === 'Active'
                      ? 'bg-green-400/80 text-green-900'
                      : 'bg-orange-400/80 text-orange-900'
                  } border-0`}
                >
                  {route.status}
                </Badge>
              </div>

              {/* Bus Number */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">Bus Number</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  {route.busNumber}
                </p>
              </div>

              {/* Timeline Stops */}
              <div className="space-y-3 my-6">
                {route.stops.map((stop, stopIndex) => (
                  <div key={stopIndex} className="flex items-center gap-3">
                    {/* Vertical Line */}
                    {stopIndex < route.stops.length - 1 && (
                      <div className="absolute left-6 top-32 w-0.5 h-12 bg-gradient-to-b from-purple-400 to-blue-400 opacity-50"></div>
                    )}

                    {/* Stop Circle */}
                    <div className="relative z-10">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          stopIndex === 0 || stopIndex === route.stops.length - 1
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                            : 'bg-gradient-to-r from-green-400 to-cyan-400'
                        }`}
                      ></div>
                    </div>

                    {/* Stop Name */}
                    <div>
                      <p className={`font-medium ${
                        stopIndex === 0 || stopIndex === route.stops.length - 1
                          ? 'text-gray-800'
                          : 'text-gray-700'
                      }`}>
                        {stop}
                      </p>
                      {stopIndex === 0 && (
                        <p className="text-xs text-gray-500">Departure</p>
                      )}
                      {stopIndex === route.stops.length - 1 && (
                        <p className="text-xs text-gray-500">Arrival</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Duration */}
              <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Duration: {route.duration}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
