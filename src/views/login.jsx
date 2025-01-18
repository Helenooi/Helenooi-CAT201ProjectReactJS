import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import Papa from "papaparse";  // Import PapaParse to parse CSV
import NavBar from "./nabvar"; 
import Footer from "./footer"; 
import './login.css';
import './utils.css';
import './adminForm.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username and Password cannot be empty.");
      return;
    }
  
    setLoading(true);
    setErrorMessage("");
  
    try {
      // Fetch the CSV file from the public directory
      const response = await fetch("/public/users.csv");  // Adjust the path if needed
      if (!response.ok) {
        throw new Error(`Error fetching CSV file: ${response.statusText}`);
      }
      const csvText = await response.text();
      
      // Parse the CSV data using PapaParse
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result.data); // Log parsed CSV data
          const users = result.data;
  
          // Check if the username and password match any entry in the CSV
          const user = users.find(
            (u) => u.Username.trim() === username.trim() && u.Password.trim() === password.trim()
          );
  
          if (user) {
            // Store user information in localStorage
            localStorage.setItem("username", user.Username);
            localStorage.setItem("role", user.Role);
  
            // Navigate to the respective page based on role
            navigate(user.Role === "admin" ? "/adminpage" : "/userpage");
          } else {
            setErrorMessage("Invalid username or password.");
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setErrorMessage("An error occurred while processing the login.");
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Unable to log in. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <NavBar />
      <main>
        <br />
        <br /> <br /> <br />
        <section className="hero container">
          <form
            className="hero__form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <h1 className="hero__title">
              <i className="fas fa-user-circle"></i> Login
            </h1>

            {errorMessage && <p className="hero__error">{errorMessage}</p>}

            <p className="hero__subtitle">Username:</p>
            <input
              className="hero__input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />

            <p className="hero__subtitle">Password:</p>
            <div className="password-container">
              <input
                className="hero__input"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                <i className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <button className="btn2 hero__login" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <div className="signup-link">
            <p>No have an account? <Link className="link" to="/signup">Sign up here</Link></p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Login;
