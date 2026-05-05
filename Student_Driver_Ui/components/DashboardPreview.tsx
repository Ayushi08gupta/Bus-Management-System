'use client';

import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Clock, AlertCircle, Bus } from 'lucide-react';

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Dashboard Preview
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what your tracking experience will look like
          </p>
        </div>

        {/* Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Bus Card */}
          <Card className="glass-card p-6 card-hover lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Bus Status</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-white/50 backdrop-blur">
                <p className="text-sm text-gray-600">Bus Number</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>

              <div className="p-3 rounded-lg bg-white/50 backdrop-blur">
                <p className="text-sm text-gray-600">Route</p>
                <p className="text-lg font-semibold text-gray-800">Kolar → College</p>
              </div>

              <div className="p-3 rounded-lg bg-white/50 backdrop-blur">
                <p className="text-sm text-gray-600">Driver</p>
                <p className="text-lg font-semibold text-gray-800">Ramesh</p>
              </div>
            </div>
          </Card>

          {/* Live Map Card */}
          <Card className="glass-card p-6 card-hover lg:col-span-1 flex flex-col justify-center items-center min-h-64">
            <MapPin className="w-16 h-16 text-green-500 mb-4 animate-pulse" />
            <p className="text-center font-semibold text-gray-800">Live Map View</p>
            <p className="text-sm text-gray-600 text-center mt-2">Real-time location tracking</p>
          </Card>

          {/* ETA Badge Card */}
          <Card className="glass-card p-6 card-hover lg:col-span-1 flex flex-col justify-center items-center">
            <Clock className="w-12 h-12 text-blue-500 mb-3" />
            <p className="text-sm text-gray-600">Estimated Arrival</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">5 mins</p>
            <Badge className="mt-4 bg-gradient-to-r from-green-400 to-blue-400 text-white border-0">
              On Time
            </Badge>
          </Card>

          {/* Notifications */}
          <Card className="glass-card p-6 card-hover lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-orange-50/80 border border-orange-200/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Bus Delayed</p>
                  <p className="text-sm text-gray-600">Bus #12 is delayed by 10 minutes due to traffic</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50/80 border border-blue-200/50 flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Driver is nearby</p>
                  <p className="text-sm text-gray-600">Your bus is 2 stops away, arriving in 5 minutes</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
