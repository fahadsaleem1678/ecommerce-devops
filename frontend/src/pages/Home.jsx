import { Link } from 'react-router-dom';
import { ShoppingBag, Zap, Shield, Box } from 'lucide-react';

const features = [
  {
    icon: <Box size={22} />,
    title: 'Containerised',
    desc:  'Every service runs in its own Docker container — fully isolated and reproducible.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Redis Cache',
    desc:  'Cart sessions are stored in Redis for blazing-fast reads across containers.',
  },
  {
    icon: <Shield size={22} />,
    title: 'Secure by Default',
    desc:  'JWT auth, non-root containers, and no secrets baked into images.',
  },
  {
    icon: <ShoppingBag size={22} />,
    title: 'Full-Stack',
    desc:  'React frontend · Node.js API · PostgreSQL database — all in one Compose file.',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Box size={14} /> Powered by Docker Compose
          </div>

          <h1 className="hero-title">
            Shop smarter with <br />
            <span className="gradient-text">ShopDocker</span>
          </h1>

          <p className="hero-subtitle">
            A production-style multi-container e-commerce platform built to demonstrate real-world Docker workflows.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              <ShoppingBag size={18} /> Browse Products
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Get Started
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">5</div>
              <div className="stat-label">Containers</div>
            </div>
            <div className="stat">
              <div className="stat-value">10+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat">
              <div className="stat-value">JWT</div>
              <div className="stat-label">Auth</div>
            </div>
            <div className="stat">
              <div className="stat-value">CI/CD</div>
              <div className="stat-label">Pipeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Built with real DevOps principles
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '48px' }}>
            Every component of this project teaches a core Docker concept.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--purple-light)',
                  marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>
          Ready to explore?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
          Create an account and start shopping — your cart lives in Redis.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          View All Products
        </Link>
      </section>
    </div>
  );
}
