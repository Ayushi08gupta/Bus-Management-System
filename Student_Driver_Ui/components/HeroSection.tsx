'use client';

import { Button } from './ui/button';
import { Bus, MapPin, Clock, Shield, Zap } from 'lucide-react';

export function HeroSection({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-0">
        {/* Left Content */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Track Your College Bus in{' '}
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
                Real-Time
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Smart, safe and reliable bus tracking for students. Know exactly where your bus is and when it arrives.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 inline-flex flex-col items-start">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-400/30 flex-shrink-0">
                <MapPin className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-700 font-medium">Live GPS Tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-400/30 flex-shrink-0">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-700 font-medium">Accurate ETAs</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-400/30 flex-shrink-0">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 font-medium">Safe & Secure</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center lg:justify-start pt-2">
            <Button
              className="btn-glass btn-gradient text-base h-12 px-8 flex items-center gap-2"
              onClick={onGetStarted}
            >
              <Zap className="w-5 h-5" />
              Get Started
            </Button>
          </div>
        </div>

        {/* Right Benefits — hidden on small mobile, shown from sm up */}
        <div className="hidden sm:flex flex-col gap-4 w-full max-w-sm mx-auto lg:mx-0">
          <div className="glass-card p-5 card-hover border-2 border-purple-300/50">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-400/40 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Zero Waiting</h3>
                <p className="text-sm text-gray-600">Know exactly when your bus arrives - no more guessing</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-5 card-hover border-2 border-blue-300/50">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-400/40 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Smart Scheduling</h3>
                <p className="text-sm text-gray-600">Plan your day with real-time bus data and accurate timing</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-5 card-hover border-2 border-green-300/50">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-400/40 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Always Connected</h3>
                <p className="text-sm text-gray-600">Track your bus from anywhere with our mobile app</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-5 card-hover border-2 border-pink-300/50">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-400/40 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Fully Secure</h3>
                <p className="text-sm text-gray-600">Your safety is our priority with verified drivers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
