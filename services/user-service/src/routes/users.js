// src/routes/users.js — the 3 business endpoints.

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../store');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-in-prod';
const JWT_TTL = process.env.JWT_TTL || '1h';

// ------------------------------------------------------------------
// POST /api/users/register  { email, password, name }
// ------------------------------------------------------------------
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password, name are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'password must be at least 6 characters' });
  }
  if (store.findByEmail(email)) {
    return res.status(409).json({ error: 'email already registered' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = store.create({ email, name, passwordHash });
  return res.status(201).json({ id: user.id, email: user.email, name: user.name });
});

// ------------------------------------------------------------------
// POST /api/users/login  { email, password }  → { token }
// ------------------------------------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  const user = store.findByEmail(email);
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_TTL },
  );
  return res.json({ token });
});

// ------------------------------------------------------------------
// GET /api/users/me  (Authorization: Bearer <token>)
// ------------------------------------------------------------------
router.get('/me', authRequired, (req, res) => {
  const user = store.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'not_found' });
  return res.json({ id: user.id, email: user.email, name: user.name });
});

module.exports = router;
