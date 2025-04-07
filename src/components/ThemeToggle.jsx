// src/components/ThemeToggle.jsx
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import PropTypes from "prop-types";

const ThemeToggle = ({ toggleTheme, theme }) => {
  return (
    <div
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <FaMoon /> : <FaSun />}
    </div>
  );
};

ThemeToggle.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
};

export default ThemeToggle;
