import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = ({ toggleTheme, theme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
    </button>
  );
};

export default ThemeToggle;
