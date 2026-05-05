'use client';

import { Card } from './ui/card';
import { Activity, Bell, MapPin, Navigation, Lock, Clock } from 'lucide-react';

const features = [
  {
    icon: Navigation,
    title: 'Live Tracking',
    description: 'Real-time GPS tracking for all buses',
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get instant alerts about bus arrivals',
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    icon: MapPin,
    title: 'Route Management',
    description: 'Optimized routes for maximum efficiency',
    gradient: 'from-green-400 to-green-600',
  },
  {
    icon: Activity,
    title: 'Driver Updates',
    description: 'Real-time driver status and updates',
    gradient: 'from-pink-400 to-pink-600',
  },
  {
    icon: Lock,
    title: 'Secure Login',
    description: 'End-to-end encrypted authentication',
    gradient: 'from-indigo-400 to-indigo-600',
  },
  {
    icon: Clock,
    title: 'Real-Time ETA',
    description: 'Accurate arrival time predictions',
    gradient: 'from-orange-400 to-orange-600',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for efficient college bus management
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="glass-card p-8 card-hover group"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
