// src/components/Modal.jsx

import React from "react";

const Modal = ({ imageUrl, onClose }) => {
  return (
    <div className="modal">
      <div className="modal__background">
        <div className="modal__window">
          <h2 className="modal__title">
            <span style={{ color: "var(--text-primary)" }}>Screenshot</span>
            <span
              className="modal__close"
              onClick={onClose}
              style={{
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: "1.5rem",
                padding: "0.5rem",
                marginLeft: "auto",
                transition: "color 0.2s ease",
              }}
            >
              ✖
            </span>
          </h2>
          <div className="modal__content">
            <div className="attachment">
              <div className="attachment__media-container attachment__media-container_fullscreen">
                <img
                  className="attachment__media"
                  src={imageUrl}
                  alt="Screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
