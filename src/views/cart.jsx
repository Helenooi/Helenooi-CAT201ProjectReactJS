import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import NavBar from './navbar';
import Footer from './footer';
import './cart.css';

const Cart = () => {
  const role = "user";
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); // Declare navigate

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

  /*const handleCheckout = () => {
    navigate('/checkout', { state: { cart, totalPrice } });
  };
  */
  const handlePayment = () => {
    // Generate the invoice number (you can customize this format)
    const invoiceNumber = `INV-${new Date().getTime()}`;
    
    // Add the invoice number as a header or separate row
    const headers = ["Invoice Number", "Clothes Code", "Clothes Name", "Size", "Price"];
    const rows = cart.map(item => [
      invoiceNumber,  // Add the invoice number to each row
      item["Clothes Code"],
      item["Clothes Name"],
      item["Size"],
      item["Rent Price"]
    ]);
    
    // Add the total price as a final row
    rows.push(["", "", "", "Total Price", totalPrice.toFixed(2)]);
    
    // Prepare the CSV content
    const csvContent =
      [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");
  
    // Create CSV file with the generated invoice number
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
  
    // Save the file with the invoice number in the filename
    link.href = url;
    link.download = `orderrecord_${invoiceNumber}.csv`; // Filename includes invoice number
    link.click();
  
    URL.revokeObjectURL(url);
  
    // Clear the cart and total price
    localStorage.removeItem('cart');
    setCart([]); 
    setTotalPrice(0); 
  
    alert("Order has been saved!");
  };
  
  
  

  return (
    <div>
      <NavBar role={role} />

      <br/>   <br/>   <br/>   <br/>
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

              <button className="btn2 hero__login right" type="submit" onClick={handlePayment}>
                Check out
              </button>
        
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
