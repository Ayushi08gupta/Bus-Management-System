'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import { DriverDetailsModal } from '../DriverDetailsModal';
import { api } from '@/lib/api';

// Bus data structure
interface BusOption {
  id: string;
  number: string;
  route: string;
  departure: string;
  arrival: string;
  duration: string;
  driver: string;
  stops: number;
  occupancy: number;
  capacity: number;
  status: 'On Time' | 'Delayed';
  fromStop: string;
  toStop: string;
}

// Mock bus routes with stops
const busDatabase: BusOption[] = [
  {
    id: '01',
    number: 'BUS-01',
    route: 'Main Gate → College',
    departure: '08:00 AM',
    arrival: '08:45 AM',
    duration: '45 mins',
    driver: 'Raj',
    stops: 4,
    occupancy: 42,
    capacity: 52,
    status: 'On Time',
    fromStop: 'Main Gate',
    toStop: 'College',
  },
  {
    id: '02',
    number: 'BUS-02',
    route: 'Kolar → College',
    departure: '07:30 AM',
    arrival: '08:42 AM',
    duration: '72 mins',
    driver: 'Ramesh',
    stops: 5,
    occupancy: 38,
    capacity: 52,
    status: 'On Time',
    fromStop: 'Kolar',
    toStop: 'College',
  },
  {
    id: '03',
    number: 'BUS-03',
    route: 'Downtown → College',
    departure: '08:15 AM',
    arrival: '08:53 AM',
    duration: '38 mins',
    driver: 'Kumar',
    stops: 3,
    occupancy: 45,
    capacity: 52,
    status: 'Delayed',
    fromStop: 'Downtown',
    toStop: 'College',
  },
  {
    id: '04',
    number: 'BUS-04',
    route: 'Airport → College',
    departure: '07:00 AM',
    arrival: '08:15 AM',
    duration: '75 mins',
    driver: 'Vikram',
    stops: 6,
    occupancy: 50,
    capacity: 52,
    status: 'On Time',
    fromStop: 'Airport',
    toStop: 'College',
  },
  {
    id: '05',
    number: 'BUS-05',
    route: 'Station → College',
    departure: '08:30 AM',
    arrival: '08:33 AM',
    duration: '3 mins',
    driver: 'Arjun',
    stops: 2,
    occupancy: 40,
    capacity: 52,
    status: 'On Time',
    fromStop: 'Station',
    toStop: 'College',
  },
  {
    id: '06',
    number: 'BUS-06',
    route: 'Market → College',
    departure: '08:20 AM',
    arrival: '09:25 AM',
    duration: '65 mins',
    driver: 'Suresh',
    stops: 5,
    occupancy: 48,
    capacity: 52,
    status: 'On Time',
    fromStop: 'Market',
    toStop: 'College',
  },
  {
    id: '07',
    number: 'BUS-07',
    route: 'City Center → Campus',
    departure: '08:10 AM',
    arrival: '08:50 AM',
    duration: '40 mins',
    driver: 'Priya',
    stops: 4,
    occupancy: 35,
    capacity: 52,
    status: 'On Time',
    fromStop: 'City Center',
    toStop: 'Campus',
  },
  {
    id: '08',
    number: 'BUS-08',
    route: 'Mall → University',
    departure: '07:45 AM',
    arrival: '08:30 AM',
    duration: '45 mins',
    driver: 'Anand',
    stops: 3,
    occupancy: 44,
    capacity: 52,
    status: 'On Time',
    fromStop: 'Mall',
    toStop: 'University',
  },
];

// Get all unique stops
const allStops = Array.from(new Set(busDatabase.flatMap(bus => [bus.fromStop, bus.toStop]))).sort();

interface RouteSearchProps {
  onSelectBus: (busId: string) => void;
}

