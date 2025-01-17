import React, { useState, useEffect } from 'react';
import NavBar from './nabvar';
import Footer from './footer';
import './cart.css';

const Cart = () => {
    const role = "user";
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Fetch cart data from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    // Calculate total price
    const total = savedCart.reduce((acc, item) => acc + parseFloat(item['Rent Price']), 0);
    setTotalPrice(total);
  }, []);

  const handleRemove = (itemName) => {
    const updatedCart = cart.filter((item) => item['Clothes Name'] !== itemName);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Recalculate total price
    const newTotal = updatedCart.reduce((acc, item) => acc + parseFloat(item['Rent Price']), 0);
    setTotalPrice(newTotal);
  };

  return (
    <div>
    <NavBar role={role} />
    <br />
      <br /> <br /> <br />
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={`/${item.Picture}`} alt={item['Clothes Name']} />
              <div className="cart-item-details">
                <h3>{item['Clothes Name']}</h3>
                <p>{item.Description}</p>
                <p><strong>Size:</strong> {item.Size}</p>
                <p><strong>Price:</strong> ${item['Rent Price']}</p>
              </div>
              <button
                className="cart-item-remove"
                onClick={() => handleRemove(item['Clothes Name'])}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-summary">
            <p>Total Quantity: {cart.length}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
    <Footer />
    </div>
  );
};

export default Cart;