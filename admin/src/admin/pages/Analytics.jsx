import React from 'react';
import GlassCard from '../components/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, Filter } from 'lucide-react';

const passengerData = [
  { day: 'Mon', count: 4000 },
  { day: 'Tue', count: 4500 },
  { day: 'Wed', count: 4200 },
  { day: 'Thu', count: 4800 },
  { day: 'Fri', count: 3900 },
  { day: 'Sat', count: 1200 },
  { day: 'Sun', count: 800 },
];

const routeData = [
  { name: 'City Center', value: 45 },
  { name: 'North Campus', value: 30 },
  { name: 'Tech Park', value: 15 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#06B6D4', '#8B5CF6', '#10B981', '#64748B'];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">System Analytics</h1>
          <p className="text-gray-400 text-sm">Deep dive into performance metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-gray-300 hover:text-white transition-colors text-sm">
            <Calendar size={16} /> This Week
          </button>
          <button className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <GlassCard className="h-[400px] flex flex-col border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white">Weekly Passenger Volume</h3>
            <button className="text-gray-400 hover:text-white"><Filter size={16} /></button>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passengerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Pie Chart */}
        <GlassCard className="h-[400px] flex flex-col border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white">Route Distribution</h3>
            <button className="text-gray-400 hover:text-white"><Filter size={16} /></button>
          </div>
          <div className="flex-1 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={routeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {routeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="absolute bottom-0 w-full flex justify-center gap-6 pb-2">
              {routeData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-xs text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
