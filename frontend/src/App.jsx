import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar   from './components/Navbar';
import Home     from './pages/Home';
import Products from './pages/Products';
import Cart     from './pages/Cart';
import Login    from './pages/Login';
import Orders   from './pages/Orders';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart"     element={<Cart />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/orders"   element={<Orders />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
