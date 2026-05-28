const promClient = require('prom-client');

const register = new promClient.Registry();
register.setDefaultLabels({ service: 'product-service' });
promClient.collectDefaultMetrics({ register });

const httpRequests = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests received',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

module.exports = { register, httpRequests };
