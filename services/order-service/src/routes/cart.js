// src/routes/cart.js

const express = require('express');
const { authRequired } = require('../middleware/auth');
const store = require('../store');
const { getProduct } = require('../clients/product-client');

const router = express.Router();

// GET /api/cart
router.get('/', authRequired, (req, res) => {
  res.json(store.getCart(req.user.sub));
});

// POST /api/cart/items  { productId, quantity? }
router.post('/items', authRequired, async (req, res) => {
  const { productId, quantity = 1 } = req.body || {};
  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'quantity must be a positive integer' });
  }

  let product;
  try {
    product = await getProduct(productId);
  } catch {
    return res.status(503).json({ error: 'product_service_unavailable' });
  }
  if (!product) {
    return res.status(404).json({ error: 'product_not_found' });
  }
  if (product.stock < quantity) {
    return res.status(409).json({ error: 'insufficient_stock', available: product.stock });
  }

  const cart = store.addCartItem(req.user.sub, {
    productId: product.id,
    name: product.name,
    quantity,
    priceInCentsAtAdd: product.priceInCents,
  });
  res.status(201).json(cart);
});

// DELETE /api/cart/items/:productId
router.delete('/items/:productId', authRequired, (req, res) => {
  const { existed, cart } = store.removeCartItem(req.user.sub, req.params.productId);
  if (!existed) return res.status(404).json({ error: 'item_not_in_cart' });
  res.json(cart);
});

module.exports = router;
