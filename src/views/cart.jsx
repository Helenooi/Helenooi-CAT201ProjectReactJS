import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from './navbar';
import Footer from './footer';
import './cart.css';

const Cart = () => {
  const role = "user";
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role || role !== "user") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    const total = savedCart.reduce((acc, item) => acc + parseFloat(item['Rent Price']), 0);
    setTotalPrice(total);
  }, []);

  const handleRemove = (itemName) => {
    const updatedCart = cart.filter((item) => item['Clothes Name'] !== itemName);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    const newTotal = updatedCart.reduce((acc, item) => acc + parseFloat(item['Rent Price']), 0);
    setTotalPrice(newTotal);
  };

  const generateOrderCode = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; 
    return `ORD-${randomNumber}`;
  };

  const handlePayment = () => {
    const invoiceNumber = generateOrderCode(); 
    const orderDate = new Date().toISOString(); 

    const orderDetails = { cart, totalPrice, invoiceNumber, date: orderDate };
    
    const allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];

   
    allOrders.unshift(orderDetails);

    if (allOrders.length > 5) {
      allOrders.pop();  
    }

    localStorage.setItem('allOrders', JSON.stringify(allOrders));

    navigate('/orders', { state: orderDetails });

  
    localStorage.removeItem('cart');
    setCart([]);
    setTotalPrice(0);

    alert("Order has been saved!");
  };

  return (
    <div>
      <NavBar role={role} />
      <br/><br/><br/><br/>
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
                  <p><strong>Code:</strong> {item['Clothes Code']}</p>
                  <p>{item.Description}</p>
                  <p><strong>Size:</strong> {item.Size}</p>
                  <p><strong>Price (RM):</strong> {item['Rent Price']}</p>
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
              <p>Total Price: RM {totalPrice.toFixed(2)} </p>
              <button className="btn2 hero__login right" type="submit" onClick={handlePayment}>
                Check out
              </button>
            </div>
          </>
        )}
      </div>

      
      <br/>
      <br/>
      <br/>
      <Footer />
    </div>
  );
};

export default Cart;





