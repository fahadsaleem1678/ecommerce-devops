const express = require('express');
const pool    = require('../db');
const router  = express.Router();

// ── GET /api/products ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let query  = 'SELECT * FROM products';
    let params = [];

    if (search) {
      query  += ' WHERE name ILIKE $1 OR description ILIKE $1';
      params  = [`%${search}%`];
    }

    query += ' ORDER BY id';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('[products/list]', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ── GET /api/products/:id ─────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('[products/get]', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
