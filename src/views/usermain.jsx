import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from "./navbar";
import Footer from "./footer";
import "./usermain.css";
import SectionHeading from "../components/section-heading";
import { Link } from "react-router-dom";
import UserProfilePage from "./userprofile.jsx";


const UserMainPage = () => {
  const [role, setRole] = useState("user");

  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || role !== 'user') {
      navigate('/login');  
    }
  }, [navigate]);


  const menuOptions = [
    { label: "View Products", icon: "/iconviewproduct.png", link: "/products" },
    { label: "Cart", icon: "/211707_cart_icon.png", link: "/cart" },
    { label: "My Orders", icon: "/iconmyorder.png", link: "/payment" },
    { label: "User Profile", icon: "/iconuserprofile.png", link: "/profile" },
  ];

  const bestSellers = [
    {
      name: "Elegant Evening Gown",
      description: "A stunning gown for formal events.",
      image: "/DRESS6.jpg",
    },
    {
      name: "Butterfly Gardenia Lace Dress",
      description: "Suitable for graduation day and beach party. Tailored to perfection.",
      image: "/promdress1.jpg",
    },
    {
      name: "Classic White Wedding Dress",
      description: "Perfect for your wedding day.",
      image: "/weddingdress1.jpg",
    },
  ];

  return (
    <>
      <NavBar role={role} />
      <SectionHeading heading="WELCOME, USER" />
      
      <h1><br/><br/></h1>
      <div className="page-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">WELCOME TO TRENDY RENTALS!</h1>
            <p className="hero-description">
              Your go-to destination for affordable and stylish clothing rentals!
            </p>
            <button className="cta-button">Explore Now</button>
          </div>
          <div className="hero-images">
    <img
      src="/dress5.jpg"
      alt="Fashion Collection 1"
      className="animated-image left-image"
    />
    <img
      src="/promdress1.jpg"
      alt="Fashion Collection 2"
      className="animated-image right-image"
    />
     </div>
        </div>

        <div className="menu">
  {menuOptions.map((option, index) => (
    <Link to={option.link} className="menu-item" key={index}>
      <img src={option.icon} alt={option.label} className="card-icon" />
      <span className="card-label">{option.label}</span>
    </Link>
  ))}
  </div>

        
        <h1><br/><br/></h1>
        <h2 className="section-heading">FEATURED COLLECTIONS</h2>
        
        <h1><br/><br/></h1>
        <div className="best-sellers">
          {bestSellers.map((item, index) => (
            <div className="item-card" key={index}>
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-content">
                <h3 className="item-title">{item.name}</h3>
                <p className="item-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserMainPage;




<h1><br/><br/></h1>