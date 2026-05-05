import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Bus, Users, Route, AlertCircle, TrendingUp, Map, BellRing } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { time: '06:00', passengers: 120 },
  { time: '08:00', passengers: 450 },
  { time: '10:00', passengers: 300 },
  { time: '12:00', passengers: 280 },
  { time: '14:00', passengers: 390 },
  { time: '16:00', passengers: 520 },
  { time: '18:00', passengers: 200 },
];

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.substring(0, 3));
    if (start === end) return;

    let totalMilSecDur = parseInt(1000);
    let incrementTime = (totalMilSecDur / end) * 2;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{value.replace(/[0-9]/g, '')}</span>;
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-gray-400 mt-1">Real-time system status and analytics</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <TrendingUp size={18} /> Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="flex items-center gap-4 hover:bg-white/[0.03] transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bus className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Buses</p>
              <p className="text-2xl font-bold text-white"><AnimatedCounter value="24" /> <span className="text-sm font-normal text-success">+2</span></p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="flex items-center gap-4 hover:bg-white/[0.03] transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Users className="text-secondary" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-white"><AnimatedCounter value="1250" /> <span className="text-sm font-normal text-success">+15%</span></p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="flex items-center gap-4 hover:bg-white/[0.03] transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-accent-start/20 flex items-center justify-center">
              <Route className="text-accent-start" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Routes</p>
              <p className="text-2xl font-bold text-white"><AnimatedCounter value="8" /></p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="flex items-center gap-4 border-warning/30 bg-warning/5 hover:bg-warning/10 transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <AlertCircle className="text-warning" size={24} />
            </div>
            <div>
              <p className="text-warning/80 text-sm">Delayed Buses</p>
              <p className="text-2xl font-bold text-warning"><AnimatedCounter value="2" /></p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-bold text-white mb-6">Passenger Traffic Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPassengers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#9ca3af" axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickMargin={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="passengers" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorPassengers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Live System Alerts */}
        <div className="space-y-6">
          <GlassCard className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BellRing size={18} className="text-warning" /> System Alerts
              </h3>
              <button className="text-secondary text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { title: 'Traffic Delay', desc: 'Heavy traffic on Route 4. Adjusting ETA.', type: 'warning', time: '2m ago' },
                { title: 'Bus #12 Offline', desc: 'Maintenance scheduled.', type: 'error', time: '15m ago' },
                { title: 'Route 8 Clear', desc: 'Previous delay resolved.', type: 'success', time: '1h ago' },
              ].map((alert, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-sm font-semibold ${
                      alert.type === 'warning' ? 'text-warning' :
                      alert.type === 'error' ? 'text-red-400' : 'text-success'
                    }`}>{alert.title}</p>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-xs text-gray-400">{alert.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Mini Live Map Placeholder */}
      <GlassCard className="p-0 overflow-hidden relative h-[300px] border-white/10">
        <div className="absolute inset-0 bg-[#0f172a] opacity-70 z-10 flex flex-col items-center justify-center">
          <Map className="text-primary/50 mb-4 animate-pulse" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Live Tracking Center</h3>
          <p className="text-gray-400 text-sm max-w-md text-center">Monitor all active buses in real-time on the interactive map.</p>
        </div>
        {/* Fake map background */}
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
