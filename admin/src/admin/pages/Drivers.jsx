import React from 'react';
import GlassCard from '../components/GlassCard';
import { Plus, Search, Filter, Edit2, Trash2, MoreVertical, Users, Phone } from 'lucide-react';

const Drivers = () => {
  const drivers = [
    { id: 'DRV-101', name: 'Mike Thompson', license: 'CDL-A 8934', phone: '+1 555-0101', assignedBus: 'BUS-42', status: 'On Duty' },
    { id: 'DRV-102', name: 'Sarah Jenkins', license: 'CDL-B 7210', phone: '+1 555-0102', assignedBus: 'BUS-08', status: 'On Duty' },
    { id: 'DRV-103', name: 'Tom Harrison', license: 'CDL-A 4552', phone: '+1 555-0103', assignedBus: 'BUS-15', status: 'Off Duty' },
    { id: 'DRV-104', name: 'Alex Mercer', license: 'CDL-A 9921', phone: '+1 555-0104', assignedBus: 'BUS-22', status: 'On Leave' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Driver Management</h1>
          <p className="text-gray-400 text-sm">Manage personnel and assignments</p>
        </div>
        <button className="btn-primary flex items-center gap-2 py-2.5 px-4">
          <Plus size={18} /> Register Driver
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden border-white/10">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search drivers..." 
                className="bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-gray-300 hover:text-white transition-colors text-sm">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/30 border-b border-white/5">
                <th className="p-4 text-sm font-semibold text-gray-300">Driver Info</th>
                <th className="p-4 text-sm font-semibold text-gray-300">License</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Contact</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Assigned Bus</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {drivers.map((driver, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{driver.name}</p>
                        <p className="text-xs text-gray-400">{driver.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300 font-mono">{driver.license}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Phone size={14} className="text-gray-500" /> {driver.phone}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-white font-medium">{driver.assignedBus}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      driver.status === 'On Duty' ? 'bg-success/10 border-success/30 text-success' :
                      driver.status === 'Off Duty' ? 'bg-gray-500/20 border-gray-500/30 text-gray-400' :
                      'bg-warning/10 border-warning/30 text-warning'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <Edit2 size={16} />
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

export default Drivers;
