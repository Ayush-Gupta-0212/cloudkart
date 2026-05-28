// src/app.js — Express app factory.
// Kept as a factory so tests can spin up isolated app instances.

const express = require('express');
const pinoHttp = require('pino-http');
const logger = require('./logger');
const usersRouter = require('./routes/users');
const { register, httpRequests } = require('./metrics');

function createApp() {
  const app = express();

  // ----- middlewares -----
  app.use(express.json({ limit: '100kb' }));            // parse JSON bodies
  app.use(pinoHttp({ logger }));                        // structured request logs

  // metrics middleware — count every request by method/route/status
  app.use((req, res, next) => {
    res.on('finish', () => {
      httpRequests.inc({
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode,
      });
    });
    next();
  });

  // ----- ops endpoints (required for K8s + Prometheus) -----
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/ready', (_req, res) => res.json({ status: 'ready' }));
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  // ----- business routes -----
  app.use('/api/users', usersRouter);

  // ----- 404 + error handler -----
  app.use((_req, res) => res.status(404).json({ error: 'not_found' }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    logger.error({ err }, 'unhandled error');
    res.status(500).json({ error: 'internal_error' });
  });

  return app;
}

module.exports = { createApp };
