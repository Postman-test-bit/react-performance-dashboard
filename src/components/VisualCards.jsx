import React from "react";

const VisualCards = ({ data, theme }) => {
  const passed = data.filter((t) => t.status === "passed").length;
  const failed = data.filter((t) => t.status === "failed").length;
  const total = passed + failed;

  if (!data) return null;

  // Add this style for the info button
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

  return (
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
            alert(
              "Included all the brands and all the webpages.\nNOTE: There can be multiple test cases for a single webpage, to cover maximum scenarios.\n\nExample:\nIR - Upload Photo Page - [Upload Photo Page - Desktop viewport - Validate Mismatch]\nIR - Upload Photo Page - [After Uploading Photo Page - Desktop viewport - Validate Mismatch]."
            );
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
          ⨊
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

      {/* Passed Tests Card */}
      <div style={cardStyle}>
        <button
          style={infoButtonStyle}
          onClick={(e) => {
            e.stopPropagation();
            alert(
              "Included Visually matched test cases from all the brands and all the webpages."
            );
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
          ☑️
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

      {/* Failed Tests Card */}
      <div style={cardStyle}>
        <button
          style={infoButtonStyle}
          onClick={(e) => {
            e.stopPropagation();
            alert(
              "Included Visually mismatched test cases from all the brands and all the webpages.\nNOTE: Failed test cases are the ones that have a mismatch in the visual comparison, which can be caused due to increase in no. of events/members, change in profile name, etc. reasons.\nKindly verify the screenshots and confirm if the test case is a false positive or a real issue."
            );
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
          𒒬
        </div>
        <div>
          <h3 style={titleStyle}>Failed Tests</h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "red", // Inverting for fail color
            }}
          >
            {failed}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisualCards;
