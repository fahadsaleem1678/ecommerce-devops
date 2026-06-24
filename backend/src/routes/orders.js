const express      = require('express');
const pool         = require('../db');
const redis        = require('../redis');
const { authenticate } = require('../middleware/auth');
const router       = express.Router();

// ── GET /api/orders ───────────────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         o.id, o.total, o.status, o.created_at,
         json_agg(
           json_build_object(
             'product_id', oi.product_id,
             'quantity',   oi.quantity,
             'price',      oi.price
           )
         ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('[orders/list]', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ── POST /api/orders ──────────────────────────────────────────
router.post('/', authenticate, async (req, res) => {
  const { items } = req.body; // [{ productId, quantity, price, name }]

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, total.toFixed(2), 'pending']
    );
    const order = orderResult.rows[0];

    // Insert order items and decrement stock
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.productId, item.quantity, item.price]
      );

      const stockResult = await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING stock',
        [item.quantity, item.productId]
      );

      if (stockResult.rowCount === 0) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    await client.query('COMMIT');

    // Clear user's Redis cart after successful order
    await redis.del(`cart:${req.user.userId}`);

    res.status(201).json({ ...order, items });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[orders/place]', err);
    res.status(400).json({ error: err.message || 'Failed to place order' });
  } finally {
    client.release();
  }
});

module.exports = router;
