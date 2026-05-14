const express = require('express');
const { getIO } = require('../socket');
const router = express.Router();

// In-memory store (replace with MongoDB in production)
const busLocations = {};

/**
 * POST /api/gps/update-location
 * Driver sends GPS coordinates → broadcast via Socket.IO
 */
router.post('/update-location', (req, res) => {
  const { busId, driverId, latitude, longitude, speed, heading } = req.body;

  if (!busId || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const location = {
    busId,
    driverId,
    latitude,
    longitude,
    speed: speed || 0,
    heading: heading || 0,
    timestamp: new Date(),
    updated_at: new Date().toISOString(),
  };

  busLocations[busId] = location;

  // Broadcast to all clients watching this bus
  try {
    const io = getIO();
    io.to(`bus:${busId}`).emit('location:update', location);
  } catch {
    // socket not ready yet
  }

  res.json({ success: true, message: 'Location updated', data: location });
});

/**
 * GET /api/gps/bus/:busId
 * Get current location of a specific bus
 */
router.get('/bus/:busId', (req, res) => {
  const { busId } = req.params;
  const location = busLocations[busId];

  if (!location) {
    return res.status(404).json({ error: 'Bus not found or offline', busId });
  }

  const timeSinceUpdate = Date.now() - location.timestamp;
  const isStale = timeSinceUpdate > 2 * 60 * 1000;

  res.json({ success: true, data: location, isStale, timeSinceUpdate });
});

/**
 * GET /api/gps/all-buses
 * Get locations of all active buses
 */
router.get('/all-buses', (req, res) => {
  const activeBuses = Object.values(busLocations).filter(bus => {
    const timeSinceUpdate = Date.now() - bus.timestamp;
    return timeSinceUpdate < 5 * 60 * 1000;
  });

  res.json({ success: true, count: activeBuses.length, data: activeBuses });
});

/**
 * POST /api/gps/clear/:busId
 * Mark bus as offline
 */
router.post('/clear/:busId', (req, res) => {
  const { busId } = req.params;
  delete busLocations[busId];

  try {
    const io = getIO();
    io.to(`bus:${busId}`).emit('bus:offline', { busId });
  } catch (err) {}

  res.json({ success: true, message: `Bus ${busId} marked as offline` });
});

module.exports = router;
