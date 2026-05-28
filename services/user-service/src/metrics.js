// src/metrics.js — Prometheus metrics registry.
// Exposes both default Node.js metrics (event loop lag, memory, CPU)
// and our custom HTTP request counter.

const promClient = require('prom-client');

const register = new promClient.Registry();
register.setDefaultLabels({ service: 'user-service' });
promClient.collectDefaultMetrics({ register });

const httpRequests = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests received',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

module.exports = { register, httpRequests };
