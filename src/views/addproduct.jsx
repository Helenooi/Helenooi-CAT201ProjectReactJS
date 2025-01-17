import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import NavBar from "./nabvar";
import Footer from "./footer";
import './user-viewProduct.css';

const App = () => {
  const role = "user";
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch and parse the CSV file
    Papa.parse('./public/product.csv', {
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
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Show success message
    setSuccessMessage(`${product['Clothes Name']} added to cart successfully!`);
    setTimeout(() => setSuccessMessage(''), 2000);
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
                  onClick={() => handleAddToCart(product)}
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

      <Footer />
    </div>
  );
};

export default App;