const promClient = require('prom-client');

const register = new promClient.Registry();
register.setDefaultLabels({ service: 'order-service' });
promClient.collectDefaultMetrics({ register });

const httpRequests = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests received',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// custom: track calls to product-service (latency + outcome)
const productCalls = new promClient.Histogram({
  name: 'product_service_call_duration_seconds',
  help: 'Latency of calls to product-service',
  labelNames: ['outcome'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [register],
});

module.exports = { register, httpRequests, productCalls };
