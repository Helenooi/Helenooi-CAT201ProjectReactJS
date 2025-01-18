import { Fragment } from 'react';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserMainPage from "./views/usermain";
import NavBar from './views/navbar';
import Footer from './views/footer';
import SectionHeading from './components/section-heading';

function App() {
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();
  
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || role !== 'admin') {
      navigate('/login');  
    }
  }, [navigate]);

  return (
    <div className="page-content">
      <NavBar role={role} />
      <br /><br /><br />
      <div className="app hero-section">
        <div className="app hero-content">
          <h1 className="hero-title">Welcome, Admin</h1>
          <p className="hero-description">
            Manage your products and inventory with ease
          </p>
        </div>
      </div>

      <div className="menu">
        <Link to="/viewproduct" className="menu-item">
          <img 
            src="/iconviewproduct.png" 
            alt="View Products" 
            className="card-icon"
          />
          <span className="card-label">View Products</span>
        </Link>
        
        <Link to="/addproduct" className="menu-item">
          <img 
            src="/iconviewproduct.png" 
            alt="Add Product" 
            className="card-icon"
          />
          <span className="card-label">Add Product</span>
        </Link>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;