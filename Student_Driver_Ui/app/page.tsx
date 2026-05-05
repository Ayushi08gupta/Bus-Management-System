'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { AuthModal } from '@/components/AuthModal';
import { Dashboard } from '@/components/Dashboard';
import { useAuth } from '@/app/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showDashboard, setShowDashboard] = useState(false);

  const handleLoginClick = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthMode('register');
    setIsAuthOpen(true);
  };

  const handleGetStarted = () => {
    setAuthMode('register');
    setIsAuthOpen(true);
  };

  const handleDashboardClick = () => {
    if (user) {
      setShowDashboard(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowDashboard(true);
  };

  // Show dashboard if user is logged in and dashboard is requested
  if (user && showDashboard) {
    return (
      <div className="min-h-screen">
        <div className="fixed top-0 right-0 p-4 z-40">
          <button
            onClick={() => setShowDashboard(false)}
            className="px-4 py-2 rounded-lg bg-white/30 backdrop-blur-md border border-white/20 hover:bg-white/50 transition-all text-gray-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
        <Dashboard />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} onDashboardClick={handleDashboardClick} />

      {/* Sections */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} onSuccess={handleAuthSuccess} />
    </main>
  );
}
