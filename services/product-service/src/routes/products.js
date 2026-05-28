// src/routes/products.js — public read-only product endpoints.

const express = require('express');
const store = require('../store');

const router = express.Router();

// ------------------------------------------------------------------
// GET /api/products             list all
// GET /api/products?category=X  filter by category
// ------------------------------------------------------------------
router.get('/', (req, res) => {
  const { category } = req.query;
  const items = store.list({ category });
  res.json({ count: items.length, items });
});

// ------------------------------------------------------------------
// GET /api/products/:id         single product
// ------------------------------------------------------------------
router.get('/:id', (req, res) => {
  const product = store.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'not_found' });
  res.json(product);
});

module.exports = router;
