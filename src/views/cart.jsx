import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import NavBar from './nabvar';
import Footer from './footer';
import './cart.css';

const Cart = () => {
  const role = "user";
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showBilling, setShowBilling] = useState(false); // To toggle billing form visibility
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    cardNumber: "",
  });

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

  const handleCheckout = () => {
    setShowBilling(true); // Show the billing form
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = () => {
    if (!billingInfo.name || !billingInfo.email || !billingInfo.address || !billingInfo.phone || !billingInfo.cardNumber) {
      alert("Please fill in all billing details!");
      return;
    }

    const invoiceNumber = `INV-${new Date().getTime()}`;
    const headers = ["Invoice Number", "Clothes Code", "Clothes Name", "Size", "Price", "Name", "Email", "Address", "Phone", "Card Number"];
    const rows = cart.map((item) => [
      invoiceNumber,
      item["Clothes Code"],
      item["Clothes Name"],
      item["Size"],
      item["Rent Price"],
      billingInfo.name,
      billingInfo.email,
      billingInfo.address,
      billingInfo.phone,
      billingInfo.cardNumber,
    ]);

    rows.push(["", "", "", "Total Price", totalPrice.toFixed(2)]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orderrecord_${invoiceNumber}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    localStorage.removeItem('cart');
    setCart([]);
    setTotalPrice(0);
    setShowBilling(false); // Hide billing form

    alert("Order has been saved!");
  };

  return (
    <div>
      <NavBar role={role} />
      <br /> <br /> <br /> <br />
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

              {!showBilling && (
                <button className="btn2 hero__login right" onClick={handleCheckout}>
                  Check out
                </button>
              )}
            </div>
          </>
        )}
        {showBilling && (
          <div className="billing-form">
            <h2>Billing Information</h2>
            <div className="billing-fields">
              <label>
                Name:
                <input type="text" name="name" value={billingInfo.name} onChange={handleInputChange} />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={billingInfo.email} onChange={handleInputChange} />
              </label>
              <label>
                Address:
                <input type="text" name="address" value={billingInfo.address} onChange={handleInputChange} />
              </label>
              <label>
                Phone:
                <input type="tel" name="phone" value={billingInfo.phone} onChange={handleInputChange} />
              </label>
              <label>
                Card Number:
                <input type="text" name="cardNumber" value={billingInfo.cardNumber} onChange={handleInputChange} />
              </label>
            </div>
            <button className="btn2 hero__login right" onClick={handlePayment}>
              Submit Payment
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
