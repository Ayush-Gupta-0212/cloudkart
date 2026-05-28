const request = require('supertest');
const { createApp } = require('../src/app');
const store = require('../src/store');

describe('product-service', () => {
  let app;

  beforeEach(() => {
    store.clear();
    store.seed();
    app = createApp();
  });

  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /metrics returns prometheus text', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('http_requests_total');
  });

  test('GET /api/products returns the full catalog', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(8);
    expect(res.body.items).toHaveLength(res.body.count);
    expect(res.body.items[0]).toHaveProperty('id');
    expect(res.body.items[0]).toHaveProperty('sku');
    expect(res.body.items[0]).toHaveProperty('priceInCents');
  });

  test('GET /api/products?category=displays filters', async () => {
    const res = await request(app).get('/api/products?category=displays');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    for (const item of res.body.items) {
      expect(item.category).toBe('displays');
    }
  });

  test('GET /api/products?category=nonsense returns empty', async () => {
    const res = await request(app).get('/api/products?category=nonsense');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.items).toEqual([]);
  });

  test('GET /api/products/:id returns one product', async () => {
    const all = await request(app).get('/api/products');
    const first = all.body.items[0];
    const res = await request(app).get(`/api/products/${first.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(first.id);
    expect(res.body.name).toBe(first.name);
  });

  test('GET /api/products/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/products/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('not_found');
  });

  test('unknown path returns 404', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
  });
});
