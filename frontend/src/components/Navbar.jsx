import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, Home, LogIn, LogOut, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <Zap size={18} className="logo-icon" style={{ WebkitTextFillColor: 'initial', color: '#8b5cf6' }} />
          ShopDocker
        </Link>

        {/* Nav Links */}
        <div className="nav-links">
          <Link to="/" className={`nav-link${isActive('/') ? ' active' : ''}`}>
            <Home size={15} /> Home
          </Link>
          <Link to="/products" className={`nav-link${isActive('/products') ? ' active' : ''}`}>
            <Package size={15} /> Products
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/orders" className={`nav-link${isActive('/orders') ? ' active' : ''}`}>
                Orders
              </Link>
              <Link to="/cart" className={`nav-link cart-link${isActive('/cart') ? ' active' : ''}`}>
                <ShoppingCart size={15} />
                Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </>
          )}
        </div>

        {/* Auth */}
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">
                <User size={14} /> {user?.name}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={13} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn size={13} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
