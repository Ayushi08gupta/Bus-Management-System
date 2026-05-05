'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Phone, AlertCircle } from 'lucide-react';

interface DriverDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackBus: () => void;
  busNumber: string;
  driver: {
    name: string;
    rating: number;
    totalRides: number;
    phone: string;
    experience: string;
    vehicle: string;
    licensePlate: string;
  };
}

export function DriverDetailsModal({
  isOpen,
  onClose,
  onTrackBus,
  busNumber,
  driver,
}: DriverDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Driver Details - {busNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Driver Profile */}
          <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-200/50">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">{driver.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{driver.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(driver.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm font-medium text-gray-700">
                  {driver.rating}/5 ({driver.totalRides} rides)
                </span>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          <div className="space-y-3">
            <div className="p-3 bg-white/50 rounded-lg border border-white/30">
              <p className="text-xs text-gray-500 mb-1">Experience</p>
              <p className="font-semibold text-gray-800">{driver.experience}</p>
            </div>

            <div className="p-3 bg-white/50 rounded-lg border border-white/30">
              <p className="text-xs text-gray-500 mb-1">Vehicle</p>
              <p className="font-semibold text-gray-800">{driver.vehicle}</p>
            </div>

            <div className="p-3 bg-white/50 rounded-lg border border-white/30">
              <p className="text-xs text-gray-500 mb-1">License Plate</p>
              <p className="font-mono font-bold text-lg text-gray-800">{driver.licensePlate}</p>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200/50">
              <p className="text-xs text-gray-500 mb-2">Emergency Contact</p>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white/70 border-blue-200">
                <Phone className="w-4 h-4" />
                {driver.phone}
              </Button>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-yellow-50/50 rounded-lg border border-yellow-200/50 flex gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">
              If you feel unsafe at any point, use the complaint feature or contact college authority immediately.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-white/50 border-white/30 text-gray-800 hover:bg-white/70"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button className="btn-glass btn-gradient" onClick={onTrackBus}>
              Track Bus
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
