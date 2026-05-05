import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, MapPin, Users, LayoutDashboard, Route, UserCheck, BarChart3, Bell, FileText, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Tracking', path: '/admin/tracking', icon: <MapPin size={20} /> },
    { name: 'Buses', path: '/admin/buses', icon: <Bus size={20} /> },
    { name: 'Routes', path: '/admin/routes', icon: <Route size={20} /> },
    { name: 'Drivers', path: '/admin/drivers', icon: <Users size={20} /> },
    { name: 'Students', path: '/admin/students', icon: <UserCheck size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Reports', path: '/admin/reports', icon: <FileText size={20} /> },
    { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <motion.aside 
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-black/20 backdrop-blur-md flex flex-col z-50 overflow-y-auto custom-scrollbar"
    >
      <div className="p-6 flex items-center gap-3 sticky top-0 bg-background-start/80 backdrop-blur-sm z-10 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent-start/30 shrink-0">
          <Bus size={24} className="text-white" />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-white">AdminPanel</h1>
      </div>
      
      <div className="px-4 py-6 flex-1 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="p-6 mt-auto sticky bottom-0 bg-background-end/80 backdrop-blur-sm border-t border-white/5">
        <NavLink to="/admin/login" className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white">
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </NavLink>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
