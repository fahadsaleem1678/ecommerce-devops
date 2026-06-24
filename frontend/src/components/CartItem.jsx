import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const emojis = ['🎧','⌨️','🖱️','🖥️','🔌','📷','💾','🔊','💻','🔋'];

export default function CartItem({ item }) {
  const { removeFromCart } = useCart();
  const emoji = emojis[(item.productId - 1) % emojis.length];

  return (
    <div className="cart-item" id={`cart-item-${item.productId}`}>
      <div className="cart-item-icon" style={{ background: 'var(--bg-secondary)', fontSize: '1.75rem' }}>
        {emoji}
      </div>

      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">
          ${(item.price * item.quantity).toFixed(2)}
          <span style={{ color: 'var(--text-subtle)', fontWeight: 400, fontSize: '0.8rem' }}>
            {' '}× {item.quantity}
          </span>
        </div>
      </div>

      <div className="cart-item-actions">
        <button
          className="btn btn-danger btn-sm"
          onClick={() => removeFromCart(item.productId)}
          title="Remove item"
          id={`remove-item-${item.productId}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
