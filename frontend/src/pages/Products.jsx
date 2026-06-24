import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api         from '../api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [error,    setError]    = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`);
        setProducts(data);
      } catch {
        setError('Failed to load products. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="page-header">
        <h1 className="page-title">Our Products</h1>
        <p className="page-subtitle">
          {products.length} item{products.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} />
        <input
          id="product-search"
          className="search-input"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* States */}
      {loading && <div className="spinner" />}

      {error && (
        <div className="form-error" style={{ marginTop: 0 }}>{error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No products found</h3>
          <p>Try a different search term.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
