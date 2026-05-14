'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { DashboardPreview } from '@/components/DashboardPreview';
import { RoutesSection } from '@/components/RoutesSection';
import { AuthModal } from '@/components/AuthModal';
import { Dashboard } from '@/components/Dashboard';
import { useAuth } from '@/app/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showDashboard, setShowDashboard] = useState(false);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Auto-show dashboard after login
  const handleAuthSuccess = () => setShowDashboard(true);

  if (user && showDashboard) {
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setShowDashboard(false)}
            className="px-4 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/20 hover:bg-white/50 transition-all text-gray-700 font-medium text-sm shadow"
          >
            ← Home
          </button>
        </div>
        <Dashboard />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Header
        onLoginClick={() => openAuth('login')}
        onRegisterClick={() => openAuth('register')}
        onDashboardClick={() => user && setShowDashboard(true)}
      />
      <HeroSection onGetStarted={() => openAuth('register')} />
      <FeaturesSection />
      <DashboardPreview />
      <RoutesSection />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </main>
  );
}
