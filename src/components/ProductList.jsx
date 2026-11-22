import React from 'react';

const PRODUCTS = [
  {
    id: 'tshirt',
    name: 'Cotton T-Shirt',
    price: 499,
    description: '100% premium soft cotton regular fit',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80',
  },
  {
    id: 'shoes',
    name: 'Running Shoes',
    price: 1999,
    description: 'Lightweight breathable sports footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  },
];

export default function ProductList({ onAddToCart }) {
  return (
    <div className="card product-list">
      <div className="card-header">
        <h2>Products</h2>
      </div>
      <div className="product-grid">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-img-wrap">
              <img src={product.image} alt={product.name} className="product-img" />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="product-action-row">
                <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                <button
                  type="button"
                  className="btn btn-add"
                  data-testid={`add-${product.id}`}
                  onClick={() => onAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
