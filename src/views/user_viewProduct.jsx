import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import NavBar from "./nabvar";
import Footer from "./footer";
import './user-viewProduct.css';

const App = () => {
  const role = "user";
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch and parse the CSV file
    Papa.parse('/product.csv', {
      download: true,
      header: true,
      complete: (result) => {
        setProducts(result.data);
      },
    });

    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const handleAddToCart = (product) => {
    if (cart.some((item) => item['Clothes Name'] === product['Clothes Name'])) {
      setSuccessMessage(`Item "${product['Clothes Name']}" is already in the cart!`);
      setTimeout(() => setSuccessMessage(''), 2000);
      return;
    }

    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Show success message
    setSuccessMessage(`${product['Clothes Name']} added to cart successfully!`);
    setTimeout(() => setSuccessMessage(''), 2000);

    setSelectedProduct(null);
  };

  return (
    <div>
      <NavBar role={role} />
      <br /><br /><br /><br />
      <div className="rental-container">
        {/* Check if there are no products */}
        {products.length === 0 ? (
          <div className="no-products-box">
            <h3>No products available</h3>
          </div>
        ) : (
          // Display products if available
          products.map((product, index) => {
            const isAddedToCart = cart.some((item) => item['Clothes Name'] === product['Clothes Name']);
            return (
              <div key={index} className="rental-card">
                <img
                  src={`/${product.Picture}`}
                  alt={product['Clothes Name']}
                  className="rental-image"
                />
                <h3 className="rental-title">{product['Clothes Name']}</h3>
                <p className="rental-description">{product.Description}</p>
                <p className="rental-price">${product['Rent Price']}</p>
                <button
                  className="rent-button"
                  onClick={() => setSelectedProduct(product)}
                  disabled={isAddedToCart}
                >
                  {isAddedToCart ? "Added to Cart" : "Rent Now"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Success Message */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Modal Section */}
      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setSelectedProduct(null)}>
              &times;
            </span>
            <img
              src={`/${selectedProduct.Picture}`}
              alt={selectedProduct['Clothes Name']}
              className="modal-image"
            />
            <h3>{selectedProduct['Clothes Name']}</h3>
            <p>{selectedProduct.Description}</p>
            <p><strong>Size:</strong> {selectedProduct.Size}</p>
            <p><strong>Price:</strong> {selectedProduct['Rent Price']}</p>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(selectedProduct)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;
