import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="empty-state" style={{ marginTop: '80px' }}>
        <div className="empty-state-icon">🔒</div>
        <h3>Please login to view your orders</h3>
        <p style={{ marginBottom: '24px' }}>Sign in to see your order history.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="page-header">
        <h1 className="page-title">Your Orders</h1>
        <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No orders yet</h3>
          <p style={{ marginBottom: '24px' }}>Browse our products and place your first order!</p>
          <Link to="/products" className="btn btn-primary">
            <ShoppingBag size={16} /> Shop Now
          </Link>
        </div>
      ) : (
        <div id="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card" id={`order-${order.id}`}>
              <div className="order-header">
                <div>
                  <div className="order-id">Order #{order.id}</div>
                  <div className="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </div>
                </div>
                <span className={`order-status status-${order.status}`}>{order.status}</span>
              </div>

              {/* Items list */}
              {Array.isArray(order.items) && order.items[0] !== null && (
                <div style={{ marginBottom: '16px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '4px 0' }}>
                      <span>Product #{item.product_id} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Order Total</span>
                <span className="order-total">${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
