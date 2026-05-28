# syntax=docker/dockerfile:1.7
# Frontend Dockerfile — multi-stage:
#   1) Build the React app with Vite (node alpine)
#   2) Ship only the static dist/ in an Nginx alpine image (~30 MB!)

# ---------- Stage 1: build ----------
FROM node:22-alpine AS builder
WORKDIR /app

# install deps (cached layer)
COPY package*.json ./
RUN npm ci

# build the app
COPY index.html vite.config.js ./
COPY src ./src
RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine

# replace default nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# copy built React assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
