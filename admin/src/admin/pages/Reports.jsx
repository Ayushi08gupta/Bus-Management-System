import React from 'react';
import GlassCard from '../components/GlassCard';
import { Download, FileText, Calendar, Filter } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">System Reports</h1>
          <p className="text-gray-400 text-sm">Generate and export operations data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <GlassCard className="lg:col-span-1 border-white/10">
          <h3 className="font-bold text-white mb-6">Generate New Report</h3>
          
          <form className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Report Type</label>
              <select className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary/50">
                <option>Passenger Statistics</option>
                <option>Fleet Maintenance</option>
                <option>Driver Performance</option>
                <option>Route Efficiency</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400">Date Range</label>
              <div className="flex gap-2">
                <input type="date" className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-primary/50" />
                <input type="date" className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400">Export Format</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="format" className="accent-primary" defaultChecked />
                  <span className="text-sm text-white">PDF Document</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="format" className="accent-primary" />
                  <span className="text-sm text-white">CSV Data</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button type="button" className="btn-primary w-full py-2.5 flex justify-center items-center gap-2">
                <FileText size={16} /> Generate Report
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Saved Reports */}
        <GlassCard className="lg:col-span-2 border-white/10 p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h3 className="font-bold text-white">Recent Reports</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-gray-300 hover:text-white transition-colors text-sm">
              <Filter size={16} /> Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/10 border-b border-white/5">
                  <th className="p-4 text-sm font-semibold text-gray-400">Report Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Date Generated</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Format</th>
                  <th className="p-4 text-sm font-semibold text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: 'Q1 Passenger Volume Analysis', date: 'May 04, 2026', format: 'PDF' },
                  { name: 'Fleet Maintenance Log - April', date: 'May 01, 2026', format: 'CSV' },
                  { name: 'Driver Hours Summary', date: 'Apr 28, 2026', format: 'PDF' },
                  { name: 'Route 8 Delay Incident Report', date: 'Apr 20, 2026', format: 'PDF' },
                ].map((report, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm font-medium text-white flex items-center gap-2">
                      <FileText size={16} className="text-primary" /> {report.name}
                    </td>
                    <td className="p-4 text-sm text-gray-400 flex items-center gap-2">
                      <Calendar size={14} /> {report.date}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 font-mono">
                        {report.format}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-secondary hover:text-white transition-colors flex items-center justify-end gap-1 ml-auto text-sm">
                        <Download size={14} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Reports;
