// src/app.js — Express app factory.

const express = require('express');
const pinoHttp = require('pino-http');
const logger = require('./logger');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const { register, httpRequests } = require('./metrics');

function createApp() {
  const app = express();

  app.use(express.json({ limit: '100kb' }));
  app.use(pinoHttp({ logger }));

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

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/ready', (_req, res) => res.json({ status: 'ready' }));
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  app.use('/api/cart', cartRouter);
  app.use('/api/orders', ordersRouter);

  app.use((_req, res) => res.status(404).json({ error: 'not_found' }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    logger.error({ err }, 'unhandled error');
    res.status(500).json({ error: 'internal_error' });
  });

  return app;
}

module.exports = { createApp };
