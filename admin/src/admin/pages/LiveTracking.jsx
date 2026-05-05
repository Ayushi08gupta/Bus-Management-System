import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Map, Navigation, Search, Filter, Info, Bus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveTracking = () => {
  const [selectedBus, setSelectedBus] = useState(null);

  const buses = [
    { id: 'BUS-42', route: 'City Center', status: 'on-time', speed: '45 km/h', nextStop: 'University Gate 1', x: 30, y: 40 },
    { id: 'BUS-08', route: 'North Campus', status: 'on-time', speed: '35 km/h', nextStop: 'Library', x: 60, y: 20 },
    { id: 'BUS-15', route: 'City Center', status: 'delayed', speed: '10 km/h', nextStop: 'Central Station', x: 75, y: 65 },
    { id: 'BUS-99', route: 'Suburban', status: 'offline', speed: '0 km/h', nextStop: 'N/A', x: 20, y: 80 },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Tracking</h1>
          <p className="text-gray-400 text-sm">Monitor fleet location in real-time</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search bus or route..." 
              className="bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 w-64"
            />
          </div>
          <button className="p-2 rounded-lg bg-black/20 border border-white/10 text-gray-300 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <GlassCard className="flex-1 p-0 overflow-hidden relative border-white/10 flex">
        {/* Map Area */}
        <div className="flex-1 relative bg-[#0f172a]">
          {/* Fake Map Background */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40"></div>
          
          {/* Map Overlay for darker aesthetic */}
          <div className="absolute inset-0 bg-background-start/60"></div>

          {/* Interactive Bus Markers */}
          {buses.map((bus) => (
            <motion.div
              key={bus.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ left: `${bus.x}%`, top: `${bus.y}%` }}
              className="absolute z-20 cursor-pointer group"
              onClick={() => setSelectedBus(bus)}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div className={`absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity ${
                  bus.status === 'on-time' ? 'bg-success' :
                  bus.status === 'delayed' ? 'bg-warning' : 'bg-gray-500'
                }`}></div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 ${
                  bus.status === 'on-time' ? 'bg-success/20 border-success text-success' :
                  bus.status === 'delayed' ? 'bg-warning/20 border-warning text-warning' : 
                  'bg-gray-500/20 border-gray-500 text-gray-400'
                } backdrop-blur-md`}>
                  <Navigation size={14} className="rotate-45" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Info Panel */}
        <AnimatePresence>
          {selectedBus && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="absolute right-4 top-4 bottom-4 w-80"
            >
              <GlassCard className="h-full flex flex-col border-white/20 shadow-2xl bg-background-start/90 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg">
                    <Bus size={24} className="text-white" />
                  </div>
                  <button onClick={() => setSelectedBus(null)} className="text-gray-500 hover:text-white">
                    ✕
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-1">{selectedBus.id}</h2>
                <p className="text-primary font-medium text-sm mb-6">{selectedBus.route}</p>

                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${
                      selectedBus.status === 'on-time' ? 'bg-success/20 text-success' :
                      selectedBus.status === 'delayed' ? 'bg-warning/20 text-warning' : 
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {selectedBus.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-gray-400 text-sm">Speed</span>
                    <span className="text-white font-medium">{selectedBus.speed}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-gray-400 text-sm">Next Stop</span>
                    <span className="text-white font-medium text-right max-w-[150px] truncate">{selectedBus.nextStop}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10">
                  <button className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
                    <Info size={16} /> View Full Details
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
};

export default LiveTracking;
