import React from 'react';

export default function Confirmation({ orderRef, name, total, cart, onContinueShopping }) {
  return (
    <div className="card confirmation-box" data-testid="confirmation">
      <div className="success-icon">✓</div>
      <h2>Order Confirmed!</h2>
      <p className="order-ref-badge" data-testid="order-ref">
        Order ID: #{orderRef}
      </p>
      <p className="confirm-msg">
        Thank you, <strong>{name}</strong>! Your order has been placed successfully.
      </p>

      <div className="order-summary-card">
        <h4>Order Summary</h4>
        {cart.map((item) => (
          <div key={item.id} className="summary-row">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
          </div>
        ))}
        <div className="summary-total-row">
          <strong>Total Paid</strong>
          <strong>₹{total.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-add"
        style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
        data-testid="continue-shopping-btn"
        onClick={onContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  );
}
