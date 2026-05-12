'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Play, Square, Pause, RotateCcw, AlertTriangle, Bell,
  MapPin, Navigation, Phone, ChevronDown, ChevronUp,
  Wifi, WifiOff, Crosshair, BarChart2, List, Map,
} from 'lucide-react';
import { TripInfoCard } from './TripInfoCard';
import { RouteTimeline, Stop } from './RouteTimeline';
import { AnalyticsCards } from './AnalyticsCards';
import { NotificationToast, Notification } from './NotificationToast';
import { api } from '@/lib/api';
import { useAuth } from '@/app/AuthContext';
import type { MapStop } from './DriverMap';

// Leaflet must be client-only
const DriverMap = dynamic(
  () => import('./DriverMap').then(m => m.DriverMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-800 animate-pulse" /> }
);

// ─── Constants ───────────────────────────────────────────────────────────────
const BUS_ID = '03';
const DRIVER_ID = 'driver-01';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const ORS_KEY = process.env.NEXT_PUBLIC_ORS_KEY || '';

const ROUTE_STOPS: MapStop[] = [
  { name: 'Downtown',     coords: [12.9716, 77.5946] },
  { name: 'Shopping Mall',coords: [12.9800, 77.6000] },
  { name: 'Hospital',     coords: [12.9850, 77.6050] },
  { name: 'College',      coords: [12.9920, 77.5800] },
];

const STOP_TIMES = ['08:15', '08:28', '08:40', '08:55'];

type TripStatus = 'offline' | 'on-trip' | 'paused' | 'delayed';
type BottomTab = 'map' | 'route' | 'stats';

// ─── Haversine distance ───────────────────────────────────────────────────────
function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function calcETA(distKm: number, speedKmh: number): string {
  if (speedKmh < 2) return '—';
  const mins = Math.round((distKm / speedKmh) * 60);
  if (mins < 1) return '< 1 min';
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

// ─── ORS road route ───────────────────────────────────────────────────────────
async function fetchRoute(waypoints: [number, number][]): Promise<[number, number][]> {
  if (!ORS_KEY || waypoints.length < 2) return waypoints;
  try {
    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: ORS_KEY },
      body: JSON.stringify({ coordinates: waypoints.map(([lat, lng]) => [lng, lat]) }),
    });
    const data = await res.json();
    const coords = data?.features?.[0]?.geometry?.coordinates ?? [];
    return coords.map(([lng, lat]: [number, number]) => [lat, lng]);
  } catch {
    return waypoints;
  }
}

