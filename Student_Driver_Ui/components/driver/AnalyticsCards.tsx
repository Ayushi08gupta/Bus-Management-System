'use client';

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { TrendingUp, Route, Clock, Users } from 'lucide-react';

const speedData = [
  { t: '8am', v: 0 }, { t: '8:10', v: 32 }, { t: '8:20', v: 45 },
  { t: '8:30', v: 38 }, { t: '8:40', v: 52 }, { t: '8:50', v: 41 },
  { t: '9am', v: 48 },
];

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}

function StatCard({ icon, label, value, sub, color }: StatCardProps) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-white font-bold text-xl">{value}</p>
      <p className="text-gray-400 text-xs mt-0.5">{label}</p>
      <p className="text-gray-600 text-xs mt-1">{sub}</p>
    </div>
  );
}

export function AnalyticsCards() {
  return (
    <div className="space-y-4">
      {/* Speed chart */}
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Speed Today</p>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={speedData}>
            <defs>
              <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: '#9ca3af' }}
              itemStyle={{ color: '#a5b4fc' }}
            />
            <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} fill="url(#speedGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stat cards — 1 col on xs, 2 on sm+ */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        <StatCard
          icon={<Route className="w-4 h-4 text-indigo-400" />}
          label="Trips Today"
          value="3"
          sub="+1 from yesterday"
          color="bg-indigo-500/20"
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          label="Distance"
          value="42 km"
          sub="Covered today"
          color="bg-emerald-500/20"
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-amber-400" />}
          label="Avg. Arrival"
          value="2 min"
          sub="Early on average"
          color="bg-amber-500/20"
        />
        <StatCard
          icon={<Users className="w-4 h-4 text-sky-400" />}
          label="Students"
          value="127"
          sub="Transported today"
          color="bg-sky-500/20"
        />
      </div>
    </div>
  );
}
