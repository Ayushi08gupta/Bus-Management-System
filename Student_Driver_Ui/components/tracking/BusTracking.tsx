'use client';

import { useState, useEffect } from 'react';
import { BusRoute, busRoutesData } from '@/lib/busTrackingData';
import { MapView } from './MapView';
import { TrackingPanel } from './TrackingPanel';
import { StopsTimeline } from './StopsTimeline';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause } from 'lucide-react';

interface BusTrackingProps {
  busId: string;
  onBack: () => void;
}

export function BusTracking({ busId, onBack }: BusTrackingProps) {
  const route = busRoutesData[busId];
  const [isTracking, setIsTracking] = useState(false);
  const [animatedRoute, setAnimatedRoute] = useState<BusRoute>(route);

  // Simulate bus movement
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setAnimatedRoute(prev => {
        if (prev.progress >= 100) {
          setIsTracking(false);
          return prev;
        }

        const newProgress = Math.min(prev.progress + 2, 100);
        const updatedStops = prev.stops.map(stop => {
          let status: 'completed' | 'current' | 'upcoming';
          if (newProgress >= stop.position + 10) {
            status = 'completed';
          } else if (newProgress >= stop.position - 10 && newProgress <= stop.position + 10) {
            status = 'current';
          } else {
            status = 'upcoming';
          }
          return {
            ...stop,
            status,
          };
        });

        return {
          ...prev,
          progress: newProgress,
          stops: updatedStops,
        };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isTracking]);

  if (!route) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Bus not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Buses
        </button>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsTracking(!isTracking)}
            className="btn-glass btn-gradient flex items-center gap-2"
          >
            {isTracking ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Tracking
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Map Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Live Route Map</h2>
        <MapView route={animatedRoute} isTracking={isTracking} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tracking Panel */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <TrackingPanel route={animatedRoute} />
        </div>

        {/* Right: Stops Timeline */}
        <div className="lg:col-span-2 order-1 lg:order-2 glass-card p-6 rounded-2xl">
          <StopsTimeline route={animatedRoute} />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="glass-card p-4 rounded-xl bg-blue-50/50 border border-blue-200/50">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Live Tracking:</span> The bus position updates in real-time. You can track the bus journey from start to finish.
        </p>
      </div>
    </div>
  );
}
