// tests/orders.test.js

const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret-32-chars-long-enough-yes';
process.env.PRODUCT_SERVICE_URL = 'http://product-service.test';

const { createApp } = require('../src/app');
const store = require('../src/store');

function makeToken(sub) {
  return jwt.sign({ sub, email: `${sub}@x.com` }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

async function addToCart(app, token, productId, quantity, productOverrides = {}) {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({
      id: productId,
      name: 'Sample',
      priceInCents: 1000,
      stock: 100,
      ...productOverrides,
    }),
  });
  return request(app)
    .post('/api/cart/items')
    .set('Authorization', `Bearer ${token}`)
    .send({ productId, quantity });
}

describe('orders', () => {
  let app;

  beforeEach(() => {
    store.clear();
    global.fetch = jest.fn();
    app = createApp();
  });

  test('POST /api/orders fails on empty cart', async () => {
    const token = makeToken('u-1');
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('cart_empty');
  });

  test('POST /api/orders creates an order and clears the cart', async () => {
    const token = makeToken('u-1');
    await addToCart(app, token, 'p-1', 2, { priceInCents: 500 });

    const placed = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(placed.status).toBe(201);
    expect(placed.body.status).toBe('placed');
    expect(placed.body.total).toBe(1000);
    expect(placed.body.items).toHaveLength(1);
    expect(placed.body.id).toMatch(/^[0-9a-f-]{36}$/i);

    // cart should now be empty
    const cart = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(cart.body.items).toEqual([]);
  });

  test('GET /api/orders returns this user’s orders', async () => {
    const tokenA = makeToken('u-A');
    const tokenB = makeToken('u-B');

    await addToCart(app, tokenA, 'p-1', 1);
    await request(app).post('/api/orders').set('Authorization', `Bearer ${tokenA}`);

    await addToCart(app, tokenB, 'p-2', 1);
    await request(app).post('/api/orders').set('Authorization', `Bearer ${tokenB}`);

    const aOrders = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(aOrders.body.items).toHaveLength(1);
  });

  test('GET /api/orders/:id returns 404 for another user’s order', async () => {
    const tokenA = makeToken('u-A');
    const tokenB = makeToken('u-B');
    await addToCart(app, tokenA, 'p-1', 1);
    const placed = await request(app).post('/api/orders').set('Authorization', `Bearer ${tokenA}`);

    const res = await request(app)
      .get(`/api/orders/${placed.body.id}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(404);
  });

  test('GET /api/orders/:id returns the order for the owner', async () => {
    const tokenA = makeToken('u-A');
    await addToCart(app, tokenA, 'p-1', 1);
    const placed = await request(app).post('/api/orders').set('Authorization', `Bearer ${tokenA}`);

    const res = await request(app)
      .get(`/api/orders/${placed.body.id}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(placed.body.id);
  });
});
