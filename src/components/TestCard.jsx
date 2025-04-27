// components/TestCard.jsx

import React from "react";

const TestCard = ({ test, onViewImage }) => {
  const statusStyle = {
    color: test.status === "passed" ? "limegreen" : "tomato",
    fontWeight: "bold",
    textTransform: "capitalize",
  };

  return (
    <div className="test-card">
      <div>{test.name}</div>
      <div>{test.device}</div>
      <div>
        {test.status === "failed" && (
          <button onClick={() => onViewImage(test.imageUrl)}>View Image</button>
        )}
      </div>
      <div style={statusStyle}>{test.status}</div>
    </div>
  );
};

export default TestCard;
