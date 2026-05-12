'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BusTracking } from './tracking/BusTracking';
import { RouteSearch } from './search/RouteSearch';
import { DriverDashboard } from './driver/DriverDashboard';
import { ComplaintModal } from './ComplaintModal';
import {
  Bus,
  Clock,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/app/AuthContext';

// Mock alerts data
const mockAlerts = [
  { id: 1, type: 'delay', title: 'Bus Delayed', message: 'Bus #12 is delayed by 5 minutes', time: '5 mins ago' },
  { id: 2, type: 'route', title: 'Route Changed', message: 'New route activated due to traffic', time: '15 mins ago' },
  { id: 3, type: 'alert', title: 'Capacity Alert', message: 'Bus #05 is at 95% capacity', time: '30 mins ago' },
  { id: 4, type: 'update', title: 'Schedule Update', message: 'Bus #03 ETA updated to 09:05', time: '1 hour ago' },
  { id: 5, type: 'alert', title: 'Weather Alert', message: 'Heavy traffic expected on Route A', time: '2 hours ago' },
];

export function Dashboard() {
  const { user } = useAuth();
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notifications'>('overview');
  const [showComplaint, setShowComplaint] = useState(false);

  if (!user) {
    return null;
  }

  // Show driver dashboard for drivers
  if (user.role === 'driver') {
    return <DriverDashboard />;
  }

  // Show tracking view when a bus is selected in student dashboard
  if (user.role === 'student' && selectedBusId) {
    return (
      <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BusTracking busId={selectedBusId} onBack={() => setSelectedBusId(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
            {user.role === 'student' ? 'Student' : 'Admin'} Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Welcome back, {user.name}! {user.role === 'student' ? 'Find and track your bus in real-time.' : 'Manage your operations efficiently.'}
          </p>
        </div>

        {/* Student Dashboard */}
        {user.role === 'student' && (
          <div className="space-y-6">
            {/* IRCTC-style Route Search */}
            <RouteSearch onSelectBus={setSelectedBusId} />

            {/* Tabs and Actions */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-2 items-start xs:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm transition-all ${
                    activeTab === 'overview'
                      ? 'glass-card bg-purple-400/30 text-gray-800'
                      : 'glass-card bg-white/20 text-gray-700 hover:bg-white/30'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'notifications'
                      ? 'glass-card bg-purple-400/30 text-gray-800'
                      : 'glass-card bg-white/20 text-gray-700 hover:bg-white/30'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  Alerts
                </button>
              </div>
              <Button
                onClick={() => setShowComplaint(true)}
                className="glass-card bg-red-400/30 hover:bg-red-400/40 text-red-700 border border-red-200/50 font-medium text-sm"
              >
                Report Issue
              </Button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bus Card */}
                <Card className="glass-card p-6 card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <Bus className="w-6 h-6 text-purple-500" />
                    <h3 className="text-xl font-semibold text-gray-800">Your Bus</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/50 backdrop-blur">
                      <p className="text-sm text-gray-600">Bus Number</p>
                      <p className="text-2xl font-bold text-gray-800">12</p>
                    </div>

                    <div className="p-3 rounded-lg bg-white/50 backdrop-blur">
                      <p className="text-sm text-gray-600">Current Route</p>
                      <p className="font-semibold text-gray-800">Kolar → College</p>
                    </div>

                    <div className="p-3 rounded-lg bg-white/50 backdrop-blur">
                      <p className="text-sm text-gray-600">Driver</p>
                      <p className="font-semibold text-gray-800">Ramesh Kumar</p>
                    </div>

                    <Badge className="bg-gradient-to-r from-green-400 to-blue-400 text-white border-0 mt-2">
                      On Time
                    </Badge>
                  </div>
                </Card>

                {/* ETA Card */}
                <Card className="glass-card p-6 card-hover flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-semibold text-gray-800">Arrival Info</h3>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Estimated Arrival</p>
                    <p className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">5 mins</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Distance</span>
                        <span className="font-semibold text-gray-800">2.3 km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Speed</span>
                        <span className="font-semibold text-gray-800">45 km/h</span>
                      </div>
                    </div>
                  </div>

                  <Badge className="bg-gradient-to-r from-green-400 to-teal-400 text-white border-0 mt-4 w-fit">
                    Moving
                  </Badge>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-6 h-6 text-purple-500" />
                  <h3 className="text-xl font-semibold text-gray-800">Recent Alerts</h3>
                </div>

                <div className="space-y-3">
                  {mockAlerts.map((alert) => {
                    const alertTypeColors = {
                      delay: 'bg-orange-50/80 border-orange-200/50',
                      route: 'bg-blue-50/80 border-blue-200/50',
                      alert: 'bg-red-50/80 border-red-200/50',
                      update: 'bg-green-50/80 border-green-200/50',
                    };
                    const alertTypeIcons = {
                      delay: 'text-orange-600',
                      route: 'text-blue-600',
                      alert: 'text-red-600',
                      update: 'text-green-600',
                    };

                    return (
                      <div key={alert.id} className={`p-4 rounded-lg border ${alertTypeColors[alert.type as keyof typeof alertTypeColors]}`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className={`font-medium ${alertTypeIcons[alert.type as keyof typeof alertTypeIcons]}`}>
                            {alert.title}
                          </p>
                          <span className="text-xs text-gray-500">{alert.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{alert.message}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Complaint Modal */}
        <ComplaintModal
          isOpen={showComplaint}
          onClose={() => setShowComplaint(false)}
        />
      </div>
    </div>
  );
}