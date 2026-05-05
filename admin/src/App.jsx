import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './admin/layouts/DashboardLayout';

// Admin Pages
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import LiveTracking from './admin/pages/LiveTracking';
import Buses from './admin/pages/Buses';
import Drivers from './admin/pages/Drivers';
import RoutesPage from './admin/pages/Routes';
import Students from './admin/pages/Students';
import Analytics from './admin/pages/Analytics';
import Notifications from './admin/pages/Notifications';
import Reports from './admin/pages/Reports';
import Settings from './admin/pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin login */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        
        {/* Standalone Login Page */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Layout */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tracking" element={<LiveTracking />} />
          <Route path="buses" element={<Buses />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="students" element={<Students />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