export function RouteSearch({ onSelectBus }: RouteSearchProps) {
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBusForDetails, setSelectedBusForDetails] = useState<BusOption | null>(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [liveBuses, setLiveBuses] = useState<BusOption[]>(busDatabase);

  // Fetch live bus data from backend
  useEffect(() => {
    api.buses.getAll()
      .then((data: any[]) => {
        const mapped: BusOption[] = data.map(b => ({
          id: b.id,
          number: b.number,
          route: b.route,
          departure: '08:00 AM',
          arrival: '09:00 AM',
          duration: '60 mins',
          driver: b.driver,
          stops: 4,
          occupancy: b.occupied,
          capacity: b.capacity,
          status: b.status,
          fromStop: b.route.split(' → ')[0],
          toStop: b.route.split(' → ')[1] || 'College',
        }));
        setLiveBuses(mapped);
      })
      .catch(() => {}); // fallback to static data on error
  }, []);

  // Filter stops for suggestions
  const fromSuggestions = useMemo(() => {
    if (!fromStop) return allStops;
    return allStops.filter(stop => 
      stop.toLowerCase().includes(fromStop.toLowerCase())
    );
  }, [fromStop]);

  const toSuggestions = useMemo(() => {
    if (!toStop) return allStops;
    return allStops.filter(stop => 
      stop.toLowerCase().includes(toStop.toLowerCase()) &&
      stop !== fromStop
    );
  }, [toStop, fromStop]);

  // Filter buses based on selection
  const filteredBuses = useMemo(() => {
    if (!fromStop || !toStop) return [];
    return liveBuses.filter(bus => {
      const fromMatch = bus.fromStop.toLowerCase().includes(fromStop.toLowerCase());
      const toMatch = bus.toStop.toLowerCase().includes(toStop.toLowerCase());
      return fromMatch && toMatch;
    });
  }, [fromStop, toStop, liveBuses]);

  const handleSearch = () => {
    if (fromStop && toStop) {
      setHasSearched(true);
    }
  };

  const handleSelectBus = (bus: BusOption) => {
    setSelectedBusForDetails(bus);
    setShowDriverDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <Card className="glass-card p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Search Buses</h2>

        {/* Search Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          {/* From */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
              <Input
                type="text"
                placeholder="Select departure point"
                value={fromStop}
                onChange={(e) => {
                  setFromStop(e.target.value);
                  setShowFromSuggestions(true);
                }}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                className="pl-10 bg-white/50 border-white/30 focus:border-purple-400 focus:ring-purple-400/50"
              />

              {/* From Suggestions */}
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur border border-white/30 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {fromSuggestions.map(stop => (
                    <button
                      key={stop}
                      onClick={() => {
                        setFromStop(stop);
                        setShowFromSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-100/50 transition-colors text-gray-800"
                    >
                      <MapPin className="w-3 h-3 inline mr-2 text-purple-500" />
                      {stop}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* To */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
              <Input
                type="text"
                placeholder="Select destination"
                value={toStop}
                onChange={(e) => {
                  setToStop(e.target.value);
                  setShowToSuggestions(true);
                }}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                className="pl-10 bg-white/50 border-white/30 focus:border-green-400 focus:ring-green-400/50"
              />

              {/* To Suggestions */}
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur border border-white/30 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {toSuggestions.map(stop => (
                    <button
                      key={stop}
                      onClick={() => {
                        setToStop(stop);
                        setShowToSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-green-100/50 transition-colors text-gray-800"
                    >
                      <MapPin className="w-3 h-3 inline mr-2 text-green-500" />
                      {stop}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!fromStop || !toStop}
          className="w-full btn-glass btn-gradient h-11 font-medium"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Buses
        </Button>
      </Card>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          {filteredBuses.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-800">
                Available Buses ({filteredBuses.length})
              </h3>
              <div className="space-y-3">
                {filteredBuses.map(bus => (
                  <Card
                    key={bus.id}
                    className="glass-card p-4 card-hover hover:shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      {/* Bus Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-bold text-lg text-gray-800">{bus.number}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            bus.status === 'On Time' 
                              ? 'bg-green-400/20 text-green-700' 
                              : 'bg-red-400/20 text-red-700'
                          }`}>
                            {bus.status}
                          </span>
                        </div>

                        {/* Route */}
                        <div className="flex items-center gap-2 text-gray-700 text-sm mb-3">
                          <span className="font-medium">{bus.fromStop}</span>
                          <ArrowRight className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">{bus.toStop}</span>
                        </div>

                        {/* Time and Details — 2 cols on mobile, 4 on sm+ */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-sm">
                          <div>
                            <p className="text-gray-600 text-xs">Departure</p>
                            <p className="font-semibold text-gray-800">{bus.departure}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Arrival</p>
                            <p className="font-semibold text-gray-800">{bus.arrival}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Duration</p>
                            <p className="font-semibold text-gray-800">{bus.duration}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Driver</p>
                            <p className="font-semibold text-gray-800">{bus.driver}</p>
                          </div>
                        </div>

                        {/* Occupancy */}
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-gray-600">Occupancy</p>
                            <p className="text-xs font-semibold text-gray-700">
                              {bus.occupancy}/{bus.capacity}
                            </p>
                          </div>
                          <div className="w-full bg-gray-300/50 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                              style={{ width: `${(bus.occupancy / bus.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Book Button */}
                      <Button
                        onClick={() => handleSelectBus(bus)}
                        className="btn-glass btn-gradient w-full sm:w-auto h-10 font-medium whitespace-nowrap"
                      >
                        Track Bus
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="glass-card p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No buses found for this route.</p>
              <p className="text-sm text-gray-500 mt-2">Try different departure and destination points.</p>
            </Card>
          )}
        </div>
      )}

      {/* Driver Details Modal */}
      {selectedBusForDetails && (
        <DriverDetailsModal
          isOpen={showDriverDetails}
          onClose={() => {
            setShowDriverDetails(false);
            setSelectedBusForDetails(null);
          }}
          onTrackBus={() => {
            onSelectBus(selectedBusForDetails.id);
            setShowDriverDetails(false);
          }}
          busNumber={selectedBusForDetails.number}
          driver={{
            name: selectedBusForDetails.driver,
            rating: 4.5,
            totalRides: 1250 + Math.floor(Math.random() * 500),
            phone: '+91 9876543210',
            experience: '5+ years driving experience',
            vehicle: 'Volvo B9R AC Coach',
            licensePlate: 'KA05AB1234',
          }}
        />
      )}
    </div>
  );
}
