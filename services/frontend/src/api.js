// src/api.js — thin fetch wrapper that:
//   - sends every request same-origin (Nginx / Vite proxy routes /api/* to backends)
//   - persists the JWT in localStorage so it survives page reloads
//   - centralises error handling

let _token = localStorage.getItem('cloudkart_token') || null;

export function setToken(t) {
  _token = t;
  if (t) localStorage.setItem('cloudkart_token', t);
  else localStorage.removeItem('cloudkart_token');
}
export function getToken() { return _token; }

async function call(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (_token) headers.Authorization = `Bearer ${_token}`;
  const res = await fetch(path, { ...options, headers });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export const api = {
  register: (data) => call('/api/users/register', { method: 'POST', body: JSON.stringify(data) }),
  login:    (data) => call('/api/users/login',    { method: 'POST', body: JSON.stringify(data) }),
  me:       ()     => call('/api/users/me'),
  products: (cat)  => call(`/api/products${cat ? `?category=${cat}` : ''}`),
  cart:     ()     => call('/api/cart'),
  addToCart:(productId, quantity = 1) =>
    call('/api/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  removeFromCart: (productId) =>
    call(`/api/cart/items/${productId}`, { method: 'DELETE' }),
  placeOrder: () => call('/api/orders', { method: 'POST' }),
  orders:     () => call('/api/orders'),
};
