import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-text">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <button
              onClick={() => navigate(-1)}
              className="not-found-button secondary"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="not-found-button primary"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
