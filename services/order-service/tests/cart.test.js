// tests/cart.test.js
// product-service is mocked via global.fetch.

const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret-32-chars-long-enough-yes';
process.env.PRODUCT_SERVICE_URL = 'http://product-service.test';

const { createApp } = require('../src/app');
const store = require('../src/store');

const SAMPLE_PRODUCT = {
  id: 'prod-1',
  name: 'Mechanical Keyboard',
  priceInCents: 12999,
  stock: 50,
};

function makeToken(sub = 'user-1', email = 'a@b.com') {
  return jwt.sign({ sub, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

describe('cart', () => {
  let app;
  let token;

  beforeEach(() => {
    store.clear();
    global.fetch = jest.fn();
    app = createApp();
    token = makeToken();
  });

  test('GET /api/cart requires auth', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
  });

  test('GET /api/cart returns empty cart for new user', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  test('POST /api/cart/items adds item using price from product-service', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => SAMPLE_PRODUCT,
    });

    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'prod-1', quantity: 2 });

    expect(res.status).toBe(201);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://product-service.test/api/products/prod-1',
      expect.any(Object),
    );
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0]).toMatchObject({
      productId: 'prod-1',
      quantity: 2,
      priceInCentsAtAdd: 12999,
    });
    expect(res.body.total).toBe(12999 * 2);
  });

  test('POST /api/cart/items returns 404 if product unknown', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'nope', quantity: 1 });
    expect(res.status).toBe(404);
  });

  test('POST /api/cart/items returns 409 if insufficient stock', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ...SAMPLE_PRODUCT, stock: 1 }),
    });
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'prod-1', quantity: 5 });
    expect(res.status).toBe(409);
    expect(res.body.available).toBe(1);
  });

  test('POST /api/cart/items returns 503 if product-service down', async () => {
    global.fetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'prod-1', quantity: 1 });
    expect(res.status).toBe(503);
  });

  test('POST /api/cart/items validates payload', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 1 }); // missing productId
    expect(res.status).toBe(400);
  });

  test('POST /api/cart/items accumulates quantity for the same product', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => SAMPLE_PRODUCT,
    });
    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'prod-1', quantity: 1 });
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'prod-1', quantity: 3 });
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].quantity).toBe(4);
  });

  test('DELETE /api/cart/items/:productId removes the item', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => SAMPLE_PRODUCT,
    });
    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'prod-1', quantity: 1 });

    const del = await request(app)
      .delete('/api/cart/items/prod-1')
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);
    expect(del.body.items).toEqual([]);
  });
});
