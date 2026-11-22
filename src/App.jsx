import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Confirmation from './components/Confirmation';
import './styles/App.css';

export default function App() {
  const [cart, setCart] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(99, item.quantity + 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setError('');
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(1, Math.min(99, item.quantity + delta));
        return { ...item, quantity: newQty };
      })
    );
  };

  const setQty = (id, newQty) => {
    const qty = Math.max(1, Math.min(99, Number.isFinite(newQty) ? newQty : 1));
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (isProcessing) return;

    if (cart.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setIsProcessing(true);
    setError('');

    setTimeout(() => {
      const ref = `ORD-${Date.now().toString().slice(-6)}`;
      setOrderRef(ref);
      setOrderPlaced(true);
      setIsProcessing(false);
    }, 600);
  };

  const resetOrder = () => {
    setCart([]);
    setName('');
    setError('');
    setOrderPlaced(false);
    setOrderRef('');
    setIsProcessing(false);
  };

  return (
    <div className="page-wrapper">
      <div className="checkout-card">
        {/* Unified Top Header Bar */}
        <header className="checkout-topbar">
          <div className="topbar-title-group">
            <h1>Checkout Page</h1>
            <span className="topbar-tag">Instant Order</span>
          </div>
          <span className="step-badge">Safe & Secure</span>
        </header>

        {/* Content Body */}
        {orderPlaced ? (
          <div className="checkout-card-body">
            <Confirmation
              orderRef={orderRef}
              name={name}
              total={total}
              cart={cart}
              onContinueShopping={resetOrder}
            />
          </div>
        ) : (
          <div className="checkout-card-body checkout-columns">
            <div className="col-products">
              <ProductList onAddToCart={addToCart} />
            </div>
            <div className="col-divider"></div>
            <div className="col-cart">
              <Cart
                cart={cart}
                onUpdateQty={updateQty}
                onSetQty={setQty}
                onRemove={removeFromCart}
                name={name}
                onNameChange={setName}
                error={error}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
                total={total}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
