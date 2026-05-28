# syntax=docker/dockerfile:1.7
# user-service Dockerfile — multi-stage build for a small, secure image.

# ---------- Stage 1: dependencies ----------
# Use the official Node 22 LTS Alpine image. Alpine = tiny base (~40 MB).
FROM node:22-alpine AS deps
WORKDIR /app

# Copy ONLY package files first so npm install is cached
# as long as deps don't change. Big speedup on rebuilds.
COPY package*.json ./

# `npm ci` is faster + stricter than `npm install` for CI/CD.
# --omit=dev skips Jest, Supertest, etc. — they don't belong in production.
RUN npm ci --omit=dev

# ---------- Stage 2: runtime ----------
FROM node:22-alpine

# Create a non-root user. Containers MUST NOT run as root in production
# (security best practice — limits the blast radius of a breakout).
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copy already-installed node_modules from the deps stage.
COPY --from=deps --chown=app:app /app/node_modules ./node_modules

# Copy only the runtime source (not tests, not docs, not .env files).
COPY --chown=app:app src ./src
COPY --chown=app:app package.json ./

USER app
ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

# K8s/Docker will hit this to check container health.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "src/index.js"]
