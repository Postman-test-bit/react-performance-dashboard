import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "../image.jpg";

const AuthPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 👈 NEW
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // 👈 Start loading

    try {
      const response = await fetch(
        "https://test-dashboard-66zd.onrender.com/api/verifycredentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.isAuthenticated) {
        setError("");
        sessionStorage.setItem("isAuthenticated", "true");
        navigate(from, { replace: true });
      } else {
        setError(data.error || "Invalid username or password ❌");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // 👈 Stop loading
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
              disabled={loading} // 👈 Disable during loading
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
              disabled={loading} // 👈 Disable during loading
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Verifying..." : "Login"} {/* 👈 Show dynamic text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