// ─── SOS Modal ────────────────────────────────────────────────────────────────
function SOSModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-white font-bold text-lg text-center mb-2">Emergency SOS</h3>
        <p className="text-gray-400 text-sm text-center mb-6">
          This will immediately alert college admin and emergency contacts with your current location.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/10 text-gray-300 font-semibold text-sm hover:bg-white/15 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { alert('SOS sent! Help is on the way.'); onClose(); }}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
          >
            SEND SOS
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delay Modal ─────────────────────────────────────────────────────────────
function DelayModal({ onConfirm, onClose }: { onConfirm: (reason: string) => void; onClose: () => void }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-amber-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h3 className="text-white font-bold text-lg text-center mb-4">Report Delay</h3>
        <input
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Reason (traffic, breakdown…)"
          className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-amber-500/50 mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/10 text-gray-300 font-semibold text-sm">Cancel</button>
          <button onClick={() => onConfirm(reason)} className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors">
            Send Alert
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function DriverDashboard() {
  const { user, logout } = useAuth();

  // Trip state
  const [tripStatus, setTripStatus] = useState<TripStatus>('offline');
  const [currentStopIdx, setCurrentStopIdx] = useState(0);
  const [tripProgress, setTripProgress] = useState(0);

  // GPS state
  const [busPos, setBusPos] = useState<[number, number]>(ROUTE_STOPS[0].coords);
  const [speed, setSpeed] = useState(0);
  const [follow, setFollow] = useState(true);
  const [gpsActive, setGpsActive] = useState(false);

  // Route
  const [routeLine, setRouteLine] = useState<[number, number][]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<BottomTab>('map');
  const [showSOS, setShowSOS] = useState(false);
  const [showDelay, setShowDelay] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'students', message: '12 students waiting at Downtown stop' },
    { id: '2', type: 'info',     message: 'Route updated by admin — check stops' },
  ]);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const watchIdRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const coordsRef = useRef(busPos);

  useEffect(() => { coordsRef.current = busPos; }, [busPos]);

  // Fetch ORS road route on mount
  useEffect(() => {
    fetchRoute(ROUTE_STOPS.map(s => s.coords)).then(setRouteLine);
  }, []);

  // ── GPS broadcast ──────────────────────────────────────────────────────────
  const startGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    setGpsActive(true);

    const socket = io(API_BASE, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => socket.emit('driver:join', BUS_ID));

    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => {
        const { latitude: lat, longitude: lng, speed: spd } = pos.coords;
        setBusPos([lat, lng]);
        setSpeed(spd ? Math.round(spd * 3.6) : 0);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    const send = () => {
      const [lat, lng] = coordsRef.current;
      fetch(`${API_BASE}/api/gps/update-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId: BUS_ID, driverId: DRIVER_ID, latitude: lat, longitude: lng, speed }),
      }).catch(() => {});
    };
    send();
    intervalRef.current = setInterval(send, 4000);
  }, [speed]);

  const stopGPS = useCallback(() => {
    setGpsActive(false);
    if (watchIdRef.current !== undefined) navigator.geolocation.clearWatch(watchIdRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    socketRef.current?.disconnect();
    fetch(`${API_BASE}/api/gps/clear/${BUS_ID}`, { method: 'POST' }).catch(() => {});
  }, []);

  useEffect(() => () => stopGPS(), [stopGPS]);

  // ── Trip progress simulation ───────────────────────────────────────────────
  useEffect(() => {
    if (tripStatus !== 'on-trip') return;
    const interval = setInterval(() => {
      setTripProgress(prev => {
        const next = Math.min(prev + 0.5, 100);
        setCurrentStopIdx(Math.min(Math.floor((next / 100) * (ROUTE_STOPS.length - 1)), ROUTE_STOPS.length - 1));
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [tripStatus]);

  // ── Trip actions ───────────────────────────────────────────────────────────
  const handleStartTrip = async () => {
    try {
      await api.buses.setTrip(BUS_ID, true);
      setTripStatus('on-trip');
      setTripProgress(0);
      setCurrentStopIdx(0);
      startGPS();
      addNotification({ type: 'success', message: 'Trip started — GPS broadcasting live' });
    } catch { addNotification({ type: 'warning', message: 'Failed to start trip. Retrying…' }); }
  };

  const handlePauseTrip = () => {
    setTripStatus(s => s === 'paused' ? 'on-trip' : 'paused');
  };

  const handleEndTrip = async () => {
    try {
      await api.buses.setTrip(BUS_ID, false);
      setTripStatus('offline');
      setTripProgress(0);
      setCurrentStopIdx(0);
      stopGPS();
      addNotification({ type: 'info', message: 'Trip ended. Great job today!' });
    } catch { addNotification({ type: 'warning', message: 'Failed to end trip.' }); }
  };

  const handleDelay = async (reason: string) => {
    try {
      await api.buses.setStatus(BUS_ID, 'Delayed', reason);
      await api.buses.sendAlert(BUS_ID, reason);
      setTripStatus('delayed');
      setShowDelay(false);
      addNotification({ type: 'warning', message: `Delay alert sent: ${reason || 'No reason given'}` });
    } catch { setShowDelay(false); }
  };

  const addNotification = (n: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [{ ...n, id }, ...prev].slice(0, 4));
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== id)), 6000);
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const dest = ROUTE_STOPS[ROUTE_STOPS.length - 1].coords;
  const distRemaining = haversine(busPos, dest);
  const eta = calcETA(distRemaining, speed);

  const timelineStops: Stop[] = ROUTE_STOPS.map((s, i) => ({
    name: s.name,
    time: STOP_TIMES[i],
    status: i < currentStopIdx ? 'completed' : i === currentStopIdx ? 'current' : 'upcoming',
  }));

  const isOnTrip = tripStatus === 'on-trip' || tripStatus === 'delayed';

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col overflow-hidden">
      {/* ── Top Navbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/95 backdrop-blur border-b border-white/10 z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'D'}
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{user?.name ?? 'Driver'}</p>
            <p className="text-gray-500 text-xs">BUS-03 · Downtown Route</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* GPS status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            gpsActive
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-gray-800 text-gray-500 border-gray-700'
          }`}>
            {gpsActive ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {gpsActive ? 'Live' : 'Offline'}
          </div>

          {/* Notifications */}
          <button
            className="relative w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            onClick={() => addNotification({ type: 'students', message: '8 students waiting at next stop' })}
          >
            <Bell className="w-4 h-4 text-gray-400" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* ── Map (full remaining height) ────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        {activeTab === 'map' && (
          <DriverMap
            busPos={busPos}
            speed={speed}
            stops={ROUTE_STOPS}
            routeLine={routeLine}
            follow={follow}
          />
        )}

        {activeTab === 'route' && (
          <div className="h-full overflow-y-auto bg-gray-950 p-4">
            <RouteTimeline stops={timelineStops} />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="h-full overflow-y-auto bg-gray-950 p-4">
            <AnalyticsCards />
          </div>
        )}

        {/* ── Map overlays (only on map tab) ─────────────────────────────── */}
        {activeTab === 'map' && (
          <>
            {/* Notifications */}
            <div className="absolute top-3 left-3 right-3 z-[1000] space-y-2">
              <NotificationToast
                notifications={notifications}
                onDismiss={id => setNotifications(prev => prev.filter(n => n.id !== id))}
              />
            </div>

            {/* Recenter + follow toggle */}
            <div className="absolute right-3 z-[1000] flex flex-col gap-2" style={{ bottom: showPanel ? 'auto' : '1rem', top: showPanel ? '4rem' : 'auto' }}>
              <button
                onClick={() => setFollow(true)}
                className="w-10 h-10 bg-gray-900/95 border border-white/10 rounded-xl flex items-center justify-center shadow-xl hover:bg-gray-800 transition-colors"
              >
                <Crosshair className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            {/* Floating trip info panel — full width on mobile */}
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-3 sm:right-14 z-[1000]">
              <button
                onClick={() => setShowPanel(p => !p)}
                className="w-full flex items-center justify-between bg-gray-900/95 border border-white/10 rounded-t-2xl px-4 py-2 text-gray-400 text-xs"
              >
                <span className="font-medium">Trip Info</span>
                {showPanel ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              {showPanel && (
                <TripInfoCard
                  route="Downtown → College"
                  currentStop={ROUTE_STOPS[currentStopIdx]?.name ?? '—'}
                  nextStop={ROUTE_STOPS[Math.min(currentStopIdx + 1, ROUTE_STOPS.length - 1)]?.name ?? '—'}
                  eta={eta}
                  distanceKm={distRemaining}
                  passengers={45}
                  capacity={52}
                  speed={speed}
                  status={tripStatus}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Trip progress bar ───────────────────────────────────────────────── */}
      {isOnTrip && (
        <div className="h-1 bg-gray-800 flex-shrink-0">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700"
            style={{ width: `${tripProgress}%` }}
          />
        </div>
      )}

      {/* ── Action buttons — safe-area bottom padding for notched phones ── */}
      <div className="bg-gray-900/95 backdrop-blur border-t border-white/10 px-3 sm:px-4 py-3 flex-shrink-0 z-50" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        {tripStatus === 'offline' ? (
          /* Start trip */
          <button
            onClick={handleStartTrip}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <Play className="w-5 h-5" />
            Start Trip
          </button>
        ) : (
          <div className="space-y-2">
            {/* Primary row */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handlePauseTrip}
                className={`py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  tripStatus === 'paused'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                {tripStatus === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {tripStatus === 'paused' ? 'Resume' : 'Pause'}
              </button>

              <button
                onClick={() => setShowDelay(true)}
                className="py-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-amber-500/30 transition-all active:scale-95"
              >
                <AlertTriangle className="w-4 h-4" />
                Delay
              </button>

              <button
                onClick={handleEndTrip}
                className="py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-red-500/30 transition-all active:scale-95"
              >
                <Square className="w-4 h-4" />
                End
              </button>
            </div>

            {/* SOS */}
            <button
              onClick={() => setShowSOS(true)}
              className="w-full py-2.5 rounded-xl bg-red-600/10 border border-red-600/30 text-red-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-600/20 transition-all"
            >
              <Phone className="w-4 h-4" />
              Emergency SOS
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom tab bar — safe-area padding ── */}
      <div className="bg-gray-900 border-t border-white/10 flex flex-shrink-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {([
          { id: 'map',   icon: <Map className="w-5 h-5" />,      label: 'Map'   },
          { id: 'route', icon: <List className="w-5 h-5" />,     label: 'Route' },
          { id: 'stats', icon: <BarChart2 className="w-5 h-5" />,label: 'Stats' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              activeTab === tab.id ? 'text-indigo-400' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {showSOS   && <SOSModal onClose={() => setShowSOS(false)} />}
      {showDelay && <DelayModal onConfirm={handleDelay} onClose={() => setShowDelay(false)} />}
    </div>
  );
}
