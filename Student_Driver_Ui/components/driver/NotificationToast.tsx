'use client';

import { useEffect, useState } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, Users } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'students';
  message: string;
}

const ICONS = {
  info:     <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />,
  warning:  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
  success:  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
  students: <Users className="w-4 h-4 text-indigo-400 flex-shrink-0" />,
};

const BORDERS = {
  info:     'border-sky-500/30',
  warning:  'border-amber-500/30',
  success:  'border-emerald-500/30',
  students: 'border-indigo-500/30',
};

interface Props {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationToast({ notifications, onDismiss }: Props) {
  if (notifications.length === 0) return null;

  return (
    <div className="space-y-2">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`flex items-center gap-3 bg-gray-900/95 backdrop-blur-xl border ${BORDERS[n.type]} rounded-xl px-3 py-2.5 shadow-xl`}
        >
          {ICONS[n.type]}
          <p className="text-gray-200 text-xs flex-1">{n.message}</p>
          <button onClick={() => onDismiss(n.id)} className="text-gray-600 hover:text-gray-400 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
