import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import NavBar from "./nabvar";
import Footer from "./footer";
import './user-viewProduct.css';

const App = () => {
  const role = "user";
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch and parse the CSV file
    Papa.parse('/product.csv', {
      download: true,
      header: true,
      complete: (result) => {
        setProducts(result.data);
      },
    });
  }, []);

  const handleRentNow = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <NavBar role={role} />
      <br />
      <br /> <br /> <br />
      <div className="rental-container">
        {products.map((product, index) => (
          <div key={index} className="rental-card">
            <img
              src={`/${product.Picture}`}
              alt={product['Clothes Name']}
              className="rental-image"
            />
            <h3 className="rental-title">{product['Clothes Name']}</h3>
            <p className="rental-description">{product.Description}</p>
            <p className="rental-price">{product['Rent Price']}</p>
            <button className="rent-button" onClick={() => handleRentNow(product)}>
              Rent Now
            </button>
          </div>
        ))}
      </div>

      {/* Modal Section */}
      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
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
            <button className="add-to-cart-button">Add to Cart</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;
