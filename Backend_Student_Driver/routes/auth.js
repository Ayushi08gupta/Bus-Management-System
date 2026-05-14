const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory store (replace with DB in production)
const users = [];

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'All fields required' });
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name, email, password: hashed, role };
  users.push(user);

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name, email, role } });
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  const user = users.find(u => u.email === email && u.role === role);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email, role } });
});

module.exports = router;
