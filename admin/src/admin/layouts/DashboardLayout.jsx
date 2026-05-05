import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-background-start">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        {/* Background glow effects - keeping the signature aesthetic */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
        
        <Topbar />
        
        <main className="flex-1 p-8 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
