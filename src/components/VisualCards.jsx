import React, { useState } from "react";
import logoImage from "../failed_icon.png";

const VisualCards = ({ data, theme }) => {
  const passed = data.filter((t) => t.status === "passed").length;
  const failed = data.filter((t) => t.status === "failed").length;
  const total = passed + failed;

  // State for modals
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [showPassedModal, setShowPassedModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);

  if (!data) return null;

  // Info button style
  const infoButtonStyle = {
    position: "relative",
    left: "97%",
    bottom: "40%",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor:
      theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    color: theme === "light" ? "#666" : "#ccc",
    ":hover": {
      backgroundColor:
        theme === "light" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)",
    },
  };

  // Modal style based on theme
  const modalStyle = {
    backgroundColor: theme === "light" ? "white" : "var(--bg-secondary)",
    color: theme === "light" ? "#333" : "#eee",
  };

  const cardStyle = {
    backgroundColor: theme === "light" ? "white" : "var(--bg-secondary)",
    borderRadius: "8px",
    padding: "16px",
    boxShadow:
      theme === "light"
        ? "0 1px 3px rgba(0, 0, 0, 0.1)"
        : "0 1px 3px rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "transform 0.2s ease",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-2px)",
    },
  };

  const titleStyle = {
    fontSize: "14px",
    color:
      theme === "light" ? "var(--text-secondary)" : "var(--text-secondary)",
    marginBottom: "4px",
  };

  // Modal component
  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            ...modalStyle,
            borderRadius: "8px",
            width: "80%",
            maxWidth: "500px",
            padding: "20px",
            boxShadow:
              theme === "light"
                ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                : "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              borderBottom: `1px solid ${theme === "light" ? "#eee" : "#444"}`,
              paddingBottom: "8px",
            }}
          >
            <h3 style={{ margin: 0 }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: theme === "light" ? "#666" : "#aaa",
              }}
            >
              ×
            </button>
          </div>
          <div style={{ marginBottom: "16px" }}>{children}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: theme === "light" ? "#3b82f6" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          padding: "1rem",
          width: "100%",
        }}
      >
        {/* Total Tests Card */}
        <div style={cardStyle}>
          <button
            style={infoButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              setShowTotalModal(true);
            }}
            aria-label="Total Test case information"
          >
            i
          </button>
          <div
            style={{
              fontSize: "24px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                theme === "light" ? "var(--bg-primary)" : "var(--bg-tertiary)",
              borderRadius: "8px",
            }}
          >
            <img
              src="https://img.icons8.com/?size=100&id=aDxFydZTXC0Y&format=png&color=000000"
              alt="Total Icon"
              style={{
                width: "45px",
                height: "45px",
                position: "relative",
                right: "1rem",
              }}
            />
          </div>
          <div>
            <h3 style={titleStyle}>Total Tests</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: theme === "light" ? "#3b82f6" : "#60a5fa",
              }}
            >
              {total}
            </p>
          </div>
        </div>
        <div style={cardStyle}>
          <button
            style={infoButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              setShowPassedModal(true);
            }}
            aria-label="Passed Test case information"
          >
            i
          </button>
          <div
            style={{
              fontSize: "24px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                theme === "light" ? "var(--bg-primary)" : "var(--bg-tertiary)",
              borderRadius: "8px",
            }}
          >
            <img
              src="https://img.icons8.com/?size=100&id=AgSsCpE2BsM1&format=png&color=000000"
              alt="Passed Icon"
              style={{
                width: "45px",
                height: "45px",
                position: "relative",
                right: "1rem",
              }}
            />
          </div>
          <div>
            <h3 style={titleStyle}>Passed Tests</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "rgb(74, 222, 128)",
              }}
            >
              {passed}
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <button
            style={infoButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              setShowFailedModal(true);
            }}
            aria-label="Failed Test case information"
          >
            i
          </button>
          <div
            style={{
              fontSize: "24px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                theme === "light" ? "var(--bg-primary)" : "var(--bg-tertiary)",
              borderRadius: "8px",
            }}
          >
            <img
              src={logoImage}
              alt="Failed Icon"
              style={{
                width: "45px",
                height: "45px",
                position: "relative",
                right: "1rem",
              }}
            />
          </div>
          <div>
            <h3 style={titleStyle}>Failed Tests</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "red",
              }}
            >
              {failed}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        show={showTotalModal}
        onClose={() => setShowTotalModal(false)}
        title="Total Test Information"
      >
        <p style={{ marginBottom: "12px" }}>
          Included all the brands and all the webpages.
        </p>
        <p style={{ marginBottom: "12px", fontWeight: 900 }}>NOTE:</p>
        <p style={{ marginBottom: "8px", fontStyle: "italic", color: "grey" }}>
          There can be multiple test cases for a single webpage, to cover
          maximum scenarios.
        </p>
        <p style={{ fontStyle: "italic", color: "grey" }}>
          Example:
          <br />
          IR - Upload Photo Page - [Upload Photo Page - Desktop viewport -
          Validate Mismatch]
          <br />
          IR - Upload Photo Page - [After Uploading Photo Page - Desktop
          viewport - Validate Mismatch]
        </p>
      </Modal>

      <Modal
        show={showPassedModal}
        onClose={() => setShowPassedModal(false)}
        title="Passed Test Information"
      >
        <p>
          Included Visually matched test cases from all the brands and all the
          webpages.
        </p>
      </Modal>

      <Modal
        show={showFailedModal}
        onClose={() => setShowFailedModal(false)}
        title="Failed Test Information"
      >
        <p style={{ marginBottom: "12px" }}>
          Included Visually mismatched test cases from all the brands and all
          the webpages.
        </p>
        <p style={{ marginBottom: "12px", fontWeight: 900 }}>NOTE:</p>
        <p style={{ fontStyle: "italic", color: "grey" }}>
          Failed test cases indicate visual mismatches, which may result from
          changes like increased events/members or updated profile names. Please
          review the screenshots to confirm if they are false positives or real
          issues.
        </p>
      </Modal>
    </>
  );
};

export default VisualCards;
