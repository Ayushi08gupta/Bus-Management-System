import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface BusLocation {
  busId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  updated_at: string;
}

export function useSocket(busId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [location, setLocation] = useState<BusLocation | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const socket = io(API_BASE, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('student:watch', busId);
      setIsOnline(true);
    });

    socket.on('location:update', (data: BusLocation) => {
      if (data.busId === busId) setLocation(data);
    });

    socket.on('bus:offline', ({ busId: id }: { busId: string }) => {
      if (id === busId) setIsOnline(false);
    });

    socket.on('disconnect', () => setIsOnline(false));

    return () => { socket.disconnect(); };
  }, [busId]);

  // Emit location from driver side
  const emitLocation = (data: BusLocation) => {
    socketRef.current?.emit('driver:join', data.busId);
    // Location is sent via REST POST, socket just joins the room
  };

  return { location, isOnline, emitLocation };
}
