import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import NavBar from './navbar';  
import Footer from './footer';
import './myorder.css';

const Orders = () => {
  const role = "user";
  const navigate = useNavigate(); 
  

  const [allOrders, setAllOrders] = useState(() => {
    const savedOrders = localStorage.getItem('allOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    
    const role = localStorage.getItem("role");
    if (!role || role !== "user") {
      navigate("/login"); 
    }
  }, [navigate]);

  const resetOrderHistory = () => {
    localStorage.removeItem('allOrders'); 
    setAllOrders([]); 
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

        {/* Display last 5 orders from localStorage */}
        {allOrders.slice(0, 5).map((order, index) => (
          <div key={index} className="order-details-box">
            <h2>{order.invoiceNumber}</h2>
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
              <p><strong>Total Price: RM</strong> {order.totalPrice.toFixed(2)} </p>
            </div>
          </div>
        ))}

        <div className="order-actions">
          <button onClick={() => navigate("/userpage")}>Back to Home</button>
          {/* Clear History Button */}
          <button onClick={resetOrderHistory}>Clear History</button>
        </div>
      </div>

      <br/>
      <br/>
      <br/>
      <Footer />
    </div>
  );
};

export default Orders;















