'use client';

import dynamic from 'next/dynamic';
import { busRoutesData } from '@/lib/busTrackingData';
import { StopsTimeline } from './StopsTimeline';
import { TrackingPanel } from './TrackingPanel';
import { ArrowLeft } from 'lucide-react';
import type { RouteStop } from './LiveTrackingMap';

// Leaflet must be loaded client-side only (no SSR)
const LiveTrackingMap = dynamic(
  () => import('./LiveTrackingMap').then(m => m.LiveTrackingMap),
  { ssr: false, loading: () => <div className="rounded-2xl bg-gray-100 animate-pulse" style={{ height: 'clamp(240px, 45vw, 480px)' }} /> }
);

// Map static route stops to real GPS coords (Kolar area, Karnataka)
const STOP_COORDS: Record<string, [number, number]> = {
  'Main Gate':        [13.0012, 77.5773],
  'City Center':      [13.0050, 77.5800],
  'Market Square':    [13.0090, 77.5840],
  'Kolar':            [13.1360, 78.1294],
  'Highway 5':        [13.0800, 77.9200],
  'Bus Stand':        [13.0500, 77.7500],
  'Downtown':         [12.9716, 77.5946],
  'Shopping Mall':    [12.9800, 77.6000],
  'Hospital':         [12.9850, 77.6050],
  'Airport':          [13.1979, 77.7063],
  'Highway Junction': [13.1200, 77.6500],
  'Train Station':    [13.0800, 77.6200],
  'Station':          [12.9800, 77.5700],
  'City Hall':        [12.9850, 77.5750],
  'Near College Gate':[12.9900, 77.5780],
  'Market':           [12.9750, 77.5650],
  'Bridge':           [12.9820, 77.5700],
  'Park Road':        [12.9870, 77.5740],
  'College':          [12.9920, 77.5800],
  'Campus':           [12.9920, 77.5800],
  'University':       [12.9920, 77.5800],
};

function getStopCoords(name: string): [number, number] {
  return STOP_COORDS[name] ?? [12.9716, 77.5946];
}

interface BusTrackingProps {
  busId: string;
  onBack: () => void;
}

export function BusTracking({ busId, onBack }: BusTrackingProps) {
  const route = busRoutesData[busId];

  if (!route) {
    return (
      <div className="p-8 text-center text-gray-500">Bus not found</div>
    );
  }

  const stops: RouteStop[] = route.stops.map(s => ({
    name: s.name,
    coords: getStopCoords(s.name),
  }));

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Back to Buses</span>
          <span className="xs:hidden">Back</span>
        </button>
        <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[180px] sm:max-w-none">
          {route.busNumber} · {route.routeName}
        </div>
      </div>

      {/* Live Uber-style map */}
      <LiveTrackingMap
        busId={busId}
        stops={stops}
        driverName={route.driver}
        busNumber={route.busNumber}
      />

      {/* Static info below map — stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <TrackingPanel route={route} />
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2 glass-card p-4 sm:p-6 rounded-2xl">
          <StopsTimeline route={route} />
        </div>
      </div>
    </div>
  );
}
