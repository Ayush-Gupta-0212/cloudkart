// src/routes/orders.js

const express = require('express');
const { authRequired } = require('../middleware/auth');
const store = require('../store');

const router = express.Router();

// POST /api/orders — place an order from the current cart
router.post('/', authRequired, (req, res) => {
  const order = store.createOrder(req.user.sub);
  if (!order) return res.status(400).json({ error: 'cart_empty' });
  res.status(201).json(order);
});

// GET /api/orders — list this user's orders
router.get('/', authRequired, (req, res) => {
  res.json({ items: store.listOrders(req.user.sub) });
});

// GET /api/orders/:id — single order (must belong to this user)
router.get('/:id', authRequired, (req, res) => {
  const order = store.getOrder(req.params.id);
  if (!order || order.userId !== req.user.sub) {
    return res.status(404).json({ error: 'not_found' });
  }
  res.json(order);
});

module.exports = router;
