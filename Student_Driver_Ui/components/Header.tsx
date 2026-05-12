'use client';

import { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/app/AuthContext';

export function Header({
  onLoginClick,
  onRegisterClick,
  onDashboardClick,
}: {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onDashboardClick?: () => void;
}) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <Button className="btn-glass btn-gradient text-sm" onClick={onDashboardClick}>
                  {user.role === 'student' ? 'Student' : 'Driver'} Dashboard
                </Button>
                <Button variant="outline" className="btn-glass btn-outline-glass text-gray-800 text-sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="btn-glass btn-outline-glass text-gray-800 text-sm" onClick={onLoginClick}>
                  Login
                </Button>
                <Button className="btn-glass btn-gradient text-sm" onClick={onRegisterClick}>
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/40 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Button
                  className="w-full btn-glass btn-gradient text-sm"
                  onClick={() => { setMenuOpen(false); onDashboardClick?.(); }}
                >
                  {user.role === 'student' ? 'Student' : 'Driver'} Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full btn-glass btn-outline-glass text-gray-800 text-sm"
                  onClick={() => { setMenuOpen(false); logout(); }}
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full btn-glass btn-outline-glass text-gray-800 text-sm"
                  onClick={() => { setMenuOpen(false); onLoginClick(); }}
                >
                  Login
                </Button>
                <Button
                  className="w-full btn-glass btn-gradient text-sm"
                  onClick={() => { setMenuOpen(false); onRegisterClick(); }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}