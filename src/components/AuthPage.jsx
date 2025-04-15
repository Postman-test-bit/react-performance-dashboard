import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../image.jpg";
const userName = process.env.REACT_APP_ADMIN_USER;
const passWord = process.env.REACT_APP_ADMIN_PASS;

const AuthPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === `${userName}` && password === `${passWord}`) {
      setError("");
      sessionStorage.setItem("isAuthenticated", "true");
      navigate("/app");
    } else {
      setError("Invalid username or password ❌");
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="auth-card">
        <h2 className="auth-title">Welcome To The Performance Dashboard</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;