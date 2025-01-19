import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar"; // Assuming a proper NavBar component
import Footer from "./footer"; // Assuming a proper Footer component
import './login.css';
import './utils.css';
import './adminForm.css';
import { Link } from "react-router-dom";

const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); 
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!firstname.trim() || !lastname.trim() || !email.trim() || !password.trim() || !confirmpassword.trim()) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmpassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage(""); 

    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setSuccessMessage(`Signup successful! Your username is ${result.username}`); // Include username
        setTimeout(() => {
          navigate("/"); 
        }, 2000);
      }
       else {
        setErrorMessage(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Unable to sign up. Please try again later.");
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
              handleSignup();
            }}
          >
            <h1 className="hero__title"> <i className="fas fa-user-circle"></i> Signup</h1>

            {errorMessage && <p className="hero__error">{errorMessage}</p>}
            {successMessage && <p className="hero__success">{successMessage}</p>} {/* Display success message */}

            <p className="hero__subtitle">First Name:</p>
            <input
              className="hero__input"
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="First Name"
            />

            <p className="hero__subtitle">Last Name:</p>
            <input
              className="hero__input"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last Name"
            />

            <p className="hero__subtitle">Email:</p>
            <input
              className="hero__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <p className="hero__subtitle">Password:</p>
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

            <p className="hero__subtitle">Confirm Password:</p>
              <input
                className="hero__input"
                type={confirmPasswordVisible ? "text" : "password"} // Toggle between text and password
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} // Toggle confirm password visibility
              >
                <i className={`fas ${confirmPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}></i> {/* Change icon based on visibility */}
              </button>
          

            <button className="btn2" type="submit" disabled={loading}>
              {loading ? "Signing up..." : "SIGNUP"}
            </button>
          </form>
          <div className="signup-link">
                    <p>Already have an account? <Link className="link" to="/login">Login here</Link></p>
                  </div>
        </section>
    
      </main>
      <br/>
      <br/>
      <br/>
      <Footer />
    </>
  );
};

export default Signup;
