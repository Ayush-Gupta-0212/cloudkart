// src/logger.js — structured JSON logger.
// In production, logs to stdout as JSON — perfect for Loki/ELK.

const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { service: 'user-service' },
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
