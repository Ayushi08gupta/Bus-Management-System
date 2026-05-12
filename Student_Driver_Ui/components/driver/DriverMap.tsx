'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Animated bus marker ────────────────────────────────────────────────────
const BUS_ICON = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:44px;height:44px">
      <div style="position:absolute;inset:0;border-radius:50%;background:rgba(16,185,129,0.2);animation:driverPing 1.8s ease-in-out infinite"></div>
      <div style="position:absolute;inset:6px;border-radius:50%;background:#10b981;border:3px solid #fff;box-shadow:0 4px 12px rgba(16,185,129,0.5);display:flex;align-items:center;justify-content:center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 10V6h12v4H6z"/>
        </svg>
      </div>
    </div>
    <style>@keyframes driverPing{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.8);opacity:0}}</style>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const STOP_ICON = (active: boolean) => L.divIcon({
  className: '',
  html: `<div style="width:12px;height:12px;border-radius:50%;background:${active ? '#10b981' : '#6366f1'};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const DEST_ICON = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 3px 8px rgba(239,68,68,0.5)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ─── Auto-follow hook ────────────────────────────────────────────────────────
function AutoFollow({ pos }: { pos: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.panTo(pos, { animate: true, duration: 0.9 });
  }, [pos, map]);
  return null;
}

// ─── Smooth animated marker ──────────────────────────────────────────────────
function BusMarker({ pos, speed }: { pos: [number, number]; speed: number }) {
  const ref = useRef<L.Marker>(null);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const el = m.getElement();
    if (el) el.style.transition = 'transform 0.9s linear';
    m.setLatLng(pos);
  }, [pos]);
  return (
    <Marker ref={ref} position={pos} icon={BUS_ICON}>
      <Popup><span className="text-sm font-semibold">🚌 You are here · {speed} km/h</span></Popup>
    </Marker>
  );
}

export interface MapStop { name: string; coords: [number, number] }

interface DriverMapProps {
  busPos: [number, number];
  speed: number;
  stops: MapStop[];
  routeLine: [number, number][];
  follow: boolean;
}

function MapInner({ busPos, speed, stops, routeLine, follow }: DriverMapProps) {
  return (
    <>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />
      {routeLine.length > 1 && (
        <Polyline
          positions={routeLine}
          pathOptions={{ color: '#6366f1', weight: 5, opacity: 0.75, lineCap: 'round', lineJoin: 'round' }}
        />
      )}
      {stops.map((s, i) => (
        <Marker key={s.name} position={s.coords} icon={i === stops.length - 1 ? DEST_ICON : STOP_ICON(i === 0)}>
          <Popup><span className="text-xs font-medium">{s.name}</span></Popup>
        </Marker>
      ))}
      <BusMarker pos={busPos} speed={speed} />
      {follow && <AutoFollow pos={busPos} />}
    </>
  );
}

// Exported as a named component — parent uses dynamic() to avoid SSR
export function DriverMap({ busPos, speed, stops, routeLine, follow }: DriverMapProps) {
  return (
    <MapContainer
      center={busPos}
      zoom={15}
      style={{ height: '100%', width: '100%', minHeight: '280px' }}
      zoomControl={false}
    >
      <MapInner busPos={busPos} speed={speed} stops={stops} routeLine={routeLine} follow={follow} />
    </MapContainer>
  );
}
