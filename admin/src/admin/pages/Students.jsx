import React from 'react';
import GlassCard from '../components/GlassCard';
import { Search, Filter, Edit2, MoreVertical, GraduationCap, Mail } from 'lucide-react';

const Students = () => {
  const students = [
    { id: 'STU-202301', name: 'Emily Chen', email: 'emily.c@campus.edu', route: 'City Center Express', status: 'Active' },
    { id: 'STU-202302', name: 'Marcus Johnson', email: 'mjohnson@campus.edu', route: 'North Campus Loop', status: 'Active' },
    { id: 'STU-202303', name: 'Sophia Martinez', email: 'smartinez@campus.edu', route: 'Not Assigned', status: 'Pending' },
    { id: 'STU-202304', name: 'James Wilson', email: 'jwilson@campus.edu', route: 'Tech Park Shuttle', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Management</h1>
          <p className="text-gray-400 text-sm">View and manage student access</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden border-white/10">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search students..." 
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
                <th className="p-4 text-sm font-semibold text-gray-300">Student Info</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Contact</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Default Route</th>
                <th className="p-4 text-sm font-semibold text-gray-300">System Access</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Mail size={14} className="text-gray-500" /> {student.email}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{student.route}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      student.status === 'Active' ? 'bg-success/10 border-success/30 text-success' :
                      'bg-warning/10 border-warning/30 text-warning'
                    }`}>
                      {student.status}
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

export default Students;
