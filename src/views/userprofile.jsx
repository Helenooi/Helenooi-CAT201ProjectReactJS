import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "./navbar";
import Footer from "./footer";
import "./userprofile.css";

const UserProfilePage = () => {
  const role = "user";
  const navigate = useNavigate();
  
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role || role !== "user") {
      navigate("/login");
    }
  }, [navigate]);


  const [profile] = useState({
    name: "Ooi May Fen",
    email: "mayyfenn@gmail.com",
    phone: "011-3775587",
    address: "USM, Pulau Pinang",
    profilePicture: "/iconprofile.png", 
  });

  return (
    <div>
      <NavBar role={role} />
      <h1><br/><br/></h1>
      <main className="user-profile-container">
        <div className="profile-box">
          <h1 className="profile-title">User Profile</h1>
          <div className="profile-picture-section">
            <img src={profile.profilePicture} alt="Profile" className="profile-picture" />
          </div>
          <div className="profile-details">
            <div className="profile-field">
              <label>Name:</label>
              <p>{profile.name}</p>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <p>{profile.email}</p>
            </div>
            <div className="profile-field">
              <label>Phone:</label>
              <p>{profile.phone}</p>
            </div>
            <div className="profile-field">
              <label>Address:</label>
              <p>{profile.address}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;




