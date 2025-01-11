import React, { useState } from 'react';
import NavBar from './nabvar';
import Footer from './footer';
import './utils.css';
import './style.css';
import './modern-normalize.css';
import './addproduct.css';

const AddProductPage = () => {
  const [role, setRole] = useState('admin');
  
  // State to hold form data
  const [formData, setFormData] = useState({
    clothesname: '',
    size: '',
    retailprice: '',
    picture: null,
    description: '',
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      picture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('clothesname', formData.clothesname);
    formDataToSend.append('size', formData.size);
    formDataToSend.append('retailprice', formData.retailprice);
    formDataToSend.append('picture', formData.picture);
    formDataToSend.append('description', formData.description);

    // Log the FormData for debugging
    console.log('Form Data:', formDataToSend);

    try {
        const response = await fetch('http://localhost:8080/api/addproduct', {
            method: 'POST',
            body: formDataToSend,
        });

        console.log('Response Status:', response.status);
        const responseBody = await response.text();
        console.log('Response Body:', responseBody);

        if (response.ok) {
            alert('Product added successfully!');
            setFormData({
                clothesname: '',
                size: '',
                retailprice: '',
                picture: null,
                description: '',
            });
        } else {
            alert('Failed to add product.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding product.');
    }
};


  return (
    <div>
      <NavBar role={role} />
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
            <p className="hero__subtitle">Retail Price:</p>
            <input
              className="hero__input"
              type="number"
              name="retailprice"
              value={formData.retailprice}
              onChange={handleChange}
              placeholder="Enter the retail price"
              required
            />
            <p className="hero__subtitle">Picture:</p>
            <input
              className="hero__input"
              type="file"
              name="picture"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleFileChange}
            />
            <p className="hero__subtitle">Description:</p>
            <input
              className="hero__input"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter the description"
              required
            />
            <div className="hero__btn-wrapper">
              <button type="submit" className="hero__btn btn" id="saveButton">Save</button>
              <button type="button" className="hero__btn btn" id="backButton">Back</button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AddProductPage;
