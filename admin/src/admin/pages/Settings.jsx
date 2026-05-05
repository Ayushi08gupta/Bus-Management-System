import React from 'react';
import GlassCard from '../components/GlassCard';
import { User, Shield, Bell, Database, Save } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-gray-400 text-sm">Configure system preferences and admin account</p>
        </div>
        <button className="btn-primary flex items-center gap-2 py-2.5 px-4">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs (Visual only for prototype) */}
        <div className="col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-lg bg-primary/20 border border-primary/30 text-white font-medium flex items-center gap-3">
            <User size={18} /> Profile
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center gap-3">
            <Shield size={18} /> Security
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center gap-3">
            <Bell size={18} /> Notifications
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center gap-3">
            <Database size={18} /> System Data
          </button>
        </div>

        {/* Settings Content */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          <GlassCard className="border-white/10 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/10 pb-4">Admin Profile</h3>
            
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-accent flex items-center justify-center shadow-lg text-white text-3xl font-bold">
                AD
              </div>
              <div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white text-sm font-medium mb-2">
                  Change Avatar
                </button>
                <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Full Name</label>
                <input type="text" defaultValue="System Admin" className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Email Address</label>
                <input type="email" defaultValue="admin@campusbus.edu" className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Phone Number</label>
                <input type="tel" defaultValue="+1 555-0000" className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Role</label>
                <input type="text" defaultValue="Super Administrator" disabled className="w-full bg-black/10 border border-white/5 rounded-lg py-2.5 px-3 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/10 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/10 pb-4">System Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                <div>
                  <h4 className="text-white font-medium">Automatic Route Optimization</h4>
                  <p className="text-sm text-gray-400 mt-1">Allow AI to suggest route changes based on traffic data.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                <div>
                  <h4 className="text-white font-medium">Public Data API</h4>
                  <p className="text-sm text-gray-400 mt-1">Expose bus location data to third-party campus apps.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;
