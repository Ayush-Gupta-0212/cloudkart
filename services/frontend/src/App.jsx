import React, { useEffect, useState } from 'react';
import { api, setToken, getToken } from './api';

const fmt = (cents) => `$${(cents / 100).toFixed(2)}`;

// ─── Auth panel ────────────────────────────────────────────
function AuthPanel({ user, onLogin, onLogout }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return (
      <div className="auth">
        <span>Hi, <b>{user.name || user.email}</b></span>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'register') {
        await api.register({ email, password: pw, name });
      }
      const { token } = await api.login({ email, password: pw });
      setToken(token);
      const me = await api.me();
      onLogin(me);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <h3>{mode === 'login' ? 'Login' : 'Create account'}</h3>
      {mode === 'register' && (
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      )}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password (min 6)" value={pw} onChange={(e) => setPw(e.target.value)} required minLength={6} />
      <button type="submit">{mode === 'login' ? 'Sign in' : 'Register'}</button>
      <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? "New here? Register" : 'Have an account? Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

// ─── Product grid ──────────────────────────────────────────
function ProductsGrid({ products, onAdd, user }) {
  return (
    <section>
      <h2>Catalog ({products.length})</h2>
      <div className="grid">
        {products.map((p) => (
          <article className="card" key={p.id}>
            <h4>{p.name}</h4>
            <p className="muted">{p.category} · {p.stock} in stock</p>
            <p>{p.description}</p>
            <div className="price-row">
              <span className="price">{fmt(p.priceInCents)}</span>
              <button disabled={!user} onClick={() => onAdd(p.id)}>
                {user ? 'Add to cart' : 'Login to buy'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Cart ──────────────────────────────────────────────────
function Cart({ cart, onRemove, onPlaceOrder }) {
  if (!cart) return null;
  return (
    <section className="cart">
      <h2>🛒 Cart</h2>
      {cart.items.length === 0 ? (
        <p className="muted">Empty.</p>
      ) : (
        <>
          <ul>
            {cart.items.map((i) => (
              <li key={i.productId}>
                {i.quantity}× {i.name} — {fmt(i.priceInCentsAtAdd * i.quantity)}
                <button className="link" onClick={() => onRemove(i.productId)}>remove</button>
              </li>
            ))}
          </ul>
          <p className="total">Total: <b>{fmt(cart.total)}</b></p>
          <button onClick={onPlaceOrder}>Place order</button>
        </>
      )}
    </section>
  );
}

// ─── Orders list ───────────────────────────────────────────
function Orders({ orders }) {
  if (!orders || orders.length === 0) return null;
  return (
    <section className="orders">
      <h2>📦 Your Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            <code>{o.id.slice(0, 8)}</code> — {o.items.length} item(s) — {fmt(o.total)} —
            <span className="status">{o.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Root component ────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.products().then((r) => setProducts(r.items)).catch((e) => setError(e.message));
    if (getToken()) {
      api.me().then(setUser).catch(() => setToken(null));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setCart(null);
      setOrders([]);
      return;
    }
    refreshCartOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function refreshCartOrders() {
    try {
      const [c, o] = await Promise.all([api.cart(), api.orders()]);
      setCart(c);
      setOrders(o.items);
    } catch (e) { setError(e.message); }
  }

  async function handleAdd(productId) {
    try { setCart(await api.addToCart(productId, 1)); }
    catch (e) { setError(e.message); }
  }
  async function handleRemove(productId) {
    try { setCart(await api.removeFromCart(productId)); }
    catch (e) { setError(e.message); }
  }
  async function handlePlaceOrder() {
    try { await api.placeOrder(); await refreshCartOrders(); }
    catch (e) { setError(e.message); }
  }
  function handleLogout() {
    setToken(null);
    setUser(null);
  }

  return (
    <div className="app">
      <header>
        <h1>🛒 CloudKart</h1>
        <AuthPanel user={user} onLogin={setUser} onLogout={handleLogout} />
      </header>

      {error && (
        <div className="banner error">
          <span>{error}</span>
          <button className="link" onClick={() => setError('')}>✕</button>
        </div>
      )}

      <main>
        <ProductsGrid products={products} onAdd={handleAdd} user={user} />
        <aside>
          <Cart cart={cart} onRemove={handleRemove} onPlaceOrder={handlePlaceOrder} />
          <Orders orders={orders} />
        </aside>
      </main>

      <footer>
        <small>CloudKart — cloud-native microservices demo · React + Vite + Nginx</small>
      </footer>
    </div>
  );
}
