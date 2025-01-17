import React, { useState } from 'react';
import NavBar from './nabvar';
import Footer from './footer';
import './utils.css';
import './adminForm.css';
import './modern-normalize.css';
import './addproduct.css';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
  //  clothescode: '',  // Added clothescode state
    clothesname: '',
    size: '',
    rentprice: '',  // Changed to rentprice
    picture: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, picture: file ? file.name : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct data string to include rentprice as the field
    const dataString = `${formData.clothesname},${formData.size},${formData.rentprice},${formData.picture},${formData.description}`;

    try {
        const response = await fetch('http://localhost:8080/add-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: dataString,
        });

        if (!response.ok) {
            console.error('Server error:', response.statusText);
            alert('Failed to add product');
            return;
        }

        alert('Product added successfully!');
        setFormData({
          //  clothescode: '',
            clothesname: '',
            size: '',
            rentprice: '',  // Reset rentprice
            picture: '',
            description: '',
        });
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred');
    }
};

  return (
    <div>
      <NavBar role="admin" />
      <br />
      <br /> <br /> <br />
      <main>
        <section className="hero container">
          <h1 className="hero__title">Add New Product</h1>
          <p className="hero__description">Complete the form below to add a new product</p>
        </section>
        <section className="hero container">
          <form className="hero__form" id="addProductForm" onSubmit={handleSubmit}>
            <p className="hero__msg" id="message"></p>
          
            
            <p className="hero__subtitle">Clothes name:</p>
            <input
              className="hero__input"
              type="text"
              name="clothesname"
              value={formData.clothesname}
              onChange={handleChange}
              placeholder="Enter clothes name"
              required
            />
            
            <p className="hero__subtitle">Size:</p>
            <input
              className="hero__input"
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Enter the size"
              required
            />
            
            <p className="hero__subtitle">Rent Price:</p>
            <input
              className="hero__input"
              type="number"
              name="rentprice" 
              value={formData.rentprice}  
              onChange={handleChange}
              placeholder="Enter rent price"  
              required
            />
            
            <p className="hero__subtitle">Picture:</p>
            <input
              className="hero__input"
              type="file"
              name="picture"
              onChange={handleFileChange}
              accept="image/*"
            />
            
            <p className="hero__subtitle">Description:</p>
            <textarea
              className="hero__textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
            ></textarea>
            
            <button className="hero__button" type="submit">Add Product</button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AddProductPage;
