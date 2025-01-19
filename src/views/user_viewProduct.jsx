import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import NavBar from "./navbar";
import Footer from "./footer";
import './user-viewProduct.css';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const role = "user";
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role || role !== "user") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    Papa.parse('public/product.csv', {
      download: true,
      header: true,
      complete: (result) => {
        setProducts(result.data);
      },
    });

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

    setSuccessMessage(`${product['Clothes Name']} added to cart successfully!`);
    setTimeout(() => setSuccessMessage(''), 2000);

    setSelectedProduct(null);
  };

  return (
    <div>
      <NavBar role={role} />
      <br /><br /><br /><br />
      <div className="rental-container">
        {products.length === 0 ? (
          <div className="no-products-box">
            <h3>No products available</h3>
          </div>
        ) : (
          products.map((product, index) => {
            const isAddedToCart = cart.some((item) => item['Clothes Name'] === product['Clothes Name']);
            return (
              <div className="rental-card">
              <img
                src={`/${product.Picture}`}
                alt={product['Clothes Name']}
                className="rental-image"
              />
              <h3 className="rental-title">{product['Clothes Name']}</h3>
              {/*<p className="rental-code"><strong>Code:</strong> {product['Clothes Code']}</p> */}
              <p className="rental-description">{product.Description}</p>
              <p className="rental-price">RM {product['Rent Price']}</p>
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

      {successMessage && <div className="success-message">{successMessage}</div>}

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
            <p><strong>Price (RM):</strong> {selectedProduct['Rent Price']}</p>
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
