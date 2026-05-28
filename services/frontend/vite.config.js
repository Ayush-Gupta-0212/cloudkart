// vite.config.js — dev server config. In production we serve the built
// `dist/` from Nginx (see nginx.conf). The proxy below is only for `npm run dev`.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/users':    'http://localhost:3001',
      '/api/products': 'http://localhost:3002',
      '/api/cart':     'http://localhost:3003',
      '/api/orders':   'http://localhost:3003',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
