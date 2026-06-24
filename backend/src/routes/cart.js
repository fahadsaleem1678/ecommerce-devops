const express      = require('express');
const redis        = require('../redis');
const { authenticate } = require('../middleware/auth');
const router       = express.Router();

const cartKey = (userId) => `cart:${userId}`;
const CART_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

// ── GET /api/cart ─────────────────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const raw  = await redis.hgetall(cartKey(req.user.userId));
    const items = Object.entries(raw || {}).map(([productId, data]) => ({
      productId: parseInt(productId),
      ...JSON.parse(data),
    }));
    res.json(items);
  } catch (err) {
    console.error('[cart/get]', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// ── POST /api/cart ────────────────────────────────────────────
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, quantity = 1, name, price } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const key = cartKey(req.user.userId);

    // Merge with existing quantity if product already in cart
    const existing = await redis.hget(key, productId.toString());
    const existingQty = existing ? JSON.parse(existing).quantity : 0;

    await redis.hset(
      key,
      productId.toString(),
      JSON.stringify({ quantity: existingQty + quantity, name, price })
    );
    await redis.expire(key, CART_TTL);

    res.json({ message: 'Cart updated' });
  } catch (err) {
    console.error('[cart/add]', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// ── DELETE /api/cart/:productId ───────────────────────────────
router.delete('/:productId', authenticate, async (req, res) => {
  try {
    await redis.hdel(cartKey(req.user.userId), req.params.productId);
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error('[cart/remove]', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// ── DELETE /api/cart ──────────────────────────────────────────
router.delete('/', authenticate, async (req, res) => {
  try {
    await redis.del(cartKey(req.user.userId));
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('[cart/clear]', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
