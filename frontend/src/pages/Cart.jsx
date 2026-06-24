import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Cart() {
  const { cartItems, cartTotal, clearCart, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate   = useNavigate();
  const [placing, setPlacing]  = useState(false);
  const [message, setMessage]  = useState('');
  const [error,   setError]    = useState('');

  if (!isAuthenticated) {
    return (
      <div className="empty-state" style={{ marginTop: '80px' }}>
        <div className="empty-state-icon">🔒</div>
        <h3>Please login to view your cart</h3>
        <p style={{ marginBottom: '24px' }}>You need to be signed in to add and manage cart items.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    try {
      setPlacing(true);
      setError('');
      await api.post('/orders', {
        items: cartItems.map((i) => ({
          productId: i.productId,
          quantity:  i.quantity,
          price:     i.price,
          name:      i.name,
        })),
      });
      setMessage('🎉 Order placed successfully!');
      await fetchCart();
      setTimeout(() => navigate('/orders'), 1800);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="page-header">
        <h1 className="page-title">Your Cart</h1>
        <p className="page-subtitle">
          {cartItems.length === 0 ? 'Empty' : `${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p style={{ marginBottom: '24px' }}>Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary">
            <ShoppingCart size={16} /> Shop Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
          {/* Items */}
          <div>
            {message && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '16px', color: '#22c55e', fontWeight: 600 }}>
                {message}
              </div>
            )}
            {error && <div className="form-error">{error}</div>}

            {cartItems.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}

            <button
              className="btn btn-outline btn-sm mt-16"
              onClick={clearCart}
              id="clear-cart-btn"
            >
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: '#22c55e' }}>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button
              id="place-order-btn"
              className="btn btn-primary w-full mt-24"
              onClick={handlePlaceOrder}
              disabled={placing}
              style={{ justifyContent: 'center' }}
            >
              {placing ? 'Placing Order…' : <><ArrowRight size={16} /> Place Order</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
