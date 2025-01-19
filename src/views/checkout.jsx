import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import NavBar from './navbar';
import Footer from './footer';

const Checkout = () => {
  const role = "user";
  const location = useLocation();
  const { cart, totalPrice } = location.state || {}; 

  const [email, setEmail] = useState(""); 

  const handlePayment = () => {
  
    
    const headers = ["Email", "Clothes Code", "Clothes Name", "Size", "Price"];
    const rows = cart.map(item => [
      email,
      item["Clothes Code"],
      item["Clothes Name"],
      item["Size"],
      item["Rent Price"]
    ]);
  
    
    rows.push(["", "", "", "Total Price", totalPrice.toFixed(2)]);
  
    
    const csvContent =
      [headers, ...rows]
        .map(row => row.join(",")) 
        .join("\n"); 
  
   
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orderrecord.csv";
    link.click();
    URL.revokeObjectURL(url);
  
    alert("Order has been saved!");
  };
  
  return (
    <div>
      <NavBar role={role} />

      <br />
      <br />
      <br />
      <br />
      <h1>Checkout</h1>
      {cart && cart.length > 0 ? (
        <div>
          <h3>Items in your Cart:</h3>
          {cart.map((item, index) => (
            <div key={index}>
              <h4>{item["Clothes Name"]}</h4>
              <p><strong>Price:</strong> ${item["Rent Price"]}</p>
            </div>
          ))}
          <p><strong>Total Price: </strong>${totalPrice.toFixed(2)}</p>
          
         
          <button onClick={handlePayment} className="payment-btn">
            Save Order and Pay Now
          </button>
        </div>
      ) : (
        <p>No items in your cart.</p>
      )}

      <Footer />
    </div>
  );
};

export default Checkout;
