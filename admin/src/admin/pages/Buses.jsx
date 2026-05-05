import React from 'react';
import GlassCard from '../components/GlassCard';
import { Plus, Search, Filter, Edit2, Trash2, MoreVertical, Bus } from 'lucide-react';

const Buses = () => {
  const buses = [
    { id: 'BUS-42', capacity: 50, driver: 'Mike T.', route: 'City Center', status: 'Active', condition: 'Excellent' },
    { id: 'BUS-08', capacity: 45, driver: 'Sarah J.', route: 'North Campus', status: 'Active', condition: 'Good' },
    { id: 'BUS-15', capacity: 60, driver: 'Tom H.', route: 'City Center', status: 'In Route', condition: 'Needs Service' },
    { id: 'BUS-99', capacity: 40, driver: 'Unassigned', route: 'None', status: 'Maintenance', condition: 'Poor' },
    { id: 'BUS-22', capacity: 50, driver: 'Alex M.', route: 'South Campus', status: 'Active', condition: 'Excellent' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Fleet Management</h1>
          <p className="text-gray-400 text-sm">Manage all university buses</p>
        </div>
        <button className="btn-primary flex items-center gap-2 py-2.5 px-4">
          <Plus size={18} /> Add New Bus
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
                placeholder="Search buses..." 
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
                <th className="p-4 text-sm font-semibold text-gray-300">Bus ID</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Capacity</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Driver</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Current Route</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {buses.map((bus, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <Bus size={16} />
                      </div>
                      <span className="font-medium text-white">{bus.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{bus.capacity} seats</td>
                  <td className="p-4 text-sm text-gray-300">{bus.driver}</td>
                  <td className="p-4 text-sm text-gray-300">{bus.route}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      bus.status === 'Active' || bus.status === 'In Route' ? 'bg-success/10 border-success/30 text-success' :
                      'bg-warning/10 border-warning/30 text-warning'
                    }`}>
                      {bus.status}
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
        
        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex justify-between items-center bg-black/20">
          <span className="text-sm text-gray-400">Showing 1 to 5 of 24 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 rounded-md bg-primary/20 border border-primary/30 text-primary font-medium">1</button>
            <button className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-white">2</button>
            <button className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-white">3</button>
            <button className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-white">Next</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Buses;
