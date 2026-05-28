// src/index.js — process entry.

const { createApp } = require('./app');
const logger = require('./logger');

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = createApp();

const server = app.listen(PORT, () => {
  logger.info({
    port: PORT,
    productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  }, 'order-service listening');
});

function shutdown(signal) {
  logger.info({ signal }, 'shutdown signal received');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
