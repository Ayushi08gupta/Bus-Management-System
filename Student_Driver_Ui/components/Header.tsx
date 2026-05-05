'use client';

import { Logo } from './Logo';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button
                  className="btn-glass btn-gradient"
                  onClick={onDashboardClick}
                >
                  {user.role === 'student' ? 'Student' : 'Driver'} Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="btn-glass btn-outline-glass text-gray-800"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="btn-glass btn-outline-glass text-gray-800"
                  onClick={onLoginClick}
                >
                  Login
                </Button>
                <Button
                  className="btn-glass btn-gradient"
                  onClick={onRegisterClick}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
