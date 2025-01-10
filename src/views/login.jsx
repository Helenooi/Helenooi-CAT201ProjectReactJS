import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./nabvar";
import Footer from "./footer";
import './login.css';
import './utils.css';
import './style.css';
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState(null);

  const mockUsers = [
    { username: "admin", password: "adminpassword", role: "admin" },
    { username: "user", password: "userpassword", role: "user" },
  ];

  const handleLogin = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const user = mockUsers.find(
      (user) =>
        user.username === trimmedUsername && user.password === trimmedPassword
    );

    if (user) {
      setErrorMessage("");
      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);

      if (user.role === "admin") {
        setRedirectPath("/adminpage");
      } else if (user.role === "user") {
        setRedirectPath("/userpage");
      }
    } else {
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <>
      <NavBar />
      <main>
        <section className="hero container">
          <img
            className="hero__img"
            src="/logo/logo3.png"
            alt="Suria Sabah"
          />
        </section>
        <section className="hero container">
          <form
            className="hero__form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <h1 className="hero__title">ADMIN LOGIN</h1>
            {errorMessage && (
              <p className="hero__error" id="errorMessage">
                {errorMessage}
              </p>
            )}
            <input
              className="hero__input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <br />
            <input
              className="hero__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <br />
            <button className="btn2 hero__login" type="submit">
              LOGIN
            </button>
          </form>
          {redirectPath && (
            <Link to={redirectPath} className="btn2 hero__login">
              Proceed to {redirectPath === "/adminpage" ? "Admin" : "User"} Page
            </Link>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Login;
