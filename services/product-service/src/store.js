// src/store.js — in-memory product catalog with seed data.
// Phase 1.7: this gets replaced by PostgreSQL — routes won't change.

const crypto = require('node:crypto');

const SEED_PRODUCTS = [
  { sku: 'KB-001', name: 'Mechanical Keyboard',         category: 'peripherals', priceInCents: 12999, stock: 50,  description: 'RGB backlit, hot-swappable switches, USB-C.' },
  { sku: 'MS-001', name: 'Wireless Mouse',              category: 'peripherals', priceInCents:  4999, stock: 100, description: 'Ergonomic shape, 8000 DPI, 70-hour battery.' },
  { sku: 'WC-001', name: 'HD Webcam',                   category: 'peripherals', priceInCents:  6999, stock: 40,  description: '1080p sensor, built-in stereo mics, autofocus.' },
  { sku: 'MN-001', name: '27-inch 4K Monitor',          category: 'displays',    priceInCents: 39999, stock: 20,  description: 'IPS panel, 60Hz, HDR10, USB-C input.' },
  { sku: 'MN-002', name: '34-inch Ultrawide Monitor',   category: 'displays',    priceInCents: 54999, stock: 12,  description: 'Curved, 144Hz, perfect for split-screen coding.' },
  { sku: 'HS-001', name: 'Noise-Cancelling Headset',    category: 'audio',       priceInCents: 17999, stock: 30,  description: 'Bluetooth + USB, 30-hour battery.' },
  { sku: 'HD-001', name: 'USB-C Docking Station',       category: 'accessories', priceInCents:  8999, stock: 75,  description: 'Triple display output, 100W PD charging.' },
  { sku: 'DK-001', name: 'Electric Standing Desk',      category: 'furniture',   priceInCents: 49999, stock: 10,  description: 'Programmable height presets, 71x29 inches.' },
];

const productsById = new Map();
const productsBySku = new Map();

function seed() {
  productsById.clear();
  productsBySku.clear();
  for (const p of SEED_PRODUCTS) {
    const id = crypto.randomUUID();
    const product = {
      id,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      ...p,
    };
    productsById.set(id, product);
    productsBySku.set(p.sku, id);
  }
}

module.exports = {
  seed,
  list({ category } = {}) {
    const all = Array.from(productsById.values());
    if (!category) return all;
    return all.filter((p) => p.category === category.toLowerCase());
  },
  findById(id) {
    return productsById.get(id) || null;
  },
  findBySku(sku) {
    const id = productsBySku.get(sku);
    return id ? productsById.get(id) : null;
  },
  count() {
    return productsById.size;
  },
  clear() {
    productsById.clear();
    productsBySku.clear();
  },
};
