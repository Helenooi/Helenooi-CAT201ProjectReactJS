import React, { useState } from "react";
import NavBar from "./nabvar";
import Footer from "./footer";
import "./usermain.css";
import SectionHeading from "../components/section-heading";
import { Link } from "react-router-dom";


const UserMainPage = () => {
  const [role, setRole] = useState("user");

  const menuOptions = [
    { label: "View Products", icon: "/iconviewproduct.png", link: "/products" },
    { label: "Cart", icon: "/iconcart.png", link: "/cart" },
    { label: "Payment", icon: "/iconpayment.png", link: "/payment" },
    { label: "User Profile", icon: "/iconuserprofile.png", link: "/profile" },
  ];

  const bestSellers = [
    {
      name: "Elegant Evening Gown",
      description: "A stunning gown for formal events. Available in multiple sizes.",
      image: "/DRESS6.jpg",
    },
    {
      name: "Prom Dress",
      description: "Suitable for graduation and prom event. Tailored to perfection.",
      image: "/promdress1.jpg",
    },
    {
      name: "Wedding Dress",
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
            <h1 className="hero-title">WELCOME TO TRENDY RENTALS</h1>
            <p className="hero-description">
              Your go-to destination for affordable and stylish clothing rentals!
            </p>
            <button className="cta-button">Explore Now</button>
          </div>
          <div className="hero-image">
            <img src="/dress5.jpg" alt="Fashion Collection" className="animated-image" />
          </div>
        </div>

        <div className="menu">
          {menuOptions.map((option, index) => (
           <Link to="/profile" className="menu-item">
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