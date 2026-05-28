// src/index.js — process entry point.
// Boots the HTTP server, wires graceful shutdown so K8s can stop us cleanly.

const { createApp } = require('./app');
const logger = require('./logger');

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = createApp();

const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, 'user-service listening');
});

// Graceful shutdown — Kubernetes sends SIGTERM, we get ~30s to finish in-flight requests.
function shutdown(signal) {
  logger.info({ signal }, 'shutdown signal received');
  server.close((err) => {
    if (err) {
      logger.error({ err }, 'error during shutdown');
      process.exit(1);
    }
    logger.info('server closed cleanly');
    process.exit(0);
  });
  // hard exit after 10s if close() hangs
  setTimeout(() => {
    logger.warn('forcing shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
