import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from './navbar';
import Footer from './footer';
import './myorder.css';

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use the navigate hook
  const { cart, totalPrice, invoiceNumber } = location.state || {};

  // State to store all orders (only the last 2 orders)
  const [allOrders, setAllOrders] = useState(() => {
    const savedOrders = localStorage.getItem('allOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Save the new order and keep only the last 2 orders in localStorage
  useEffect(() => {
    if (cart) {
      const newOrder = { cart, totalPrice, invoiceNumber, date: new Date().toISOString() };
      const updatedOrders = [newOrder, ...allOrders]; // Add new order to the beginning of the array
      if (updatedOrders.length > 2) {
        updatedOrders.pop(); // Keep only the last 2 orders
      }
      localStorage.setItem('allOrders', JSON.stringify(updatedOrders)); // Store updated orders
      setAllOrders(updatedOrders); // Update the state
    }
  }, [cart, totalPrice, invoiceNumber]);

  // Reset all order history (clear the localStorage)
  const resetOrderHistory = () => {
    localStorage.removeItem('allOrders'); // Clear all orders in localStorage
    setAllOrders([]); // Reset the state to empty array
  };

  if (!allOrders || allOrders.length === 0) {
    return <div>No orders found. Please try again later.</div>;
  }

  // Handle back to home based on user role
  const handleBackToHome = () => {
    const role = localStorage.getItem("role");
    if (role === "user") {
      navigate("/userpage"); // Go to the user page if logged in
    } else {
      navigate("/login"); // Redirect to login page if not logged in
    }
  };

  return (
    <div>
      <NavBar />
      <div className="order-confirmation-container">
        <h1><br /><br /></h1>
        <h1>Order History</h1>
        <p>Thank you for your purchases! Here is the list of your past orders.</p>

        {allOrders.map((order, index) => (
          <div key={index} className="order-details-box">
            <h1><br /><br /></h1>
            <h2>Order {index + 1}</h2>
            <p><strong>Invoice Number:</strong> {order.invoiceNumber}</p>
            <p><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}</p>

            <div className="order-details">
              <table>
                <thead>
                  <tr>
                    <th>Clothes Code</th>
                    <th>Clothes Name</th>
                    <th>Size</th>
                    <th>Price (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cart.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td>{item['Clothes Code']}</td>
                      <td>{item['Clothes Name']}</td>
                      <td>{item['Size']}</td>
                      <td>{item['Rent Price']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-summary">
              <p><strong>Total Price:</strong> {order.totalPrice.toFixed(2)} RM</p>
            </div>
          </div>
        ))}

        <div className="order-actions">
          <button onClick={handleBackToHome}>Back to Home</button> 
          
          <button onClick={resetOrderHistory}>Clear History</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;






