'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BusTracking } from './tracking/BusTracking';
import { RouteSearch } from './search/RouteSearch';
import { DriverDashboard } from './driver/DriverDashboard';
import { ComplaintModal } from './ComplaintModal';
import {
  Activity,
  Route,
  User,
  BarChart3,
  TrendingUp,
  Users,
  Bus,
  PlayCircle,
  StopCircle,
  Clock,
  AlertCircle,
  Settings,
  Bell,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/app/AuthContext';

// Mock bus data
const mockBuses = [
  { id: '01', number: 'BUS-01', route: 'Main Gate → College', driver: 'Raj', arrivalTime: '08:30', distance: '2.3 km', status: 'On Time', occupied: 42, capacity: 52 },
  { id: '02', number: 'BUS-02', route: 'Kolar → College', driver: 'Ramesh', arrivalTime: '09:15', distance: '5.8 km', status: 'On Time', occupied: 38, capacity: 52 },
  { id: '03', number: 'BUS-03', route: 'Downtown → College', driver: 'Kumar', arrivalTime: '09:05', distance: '3.5 km', status: 'Delayed', occupied: 45, capacity: 52 },
  { id: '04', number: 'BUS-04', route: 'Airport → College', driver: 'Vikram', arrivalTime: '10:00', distance: '7.2 km', status: 'On Time', occupied: 50, capacity: 52 },
  { id: '05', number: 'BUS-05', route: 'Station → College', driver: 'Arjun', arrivalTime: '08:15', distance: '1.2 km', status: 'On Time', occupied: 40, capacity: 52 },
  { id: '06', number: 'BUS-06', route: 'Market → College', driver: 'Suresh', arrivalTime: '10:45', distance: '9.1 km', status: 'On Time', occupied: 48, capacity: 52 },
];

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
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BusTracking busId={selectedBusId} onBack={() => setSelectedBusId(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {user.role === 'student' ? 'Student' : user.role === 'driver' ? 'Driver' : 'Admin'} Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.name}! {user.role === 'student' ? "Find and track your bus in real-time." : "Manage your operations efficiently."}
          </p>
        </div>

        {/* Student Dashboard */}
        {user.role === 'student' && (
          <div className="space-y-6">
            {/* IRCTC-style Route Search */}
            <RouteSearch onSelectBus={setSelectedBusId} />

            {/* Tabs and Actions */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'glass-card bg-purple-400/30 text-gray-800'
                      : 'glass-card bg-white/20 text-gray-700 hover:bg-white/30'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'notifications'
                      ? 'glass-card bg-purple-400/30 text-gray-800'
                      : 'glass-card bg-white/20 text-gray-700 hover:bg-white/30'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  Notifications
                </button>
              </div>
              <Button
                onClick={() => setShowComplaint(true)}
                className="glass-card bg-red-400/30 hover:bg-red-400/40 text-red-700 border border-red-200/50 font-medium"
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
                    <p className="text-5xl font-bold text-gray-800 mb-4">5 mins</p>

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

        {/* Driver Dashboard */}
        {user.role === 'driver' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trip Control */}
              <Card className="glass-card p-6 card-hover">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Trip Control</h3>

                <div className="space-y-4">
                  <Button className="w-full btn-glass bg-gradient-to-r from-green-400 to-green-500 text-white h-12 text-base font-medium flex items-center justify-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    Start Trip
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full btn-glass btn-outline-glass text-gray-800 h-12 text-base font-medium flex items-center justify-center gap-2"
                  >
                    <StopCircle className="w-5 h-5" />
                    Stop Trip
                  </Button>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-white/50 backdrop-blur">
                  <p className="text-sm text-gray-600">Trip Status</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="font-semibold text-gray-800">In Transit</p>
                  </div>
                </div>
              </Card>

              {/* Status Toggle */}
              <Card className="glass-card p-6 card-hover">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Status</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur">
                    <div>
                      <p className="text-sm text-gray-600">On-Time Status</p>
                      <p className="font-semibold text-gray-800 mt-1">Currently On Time</p>
                    </div>
                    <Badge className="bg-green-400/80 text-green-900 border-0">On</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur">
                    <div>
                      <p className="text-sm text-gray-600">Delay Status</p>
                      <p className="font-semibold text-gray-800 mt-1">No Delays</p>
                    </div>
                    <Badge className="bg-gray-400/80 text-gray-900 border-0">Off</Badge>
                  </div>
                </div>
              </Card>

              {/* Route Info */}
              <Card className="glass-card p-6 card-hover md:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Route</h3>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-white/50 backdrop-blur">
                    <p className="text-sm text-gray-600">Route Assignment</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">Kolar → College</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/50 backdrop-blur">
                      <p className="text-sm text-gray-600">Passengers</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">42/52</p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/50 backdrop-blur">
                      <p className="text-sm text-gray-600">Time Remaining</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">25 mins</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
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
