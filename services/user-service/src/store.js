// src/store.js — in-memory user store.
// Phase 1.1: simple Map. Phase 1.7: we'll replace this with PostgreSQL
// without changing any of the route code (clean separation of concerns).

const crypto = require('node:crypto');

const usersById = new Map();
const usersByEmail = new Map();

module.exports = {
  create({ email, name, passwordHash }) {
    const id = crypto.randomUUID();
    const user = {
      id,
      email: email.toLowerCase(),
      name,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    usersById.set(id, user);
    usersByEmail.set(user.email, id);
    return user;
  },

  findById(id) {
    return usersById.get(id) || null;
  },

  findByEmail(email) {
    const id = usersByEmail.get(email.toLowerCase());
    return id ? usersById.get(id) : null;
  },

  count() {
    return usersById.size;
  },

  clear() {
    usersById.clear();
    usersByEmail.clear();
  },
};
