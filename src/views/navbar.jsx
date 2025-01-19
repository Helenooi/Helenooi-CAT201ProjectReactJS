import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./home.css";
import Logout from "./logout.jsx";
import { Link } from "react-router-dom";

const NavBar = ({ role }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const renderLinks = () => {
    if (role === "user") {
      return (
        <>
          <Link className="navbar-link" to="/products">VIEW PRODUCT</Link>
          <Link className="navbar-link" to="/cart">CART</Link>
          <Link className="navbar-link" to="/orders">MY ORDERS</Link>
          <Link className="navbar-link" to="/profile">USER PROFILE</Link>
        </>
      );
    }
    if (role === "admin") {
      return (
        <>
          <Link className="navbar-link" to="/addproduct">ADD PRODUCT</Link>
          <Link className="navbar-link" to="/viewproduct">VIEW PRODUCT</Link>
        </>
      );
    }
    return null;
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/";

  return (
    <div className="home-navbar1">
      <header className="home-header max-width-container" style={{ height: "1.5rem" }}>
        <div className="home-navbar2">
          <div className="home-middle1">
            <span className="home-logo-center1 navbar-logo-title">RENTIQUE</span>
            <div className="home-right1 desktop-only">{renderLinks()}</div>
          </div>

          {!isAuthPage && (
            <div className="home-icons">
              <Logout />
            </div>
          )}
        </div>

        {!isMenuOpen && (
          <div
            data-role="BurgerMenu"
            className="home-burger-menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <svg viewBox="0 0 1024 1024" className="home-icon10">
              <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
            </svg>
          </div>
        )}

        <div
          data-role="MobileMenu"
          className={`home-mobile-menu ${isMenuOpen ? "menu-open" : ""}`}
        >
          <div className="home-nav">
            <div className="home-container3">
              <span className="home-logo-center2">Rentique</span>
              <div
                data-role="CloseMobileMenu"
                className="home-close-mobile-menu"
                onClick={handleCloseMenu}
              >
                <svg viewBox="0 0 1024 1024" className="home-icon12">
                  <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                </svg>
              </div>
            </div>
            <div className="home-middle2">
              <div className="home-right1">{renderLinks()}</div>
              {!isAuthPage && (
                <a href="/login" className="navbar-login-mobile">
                  LOGOUT
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavBar;
