import React, { useState, useEffect } from 'react';
import NavBar from './nabvar';
import Footer from './footer';
import './checkout.css';

const Checkout = () => {
  const role = "user";
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    paymentType: '',
    startRentDate: '',
    endRentDate: '',
  });

  useEffect(() => {
    // Load cart data from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cart.length) {
      alert('Your cart is empty. Add items before proceeding.');
      return;
    }

    // Handle form submission logic here, such as sending data to a server
    console.log('Form Submitted:', formData, cart);

    // Clear cart and form after submission
    localStorage.removeItem('cart');
    setCart([]);
    setFormData({
      name: '',
      email: '',
      address: '',
      startRentDate: '',
      endRentDate: '',
    });

    alert('Order placed successfully!');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item['Rent Price']), 0);
  };

  return (
    <div>
    <NavBar role={role} />
    <br />
    <br /> <br /> <br />
    <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <form className="checkout-form" onSubmit={handleSubmit}>
        {cart.length === 0 ? (
            <p>Your cart is empty!</p>
        ) : (
            <>
            <h2>Items in Your Cart</h2>
            <table className="checkout-table">
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {cart.map((item, index) => (
                    <tr key={index}>
                    <td>
                        <img
                        src={`/${item.Picture}`}
                        alt={item['Clothes Name']}
                        className="checkout-item-image"
                        />
                    </td>
                    <td>{item['Clothes Name']}</td>
                    <td>{item.Size}</td>
                    <td>${item['Rent Price']}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="checkout-total">
                Total Price: ${calculateTotal().toFixed(2)}
            </div>
            </>
        )}

        <h2>Billing Information</h2>
        <div className="form-group">
            <label>Name</label>
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            />
        </div>
        <div className="form-group">
            <label>Email</label>
            <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            />
        </div>
        <div className="form-group">
            <label>Address</label>
            <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            />
        </div>
        <div className="form-group">
            <label>Payment Type</label>
            <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleInputChange}
            required
            >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
            </select>
        </div>
        <div className="form-group">
            <label>Start Rent Date</label>
            <input
            type="date"
            name="startRentDate"
            value={formData.startRentDate}
            onChange={handleInputChange}
            required
            />
        </div>
        <div className="form-group">
            <label>End Rent Date</label>
            <input
            type="date"
            name="endRentDate"
            value={formData.endRentDate}
            onChange={handleInputChange}
            required
            />
        </div>
        <button type="submit" className="submit-button">
            Place Order
        </button>
        </form>
    </div>
    <Footer />
    </div>

  );
};

export default Checkout;
