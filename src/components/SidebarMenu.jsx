import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SideBarMenu.css"; // Import your CSS file for styling
import logoImage from "../image.png";

const SidebarMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Performance Dashboard", path: "/" },
    { name: "Visual Dashboard", path: "/visual" },
  ];

  return (
    <div className={`sidebar-menu ${isOpen ? "open" : ""}`}>
      <div className="sidebar-overlay" onClick={onClose} />
      <div className="sidebar-content">
        <div className="brand-image">
          <img src={logoImage} alt="Brand Logo" />
        </div>
        <ul className="menu-items">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
