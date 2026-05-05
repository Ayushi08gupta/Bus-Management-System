// Bus tracking data with route coordinates and stops
export interface Stop {
  id: string;
  name: string;
  position: number; // 0-100 representing position on route
  status: 'completed' | 'current' | 'upcoming';
}

export interface BusRoute {
  id: string;
  busNumber: string;
  routeName: string;
  driver: string;
  status: 'On Time' | 'Delayed';
  eta: string;
  currentLocation: string;
  progress: number; // 0-100
  stops: Stop[];
}

export const busRoutesData: Record<string, BusRoute> = {
  '01': {
    id: '01',
    busNumber: 'BUS-01',
    routeName: 'Main Gate → College',
    driver: 'Raj',
    status: 'On Time',
    eta: '5 mins',
    currentLocation: 'Main Gate',
    progress: 25,
    stops: [
      { id: '1', name: 'Main Gate', position: 0, status: 'current' },
      { id: '2', name: 'City Center', position: 33, status: 'upcoming' },
      { id: '3', name: 'Market Square', position: 66, status: 'upcoming' },
      { id: '4', name: 'College', position: 100, status: 'upcoming' },
    ],
  },
  '02': {
    id: '02',
    busNumber: 'BUS-02',
    routeName: 'Kolar → College',
    driver: 'Ramesh',
    status: 'On Time',
    eta: '12 mins',
    currentLocation: 'Highway 5',
    progress: 40,
    stops: [
      { id: '1', name: 'Kolar', position: 0, status: 'completed' },
      { id: '2', name: 'Highway 5', position: 40, status: 'current' },
      { id: '3', name: 'Bus Stand', position: 70, status: 'upcoming' },
      { id: '4', name: 'College', position: 100, status: 'upcoming' },
    ],
  },
  '03': {
    id: '03',
    busNumber: 'BUS-03',
    routeName: 'Downtown → College',
    driver: 'Kumar',
    status: 'Delayed',
    eta: '8 mins',
    currentLocation: 'Shopping Mall',
    progress: 50,
    stops: [
      { id: '1', name: 'Downtown', position: 0, status: 'completed' },
      { id: '2', name: 'Shopping Mall', position: 50, status: 'current' },
      { id: '3', name: 'Hospital', position: 75, status: 'upcoming' },
      { id: '4', name: 'College', position: 100, status: 'upcoming' },
    ],
  },
  '04': {
    id: '04',
    busNumber: 'BUS-04',
    routeName: 'Airport → College',
    driver: 'Vikram',
    status: 'On Time',
    eta: '15 mins',
    currentLocation: 'Highway Junction',
    progress: 35,
    stops: [
      { id: '1', name: 'Airport', position: 0, status: 'completed' },
      { id: '2', name: 'Highway Junction', position: 35, status: 'current' },
      { id: '3', name: 'Train Station', position: 70, status: 'upcoming' },
      { id: '4', name: 'College', position: 100, status: 'upcoming' },
    ],
  },
  '05': {
    id: '05',
    busNumber: 'BUS-05',
    routeName: 'Station → College',
    driver: 'Arjun',
    status: 'On Time',
    eta: '3 mins',
    currentLocation: 'Near College Gate',
    progress: 90,
    stops: [
      { id: '1', name: 'Station', position: 0, status: 'completed' },
      { id: '2', name: 'City Hall', position: 30, status: 'completed' },
      { id: '3', name: 'Near College Gate', position: 90, status: 'current' },
      { id: '4', name: 'College', position: 100, status: 'upcoming' },
    ],
  },
  '06': {
    id: '06',
    busNumber: 'BUS-06',
    routeName: 'Market → College',
    driver: 'Suresh',
    status: 'On Time',
    eta: '20 mins',
    currentLocation: 'Market',
    progress: 10,
    stops: [
      { id: '1', name: 'Market', position: 0, status: 'current' },
      { id: '2', name: 'Bridge', position: 25, status: 'upcoming' },
      { id: '3', name: 'Park Road', position: 60, status: 'upcoming' },
      { id: '4', name: 'College', position: 100, status: 'upcoming' },
    ],
  },
};
