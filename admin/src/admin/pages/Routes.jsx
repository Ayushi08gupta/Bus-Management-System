import React from 'react';
import GlassCard from '../components/GlassCard';
import { Plus, Search, Filter, Edit2, Trash2, MoreVertical, Route } from 'lucide-react';

const RoutesPage = () => {
  const routes = [
    { id: 'RT-01', name: 'City Center Express', stops: 8, duration: '45 mins', buses: 3, status: 'Active' },
    { id: 'RT-02', name: 'North Campus Loop', stops: 12, duration: '60 mins', buses: 2, status: 'Active' },
    { id: 'RT-03', name: 'South Residential', stops: 5, duration: '25 mins', buses: 1, status: 'Suspended' },
    { id: 'RT-04', name: 'Tech Park Shuttle', stops: 4, duration: '20 mins', buses: 2, status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Route Builder</h1>
          <p className="text-gray-400 text-sm">Design and manage bus routes</p>
        </div>
        <button className="btn-primary flex items-center gap-2 py-2.5 px-4">
          <Plus size={18} /> Create New Route
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden border-white/10">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search routes..." 
                className="bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-gray-300 hover:text-white transition-colors text-sm">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/30 border-b border-white/5">
                <th className="p-4 text-sm font-semibold text-gray-300">Route ID</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Route Name</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Stops</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Est. Duration</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Assigned Buses</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {routes.map((route, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-start/20 flex items-center justify-center text-accent-start">
                        <Route size={16} />
                      </div>
                      <span className="font-medium text-white">{route.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-white">{route.name}</td>
                  <td className="p-4 text-sm text-gray-300">{route.stops} stops</td>
                  <td className="p-4 text-sm text-gray-300">{route.duration}</td>
                  <td className="p-4 text-sm text-gray-300">{route.buses} buses</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      route.status === 'Active' ? 'bg-success/10 border-success/30 text-success' :
                      'bg-warning/10 border-warning/30 text-warning'
                    }`}>
                      {route.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default RoutesPage;
