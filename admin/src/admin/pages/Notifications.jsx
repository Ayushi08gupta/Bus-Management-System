import React from 'react';
import GlassCard from '../components/GlassCard';
import { Send, Bell, AlertTriangle, Info, Clock } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Communications Center</h1>
          <p className="text-gray-400 text-sm">Manage alerts and system announcements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Area */}
        <GlassCard className="lg:col-span-1 h-[600px] flex flex-col border-white/10">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <Send size={18} className="text-primary" /> New Announcement
          </h3>
          
          <form className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Target Audience</label>
              <select className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary/50">
                <option>All Users (Students & Drivers)</option>
                <option>All Students</option>
                <option>All Drivers</option>
                <option>Specific Route (City Center)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400">Priority Level</label>
              <select className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary/50">
                <option>Standard Information</option>
                <option>Warning / Delay</option>
                <option>Critical Alert</option>
              </select>
            </div>

            <div className="space-y-1 flex-1 flex flex-col">
              <label className="text-sm text-gray-400">Message Content</label>
              <textarea 
                className="w-full flex-1 bg-black/30 border border-white/10 rounded-lg py-3 px-3 text-white focus:outline-none focus:border-primary/50 resize-none"
                placeholder="Type your announcement here..."
              ></textarea>
            </div>

            <button type="button" className="btn-primary w-full py-3 flex justify-center items-center gap-2">
              <Send size={16} /> Broadcast Message
            </button>
          </form>
        </GlassCard>

        {/* History Area */}
        <GlassCard className="lg:col-span-2 h-[600px] flex flex-col border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-gray-400" /> Recent Broadcasts
            </h3>
          </div>

          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {[
              { type: 'critical', title: 'Route 8 Suspended due to roadwork', audience: 'All Users', time: 'Today, 09:30 AM' },
              { type: 'info', title: 'Holiday Schedule Update', audience: 'Students', time: 'Yesterday, 14:00 PM' },
              { type: 'warning', title: 'Expected delays near Tech Park', audience: 'Tech Park Route', time: 'May 03, 16:45 PM' },
              { type: 'info', title: 'New Bus added to fleet', audience: 'Drivers', time: 'May 01, 10:00 AM' },
            ].map((msg, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4">
                <div className={`mt-1 p-2 rounded-full h-fit ${
                  msg.type === 'critical' ? 'bg-red-500/20 text-red-400' :
                  msg.type === 'warning' ? 'bg-warning/20 text-warning' :
                  'bg-primary/20 text-primary'
                }`}>
                  {msg.type === 'critical' ? <AlertTriangle size={18} /> : 
                   msg.type === 'warning' ? <Bell size={18} /> : 
                   <Info size={18} />}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{msg.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 rounded bg-black/40 text-gray-400">{msg.audience}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Notifications;
