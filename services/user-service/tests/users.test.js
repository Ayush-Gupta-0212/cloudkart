// tests/users.test.js — integration tests via supertest.
// No external network, no real port — supertest drives the express app directly.

const request = require('supertest');
const { createApp } = require('../src/app');
const store = require('../src/store');

describe('user-service', () => {
  let app;

  beforeEach(() => {
    store.clear();
    app = createApp();
  });

  // -------- ops endpoints --------
  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /metrics returns prometheus text', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('# HELP');
    expect(res.text).toContain('http_requests_total');
  });

  // -------- registration --------
  test('POST /api/users/register creates a user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'a@b.com', password: 'secret123', name: 'Ayush' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: 'a@b.com', name: 'Ayush' });
    expect(res.body.id).toBeDefined();
    expect(res.body.passwordHash).toBeUndefined(); // never leak the hash
  });

  test('POST /api/users/register validates input', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'a@b.com' }); // missing password + name
    expect(res.status).toBe(400);
  });

  test('POST /api/users/register rejects duplicate email', async () => {
    const body = { email: 'a@b.com', password: 'secret123', name: 'A' };
    await request(app).post('/api/users/register').send(body);
    const res = await request(app).post('/api/users/register').send(body);
    expect(res.status).toBe(409);
  });

  // -------- login --------
  test('POST /api/users/login returns JWT on valid credentials', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ email: 'a@b.com', password: 'secret123', name: 'A' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'a@b.com', password: 'secret123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/); // jwt shape
  });

  test('POST /api/users/login rejects wrong password', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ email: 'a@b.com', password: 'secret123', name: 'A' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'a@b.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  // -------- me --------
  test('GET /api/users/me returns user with a valid token', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ email: 'a@b.com', password: 'secret123', name: 'Ayush' });
    const login = await request(app)
      .post('/api/users/login')
      .send({ email: 'a@b.com', password: 'secret123' });
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('a@b.com');
  });

  test('GET /api/users/me rejects missing token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/users/me rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer not-a-real-jwt');
    expect(res.status).toBe(401);
  });
});
