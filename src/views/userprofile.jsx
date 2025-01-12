import React from "react";
import NavBar from "./nabvar";
import Footer from "./footer";
import "./userprofile.css";

const UserProfilePage = () => {
  return (
    <div>
      <NavBar />
      <main className="user-profile">
        <h1>User Profile</h1>
        <div className="profile-details">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> johndoe@example.com</p>
          <p><strong>Phone:</strong> 123-456-7890</p>
          {/* Add more details or edit options as needed */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
