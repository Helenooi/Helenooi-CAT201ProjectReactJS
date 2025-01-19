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

  // State to store profile data
  const [profile, setProfile] = useState({
    name: "Sofea Jello",
    email: "jellosofea@gmail.com",
    phone: "123-456-7890",
    address: "USM, Pulau Pinang",
    profilePicture: "/iconprofile.png", // Placeholder for profile picture
  });

  // State to toggle edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Rental history sample data
  const [rentalHistory] = useState([
    { id: 1, item: "Elegant Evening Gown", date: "2024-12-15", status: "Returned" },
    { id: 2, item: "Prom Dress", date: "2024-11-20", status: "In Progress" },
  ]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle toggle between edit and save
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <NavBar role={role} />
      <h1><br/><br/></h1>
      <main className="user-profile-container">
        <div className="profile-box">
          <h1 className="profile-title">User Profile</h1>
          <div className="profile-picture-section">
            <img src={profile.profilePicture} alt="Profile" className="profile-picture" />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="upload-input"
              />
            )}
          </div>
          <div className="profile-details">
            <form>
              <div className="profile-field">
                <label>Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile.name}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Phone:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Address:</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile.address}</p>
                )}
              </div>
              <button
                type="button"
                className="edit-save-button"
                onClick={handleEditToggle}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </form>
          </div>
        </div>

        <div className="rental-history-box">
          <h2 className="rental-history-title">Rental History</h2>
          <ul>
            {rentalHistory.map((rental) => (
              <li key={rental.id} className="rental-history-item">
                <strong>{rental.item}</strong> - {rental.date} ({rental.status})
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;



