const express = require('express');
const router = express.Router();

const complaints = [];

router.post('/', (req, res) => {
  const { type, description, busNumber, driverName } = req.body;
  if (!type || !description) return res.status(400).json({ message: 'Type and description required' });

  const complaint = {
    id: Date.now().toString(36).toUpperCase(),
    type,
    description,
    busNumber,
    driverName,
    timestamp: new Date().toISOString(),
  };
  complaints.push(complaint);
  res.json({ message: 'Complaint submitted', id: complaint.id });
});

module.exports = router;
