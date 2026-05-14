'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSocket, BusLocation } from '@/hooks/useSocket';

// ─── Bus icon (animated pulse ring) ────────────────────────────────────────
const busIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:40px;height:40px">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:rgba(99,102,241,0.25);
        animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
      <div style="
        position:absolute;inset:4px;border-radius:50%;
        background:#4f46e5;border:3px solid #fff;
        box-shadow:0 2px 8px rgba(79,70,229,0.6);
        display:flex;align-items:center;justify-content:center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 10V6h12v4H6z"/>
        </svg>
      </div>
    </div>
    <style>
      @keyframes ping {
        75%,100%{transform:scale(2);opacity:0}
      }
    </style>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const stopIcon = (isActive: boolean) => L.divIcon({
  className: '',
  html: `<div style="
    width:14px;height:14px;border-radius:50%;
    background:${isActive ? '#10b981' : '#94a3b8'};
    border:3px solid white;
    box-shadow:0 1px 4px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// ─── Auto-follow: smoothly pan map to bus position ──────────────────────────
function AutoFollow({ position, follow }: { position: [number, number]; follow: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (follow) map.panTo(position, { animate: true, duration: 0.8 });
  }, [position, follow, map]);
  return null;
}

// ─── Smooth marker movement via CSS transition ───────────────────────────────
function AnimatedBusMarker({ position, speed }: { position: [number, number]; speed: number }) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    // Leaflet doesn't animate setLatLng natively — we use a short tween
    const el = marker.getElement();
    if (el) el.style.transition = 'transform 0.8s linear';
    marker.setLatLng(position);
  }, [position]);

  return (
    <Marker ref={markerRef} position={position} icon={busIcon}>
      <Popup>
        <div className="text-sm font-medium">🚌 Bus is here<br />
          <span className="text-gray-500">{speed} km/h</span>
        </div>
      </Popup>
    </Marker>
  );
}

// ─── ORS route fetcher ───────────────────────────────────────────────────────
const ORS_KEY = process.env.NEXT_PUBLIC_ORS_KEY || '';

async function fetchORSRoute(
  waypoints: [number, number][]
): Promise<[number, number][]> {
  if (!ORS_KEY || waypoints.length < 2) return waypoints;
  try {
    const coords = waypoints.map(([lat, lng]) => [lng, lat]); // ORS uses [lng,lat]
    const res = await fetch(
      'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ORS_KEY,
        },
        body: JSON.stringify({ coordinates: coords }),
      }
    );
    const data = await res.json();
    const geometry = data?.features?.[0]?.geometry?.coordinates ?? [];
    return geometry.map(([lng, lat]: [number, number]) => [lat, lng]);
  } catch {
    return waypoints; // fallback to straight lines
  }
}

// ─── ETA calculator ──────────────────────────────────────────────────────────
function calcETA(distKm: number, speedKmh: number): string {
  if (speedKmh < 1) return '—';
  const mins = Math.round((distKm / speedKmh) * 60);
  if (mins < 1) return '< 1 min';
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) *
      Math.cos((b[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// ─── Stop definitions ────────────────────────────────────────────────────────
export interface RouteStop {
  name: string;
  coords: [number, number];
}

interface LiveTrackingMapProps {
  busId: string;
  stops: RouteStop[];
  driverName?: string;
  busNumber?: string;
}

// ─── Main component ──────────────────────────────────────────────────────────
export function LiveTrackingMap({ busId, stops, driverName, busNumber }: LiveTrackingMapProps) {
  const { location, isOnline } = useSocket(busId);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [autoFollow, setAutoFollow] = useState(true);
  const [initialFetch, setInitialFetch] = useState(false);

  const busPos: [number, number] | null = location
    ? [location.latitude, location.longitude]
    : null;

  const destination = stops[stops.length - 1]?.coords ?? null;

  const eta = busPos && destination && location
    ? calcETA(haversine(busPos, destination), location.speed)
    : '—';

  // Fetch ORS road route once on mount
  useEffect(() => {
    if (stops.length < 2 || initialFetch) return;
    setInitialFetch(true);
    fetchORSRoute(stops.map(s => s.coords)).then(setRoutePolyline);
  }, [stops, initialFetch]);

  // Fallback: fetch initial location via REST if socket hasn't fired yet
  useEffect(() => {
    if (location) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/gps/bus/${busId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setInitialFetch(true); })
      .catch(() => {});
  }, [busId, location]);

  const center: [number, number] = busPos ?? stops[0]?.coords ?? [12.9716, 77.5946];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-white/20">
      {/* Status bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow text-xs font-medium">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {isOnline ? 'Live' : 'Waiting for bus…'}
        </div>
        <button
          onClick={() => setAutoFollow(f => !f)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shadow backdrop-blur transition-colors ${
            autoFollow ? 'bg-indigo-600 text-white' : 'bg-white/90 text-gray-700'
          }`}
        >
          {autoFollow ? '📍 Following' : '🗺 Free'}
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: 'clamp(280px, 45vw, 480px)', width: '100%' }}
        zoomControl={false}
      >
        {/* CartoDB light tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Road route polyline */}
        {routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{ color: '#4f46e5', weight: 5, opacity: 0.7, lineCap: 'round', lineJoin: 'round' }}
          />
        )}

        {/* Fallback straight-line if no ORS key */}
        {routePolyline.length < 2 && stops.length > 1 && (
          <Polyline
            positions={stops.map(s => s.coords)}
            pathOptions={{ color: '#4f46e5', weight: 4, opacity: 0.5, dashArray: '8 6' }}
          />
        )}

        {/* Stop markers */}
        {stops.map((stop, i) => (
          <Marker key={stop.name} position={stop.coords} icon={stopIcon(i === 0 || i === stops.length - 1)}>
            <Popup>
              <span className="text-xs font-semibold">{stop.name}</span>
            </Popup>
          </Marker>
        ))}

        {/* Animated bus marker */}
        {busPos && <AnimatedBusMarker position={busPos} speed={location?.speed ?? 0} />}

        {/* Auto-follow */}
        {busPos && <AutoFollow position={busPos} follow={autoFollow} />}
      </MapContainer>

      {/* Bottom info panel — scrollable on mobile */}
      <div className="bg-white/95 backdrop-blur px-3 sm:px-4 py-3 flex items-center gap-3 sm:gap-4 overflow-x-auto">
        <div className="flex-shrink-0">
          <p className="text-xs text-gray-500">Bus</p>
          <p className="font-bold text-gray-800 text-sm">{busNumber ?? busId}</p>
        </div>
        <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
        <div className="flex-shrink-0">
          <p className="text-xs text-gray-500">Driver</p>
          <p className="font-semibold text-gray-800 text-sm">{driverName ?? '—'}</p>
        </div>
        <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
        <div className="flex-shrink-0">
          <p className="text-xs text-gray-500">Speed</p>
          <p className="font-semibold text-gray-800 text-sm">{location?.speed ?? 0} km/h</p>
        </div>
        <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
        <div className="flex-shrink-0">
          <p className="text-xs text-gray-500">ETA to {stops[stops.length - 1]?.name}</p>
          <p className="font-bold text-indigo-600 text-sm">{eta}</p>
        </div>
        <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
        <div className="flex-shrink-0">
          <p className="text-xs text-gray-500">Route</p>
          <p className="font-semibold text-gray-800 text-xs whitespace-nowrap">
            {stops[0]?.name} → {stops[stops.length - 1]?.name}
          </p>
        </div>
      </div>
    </div>
  );
}
