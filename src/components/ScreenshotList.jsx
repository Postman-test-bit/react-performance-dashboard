import React from "react";
import "./ScreenshotList.css"; // we'll define this next

const ScreenshotList = ({ paths }) => {
  const groupedPaths = paths.reduce((acc, path) => {
    const parts = path.split("/");
    const device = parts[2]; // e.g., 'desktop' or 'mobile'
    if (!acc[device]) acc[device] = [];
    acc[device].push(path);
    return acc;
  }, {});

  return (
    <div className="screenshot-wrapper">
      <h2 className="screenshot-title">📸 Baseline Screenshot Collection</h2>

      {Object.entries(groupedPaths).map(([device, devicePaths]) => (
        <div key={device} className="screenshot-section">
          <h3 className="device-title">{device} Screenshots</h3>

          <div className="screenshot-grid">
            {devicePaths.map((path, index) => {
              const fileName = path.split("/").pop();
              return (
                <div key={index} className="screenshot-card">
                  <div className="card-header">
                    <div className="file-name">{fileName}</div>
                    <div className="file-path">{path}</div>
                  </div>
                  <a
                    href={`https://fusion-networks-qa-dev.s3.eu-west-2.amazonaws.com/Visual-test-images/${path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="screenshot-button"
                  >
                    🔗 Open Screenshot
                  </a>
                  <div className="icon-hint">🖼️</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScreenshotList;
