import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import NavBar from "./nabvar"; // Assuming a proper NavBar component
import Footer from "./footer"; // Assuming a proper Footer component
import './login.css';
import './utils.css';
import './adminForm.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to control password visibility
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
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        localStorage.setItem("username", result.username);
        localStorage.setItem("role", result.role);

        navigate(result.role === "admin" ? "/adminpage" : "/userpage");
      } else {
        setErrorMessage(result.message || "Invalid username or password.");
      }
    } catch (error) {
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
                type={passwordVisible ? "text" : "password"} // Toggle between text and password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
              >
                <i className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}></i> {/* Change icon based on visibility */}
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
