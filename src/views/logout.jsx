import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });
  };

  return (
    <div className="logout-container">

     <span className="navbar-link" onClick={handleLogout}>LOGOUT</span>
    </div>
  );
};

export default Logout;
