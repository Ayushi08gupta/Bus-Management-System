'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  busNumber?: string;
  driverName?: string;
}

type ComplaintType = 'safety' | 'rushing' | 'behavior' | 'vehicle' | 'other';

const complaintTypes = [
  { id: 'safety', label: 'Safety Concern', emoji: '⚠️', color: 'bg-red-50 border-red-200' },
  { id: 'rushing', label: 'Rash/Rush Driving', emoji: '🚗', color: 'bg-orange-50 border-orange-200' },
  { id: 'behavior', label: 'Driver Behavior', emoji: '😟', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'vehicle', label: 'Vehicle Issue', emoji: '🛠️', color: 'bg-blue-50 border-blue-200' },
  { id: 'other', label: 'Other', emoji: '📝', color: 'bg-gray-50 border-gray-200' },
];

export function ComplaintModal({
  isOpen,
  onClose,
  busNumber,
  driverName,
}: ComplaintModalProps) {
  const [selectedType, setSelectedType] = useState<ComplaintType | null>(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedType && description.trim()) {
      console.log('Complaint submitted:', {
        type: selectedType,
        description,
        busNumber,
        driverName,
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedType(null);
        setDescription('');
        onClose();
      }, 2000);
    }
  };

  const isValid = selectedType && description.trim().length > 10;

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md text-center">
          <div className="py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-2">
              Your complaint has been submitted successfully. Our team will review it shortly.
            </p>
            <p className="text-sm text-gray-500">
              Confirmation ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          {busNumber && (
            <p className="text-sm text-gray-600 mt-2">
              Bus {busNumber} {driverName && `• Driver: ${driverName}`}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* Safety Notice */}
          <div className="p-3 bg-red-50/50 rounded-lg border border-red-200/50 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">
              For immediate safety concerns, contact your college authority or emergency services first.
            </p>
          </div>

          {/* Complaint Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">What's the issue?</label>
            <div className="grid grid-cols-1 gap-2">
              {complaintTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as ComplaintType)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedType === type.id
                      ? `${type.color} border-current`
                      : `${type.color}/30 border-transparent hover:border-gray-300`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{type.emoji}</span>
                    <span className="font-medium text-gray-800">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">
              Describe the incident
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about what happened..."
              className="w-full p-3 rounded-lg bg-white/50 border border-white/30 focus:border-purple-400 focus:ring-purple-400/50 resize-none h-24 text-gray-800"
            />
            <p className="text-xs text-gray-500">
              Minimum 10 characters ({description.length}/10)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              className="bg-white/50 border-white/30 text-gray-800 hover:bg-white/70"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="btn-glass btn-gradient"
              disabled={!isValid}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
