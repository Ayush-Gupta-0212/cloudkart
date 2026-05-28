// src/store.js — in-memory carts + orders, keyed by userId (JWT sub).

const crypto = require('node:crypto');

// userId -> Map(productId -> cartItem)
const carts = new Map();

// orderId -> order
const orders = new Map();
// userId -> Set(orderId)
const ordersByUser = new Map();

function getOrCreateCart(userId) {
  if (!carts.has(userId)) carts.set(userId, new Map());
  return carts.get(userId);
}

function snapshotCart(userId) {
  const cart = getOrCreateCart(userId);
  const items = Array.from(cart.values());
  const total = items.reduce(
    (sum, i) => sum + i.priceInCentsAtAdd * i.quantity,
    0,
  );
  return { items, total, currency: 'USD' };
}

module.exports = {
  // -------- cart --------
  addCartItem(userId, item) {
    const cart = getOrCreateCart(userId);
    const existing = cart.get(item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.set(item.productId, { ...item });
    }
    return snapshotCart(userId);
  },

  removeCartItem(userId, productId) {
    const cart = getOrCreateCart(userId);
    const existed = cart.delete(productId);
    return { existed, cart: snapshotCart(userId) };
  },

  getCart(userId) {
    return snapshotCart(userId);
  },

  clearCart(userId) {
    carts.set(userId, new Map());
  },

  // -------- orders --------
  createOrder(userId) {
    const cart = snapshotCart(userId);
    if (cart.items.length === 0) return null;

    const order = {
      id: crypto.randomUUID(),
      userId,
      items: cart.items,
      total: cart.total,
      currency: cart.currency,
      status: 'placed',
      placedAt: new Date().toISOString(),
    };
    orders.set(order.id, order);
    if (!ordersByUser.has(userId)) ordersByUser.set(userId, new Set());
    ordersByUser.get(userId).add(order.id);
    this.clearCart(userId);
    return order;
  },

  getOrder(orderId) {
    return orders.get(orderId) || null;
  },

  listOrders(userId) {
    const ids = ordersByUser.get(userId) || new Set();
    return Array.from(ids).map((id) => orders.get(id)).filter(Boolean);
  },

  clear() {
    carts.clear();
    orders.clear();
    ordersByUser.clear();
  },
};
