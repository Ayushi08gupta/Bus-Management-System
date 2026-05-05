'use client';

import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  MapPin,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  AlertCircle,
  Play,
  Square,
  Zap,
  Phone,
} from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertModal = ({ isOpen, onClose, onConfirm }: AlertModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="glass-card p-6 max-w-sm mx-4">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Send Delay Alert</h3>
        <p className="text-gray-600 text-center text-sm mb-6">
          Students and admins will be notified about the delay. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 btn-glass btn-outline-glass text-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-500/80 hover:bg-red-600 text-white font-medium"
          >
            Send Alert
          </Button>
        </div>
      </Card>
    </div>
  );
};

export function DriverDashboard() {
  const [tripStarted, setTripStarted] = useState(false);
  const [isDelayed, setIsDelayed] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [tripProgress, setTripProgress] = useState(0);
  const [completedStops, setCompletedStops] = useState(0);

  // Simulate trip progress
  useEffect(() => {
    if (!tripStarted) return;

    const interval = setInterval(() => {
      setTripProgress(prev => {
        if (prev >= 100) {
          setTripStarted(false);
          return 0;
        }
        return prev + 1;
      });

      // Update completed stops
      setCompletedStops(Math.floor(tripProgress / 25));
    }, 500);

    return () => clearInterval(interval);
  }, [tripStarted, tripProgress]);

  const totalStops = 5;
  const remainingStops = totalStops - completedStops - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50">
      {/* Map Section */}
      <div className="h-64 md:h-96 bg-gradient-to-br from-purple-200 to-blue-200 relative overflow-hidden">
        {/* Simple route visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce" />
            <p className="text-gray-600 text-sm">Live map view</p>
          </div>
        </div>

        {/* Progress indicator on map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-1 bg-gray-400 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${tripProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet / Panel */}
      <div className="bg-transparent px-4 py-6 md:max-w-lg md:mx-auto">
        {/* Status Card */}
        <Card className="glass-card border-white/20 p-6 mb-6 rounded-2xl">
          <div className="space-y-4">
            {/* Bus Info */}
            <div>
              <p className="text-gray-600 text-sm">Bus Number</p>
              <p className="text-2xl font-bold text-gray-800">BUS-12</p>
            </div>

            {/* Route */}
            <div>
              <p className="text-gray-600 text-sm mb-2">Route</p>
              <div className="flex items-center gap-2 text-gray-800">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>Kolar → College</span>
              </div>
            </div>

            {/* Current Stop */}
            <div>
              <p className="text-gray-600 text-sm">Current Stop</p>
              <p className="text-lg font-semibold text-gray-800">City Center</p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-gray-600 text-sm">Status:</span>
              <Badge
                className={`${
                  isDelayed
                    ? 'bg-red-500/80 text-white'
                    : tripStarted
                      ? 'bg-green-500/80 text-white'
                      : 'bg-gray-600 text-gray-100'
                } border-0 font-medium`}
              >
                {isDelayed ? 'Delayed' : tripStarted ? 'On Trip' : 'Offline'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Primary Action Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={() => setTripStarted(!tripStarted)}
            className={`w-full h-14 rounded-xl font-semibold text-base ${
              tripStarted
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {tripStarted ? (
              <>
                <Square className="w-5 h-5 mr-2" />
                End Trip
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Trip
              </>
            )}
          </Button>

          {tripStarted && (
            <Button
              onClick={() => setShowAlertModal(true)}
              className="w-full h-12 rounded-xl font-semibold bg-orange-500/80 hover:bg-orange-600 text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Send Delay Alert
            </Button>
          )}
        </div>

        {/* Status Controls */}
        {tripStarted && (
          <Card className="bg-gray-800 border-gray-700 p-4 mb-6 rounded-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Status</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsDelayed(false)}
                    variant={!isDelayed ? 'default' : 'outline'}
                    className={`text-sm ${
                      !isDelayed ? 'bg-green-500 text-white' : 'border-gray-600 text-gray-300'
                    }`}
                  >
                    On Time
                  </Button>
                  <Button
                    onClick={() => setIsDelayed(true)}
                    variant={isDelayed ? 'default' : 'outline'}
                    className={`text-sm ${
                      isDelayed ? 'bg-red-500 text-white' : 'border-gray-600 text-gray-300'
                    }`}
                  >
                    Delayed
                  </Button>
                </div>
              </div>

              {/* Delay Reason */}
              {isDelayed && (
                <Input
                  type="text"
                  placeholder="Reason (optional)"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="bg-white/30 border-white/20 text-gray-800 placeholder-gray-600"
                />
              )}
            </div>
          </Card>
        )}

        {/* Trip Progress */}
        {tripStarted && (
          <Card className="glass-card border-white/20 p-4 mb-6 rounded-xl">
            <div className="space-y-4">
              <h3 className="text-gray-800 font-semibold flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                Trip Progress
              </h3>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm">Journey Progress</span>
                  <span className="text-gray-800 font-semibold">{tripProgress}%</span>
                </div>
                <div className="w-full bg-gray-300/50 rounded-full h-3">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${tripProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stop Stats */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center">
                  <p className="text-gray-600 text-xs">Total</p>
                  <p className="text-gray-800 font-bold text-lg">{totalStops}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-xs">Completed</p>
                  <p className="text-green-600 font-bold text-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {completedStops}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-xs">Remaining</p>
                  <p className="text-blue-600 font-bold text-lg">{remainingStops}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Additional Controls */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            className="h-12 rounded-xl bg-purple-400/70 hover:bg-purple-400 text-white font-medium"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navigate Route
          </Button>
          <Button
            className="h-12 rounded-xl bg-blue-400/70 hover:bg-blue-400 text-white font-medium"
          >
            <Phone className="w-4 h-4 mr-2" />
            Support
          </Button>
        </div>

        {/* Notifications */}
        {!tripStarted && (
          <Card className="glass-card border-blue-300/40 p-4 rounded-xl mb-6 bg-blue-100/30">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 text-sm font-medium">Route Updated</p>
                <p className="text-blue-700 text-xs mt-1">New stops added by admin</p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <Card className="glass-card border-white/20 p-4 rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Users className="w-5 h-5 text-purple-500 mx-auto mb-2" />
              <p className="text-gray-600 text-xs">Passengers</p>
              <p className="text-gray-800 font-bold text-lg">38/52</p>
            </div>
            <div className="text-center">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600 text-xs">Avg. Speed</p>
              <p className="text-gray-800 font-bold text-lg">45 km/h</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onConfirm={() => {
          setShowAlertModal(false);
          // Handle alert confirmation
        }}
      />
    </div>
  );
}
