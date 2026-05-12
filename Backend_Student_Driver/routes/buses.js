const express = require('express');
const router = express.Router();

// In-memory bus state (seeded with initial data)
const buses = [
  { id: '01', number: 'BUS-01', route: 'Main Gate → College', driver: 'Raj', arrivalTime: '08:30', distance: '2.3 km', status: 'On Time', occupied: 42, capacity: 52, tripStarted: false, progress: 25 },
  { id: '02', number: 'BUS-02', route: 'Kolar → College', driver: 'Ramesh', arrivalTime: '09:15', distance: '5.8 km', status: 'On Time', occupied: 38, capacity: 52, tripStarted: false, progress: 40 },
  { id: '03', number: 'BUS-03', route: 'Downtown → College', driver: 'Kumar', arrivalTime: '09:05', distance: '3.5 km', status: 'Delayed', occupied: 45, capacity: 52, tripStarted: true, progress: 50 },
  { id: '04', number: 'BUS-04', route: 'Airport → College', driver: 'Vikram', arrivalTime: '10:00', distance: '7.2 km', status: 'On Time', occupied: 50, capacity: 52, tripStarted: false, progress: 35 },
  { id: '05', number: 'BUS-05', route: 'Station → College', driver: 'Arjun', arrivalTime: '08:15', distance: '1.2 km', status: 'On Time', occupied: 40, capacity: 52, tripStarted: true, progress: 90 },
  { id: '06', number: 'BUS-06', route: 'Market → College', driver: 'Suresh', arrivalTime: '10:45', distance: '9.1 km', status: 'On Time', occupied: 48, capacity: 52, tripStarted: false, progress: 10 },
];

// GET all buses
router.get('/', (req, res) => res.json(buses));

// GET single bus
router.get('/:id', (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  res.json(bus);
});

// PATCH trip status (driver: start/end trip)
router.patch('/:id/trip', (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  const { tripStarted } = req.body;
  bus.tripStarted = tripStarted;
  if (!tripStarted) bus.progress = 0;
  res.json(bus);
});

// PATCH delay status
router.patch('/:id/status', (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  const { status, delayReason } = req.body;
  bus.status = status;
  if (delayReason) bus.delayReason = delayReason;
  res.json(bus);
});

// POST delay alert
router.post('/:id/alert', (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  // Broadcast alert via Socket.IO in production
  res.json({ message: 'Alert sent to all students' });
});

module.exports = router;
