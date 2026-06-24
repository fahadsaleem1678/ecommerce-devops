const express = require('express');
const pool    = require('../db');
const redis   = require('../redis');
const router  = express.Router();

/**
 * GET /api/health
 * Returns liveness status of backend + downstream services.
 * Used by Docker HEALTHCHECK and load balancers.
 */
router.get('/', async (req, res) => {
  const health = {
    status:    'ok',
    timestamp: new Date().toISOString(),
    uptime:    process.uptime(),
    services:  {},
  };

  // PostgreSQL check
  try {
    await pool.query('SELECT 1');
    health.services.postgres = 'ok';
  } catch (err) {
    health.services.postgres = 'error';
    health.status = 'degraded';
  }

  // Redis check
  try {
    const pong = await redis.ping();
    health.services.redis = pong === 'PONG' ? 'ok' : 'error';
  } catch (err) {
    health.services.redis = 'error';
    health.status = 'degraded';
  }

  const httpStatus = health.status === 'ok' ? 200 : 503;
  res.status(httpStatus).json(health);
});

module.exports = router;
