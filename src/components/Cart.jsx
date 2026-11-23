import React from 'react';

export default function Cart({
  cart,
  onUpdateQty,
  onSetQty,
  onRemove,
  name,
  onNameChange,
  error,
  onPlaceOrder,
  isProcessing,
  total,
}) {
  return (
    <div className="card cart-container">
      <div className="card-header">
        <h2>Your Cart</h2>
        <span className="badge">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} items
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-box" data-testid="empty-cart-message">
          <p className="empty-title">Your cart is currently empty</p>
          <p className="empty-subtitle">Select items from the products list to proceed.</p>
        </div>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-row" data-testid={`cart-item-${item.id}`}>
              <img src={item.image} alt={item.name} className="cart-thumb" />
              <div className="item-details">
                <span className="item-title">{item.name}</span>
                <span className="item-price">₹{item.price.toLocaleString('en-IN')}</span>
              </div>

              <div className="qty-controls">
                <button
                  type="button"
                  className="btn-qty"
                  data-testid={`qty-decrease-${item.id}`}
                  onClick={() => onUpdateQty(item.id, -1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  className="qty-input"
                  data-testid={`qty-input-${item.id}`}
                  value={item.quantity}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 1 : parseInt(e.target.value, 10);
                    onSetQty(item.id, val);
                  }}
                />
                <button
                  type="button"
                  className="btn-qty"
                  data-testid={`qty-increase-${item.id}`}
                  onClick={() => onUpdateQty(item.id, 1)}
                  disabled={item.quantity >= 99}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="line-total" data-testid={`line-total-${item.id}`}>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </div>

              <button
                type="button"
                className="btn-remove"
                data-testid={`remove-${item.id}`}
                onClick={() => onRemove(item.id)}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="cart-total-row">
            <span>Total Amount</span>
            <span className="total-amount" data-testid="order-total">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="customer-name">
          Customer Name <span className="req">*</span>
        </label>
        <input
          id="customer-name"
          type="text"
          data-testid="name-input"
          placeholder="e.g. Yash Sharma"
          value={name}
          onChange={(e) => {
            const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
            onNameChange(lettersOnly);
          }}
        />
      </div>

      {error && (
        <div className="error-alert" data-testid="error-message">
          {error}
        </div>
      )}

      <button
        type="button"
        className={`btn btn-checkout ${isProcessing ? 'btn-loading' : ''}`}
        data-testid="place-order-btn"
        onClick={onPlaceOrder}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="spinner-text">
            <span className="spinner"></span> Processing...
          </span>
        ) : (
          'Place Order'
        )}
      </button>
    </div>
  );
}
