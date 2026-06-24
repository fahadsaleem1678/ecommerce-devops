import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Colour gradient per product category feel
const gradients = [
  { bg: 'linear-gradient(135deg, #667eea, #764ba2)', emoji: '🎧' },
  { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', emoji: '⌨️' },
  { bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', emoji: '🖱️' },
  { bg: 'linear-gradient(135deg, #43e97b, #38f9d7)', emoji: '🖥️' },
  { bg: 'linear-gradient(135deg, #fa709a, #fee140)', emoji: '🔌' },
  { bg: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', emoji: '📷' },
  { bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)', emoji: '💾' },
  { bg: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', emoji: '🔊' },
  { bg: 'linear-gradient(135deg, #d4fc79, #96e6a1)', emoji: '💻' },
  { bg: 'linear-gradient(135deg, #f6d365, #fda085)', emoji: '🔋' },
];

export default function ProductCard({ product }) {
  const { addToCart }     = useCart();
  const { isAuthenticated } = useAuth();
  const navigate            = useNavigate();

  const style = gradients[(product.id - 1) % gradients.length];

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    await addToCart(product);
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      {/* Visual */}
      <div className="product-image-wrap">
        <div className="product-gradient" style={{ background: style.bg }}>
          {style.emoji}
        </div>
        <div className="product-overlay">
          <button className="btn btn-primary" onClick={handleAddToCart}>
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
          <span className="product-stock">{product.stock} left</span>
        </div>
      </div>
    </div>
  );
}
