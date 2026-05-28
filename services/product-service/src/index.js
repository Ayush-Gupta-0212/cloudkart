// src/index.js — process entry. Same shape as user-service.

const { createApp } = require('./app');
const logger = require('./logger');
const store = require('./store');

const PORT = parseInt(process.env.PORT || '3000', 10);

// seed the in-memory catalog on boot
store.seed();
logger.info({ count: store.count() }, 'product catalog seeded');

const app = createApp();
const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, 'product-service listening');
});

function shutdown(signal) {
  logger.info({ signal }, 'shutdown signal received');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
