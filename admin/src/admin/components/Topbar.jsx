import React from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-20 border-b border-white/10 bg-transparent flex items-center justify-between px-8 z-40">
      <div className="flex items-center glass-panel px-4 py-2 w-96 rounded-full border-none bg-white/5">
        <Search size={18} className="text-gray-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search for routes, buses..." 
          className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
          <Sun size={18} className="text-gray-300" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10 relative">
          <Bell size={18} className="text-gray-300" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-start rounded-full shadow-[0_0_8px_#7C3AED]"></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
