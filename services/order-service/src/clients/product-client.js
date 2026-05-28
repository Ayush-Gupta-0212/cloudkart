// src/clients/product-client.js — thin HTTP client to product-service.
// Uses Node 22's built-in fetch. URL is configurable via env var so:
//   - locally: http://localhost:3002
//   - in docker-compose: http://product-service:3000
//   - in K8s: http://product-service.cloudkart.svc.cluster.local

const logger = require('../logger');
const { productCalls } = require('../metrics');

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const TIMEOUT_MS = parseInt(process.env.PRODUCT_TIMEOUT_MS || '3000', 10);

async function getProduct(id) {
  const url = `${PRODUCT_SERVICE_URL}/api/products/${encodeURIComponent(id)}`;
  const stop = productCalls.startTimer();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.status === 404) {
      stop({ outcome: 'not_found' });
      return null;
    }
    if (!res.ok) {
      stop({ outcome: 'error' });
      throw new Error(`product-service returned ${res.status}`);
    }
    stop({ outcome: 'ok' });
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name !== 'Error') stop({ outcome: 'error' });
    logger.warn({ err: err.message, url }, 'product-service call failed');
    throw err;
  }
}

module.exports = { getProduct, PRODUCT_SERVICE_URL };
