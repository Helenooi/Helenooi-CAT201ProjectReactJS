import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import NavBar from './navbar';  // Ensure NavBar is included
import Footer from './footer';
import './myorder.css';

const Orders = () => {
  const role = "user";
  const navigate = useNavigate(); // Use the navigate hook
  
  // State to store all orders (only the last 5 orders)
  const [allOrders, setAllOrders] = useState(() => {
    const savedOrders = localStorage.getItem('allOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    // Check if the user is logged in; redirect if not
    const role = localStorage.getItem("role");
    if (!role || role !== "user") {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, [navigate]);

  // Generate a random order code
  const generateOrderCode = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // Random number between 1000 and 9999
    return `ORD-${randomNumber}`;
  };

  // Handle clear order history (clear the localStorage)
  const resetOrderHistory = () => {
    localStorage.removeItem('allOrders'); // Clear all orders in localStorage
    setAllOrders([]); // Reset the state to an empty array
  };

  if (!allOrders || allOrders.length === 0) {
    return (
      <div>
        <NavBar role={role} />
        <br /><br /><br /><br />
        <div className="order-confirmation-container">
          <h1>No orders found. Please try again later.</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      {/* Include the NavBar */}
      <NavBar role={role} />
      <br /><br /><br /><br />
      
      <div className="order-confirmation-container">
        <h1>Order History</h1>
        <p>Thank you for your purchases! Here is the list of your past orders.</p>
        {allOrders.map((order, index) => (
          <div key={index} className="order-details-box">
            {/* Use generateOrderCode() to create a unique code for each order */}
            <h2>{generateOrderCode()}</h2> 
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
              <p><strong>Total Price:</strong> RM {order.totalPrice.toFixed(2)} </p>
              <br /><br /><br /><br />
            </div>
          </div>
        ))}

        <div className="order-actions">
          <button onClick={() => navigate("/userpage")}>Back to Home</button>
          <button onClick={resetOrderHistory}>Clear History</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Orders;






