import React from 'react';

const TabsContainer = ({ activeTab, onTabChange, theme }) => {
  const tabs = [
    { id: 'performance', label: 'Performance' },
    { id: 'seo', label: 'SEO' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'bestPractices', label: 'Best Practices' }
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "1px",
        backgroundColor: theme === "light" ? "#e2e8f0" : "#374151",
        padding: "4px",
        borderRadius: "8px",
        marginBottom: "20px",
        width: "fit-content",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor:
              activeTab === tab.id
                ? theme === "light"
                  ? "white"
                  : "#1f2937"
                : "transparent",
            color:
              activeTab === tab.id
                ? theme === "light"
                  ? "#1e293b"
                  : "#e2e8f0"
                : theme === "light"
                ? "#64748b"
                : "#94a3b8",
            fontWeight: activeTab === tab.id ? "600" : "400",
            fontSize: "14px",
            transition: "all 0.2s ease",
            ":hover": {
              backgroundColor:
                theme === "light"
                  ? "rgba(255, 255, 255, 0.8)"
                  : "rgba(31, 41, 55, 0.8)",
            },
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabsContainer;
