// src/components/VisualDashboard.jsx

import React, { useEffect, useState } from "react";
import TestCard from "./TestCard.jsx";
import Modal from "./Modal.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import SidebarMenu from "./SidebarMenu";
import PieChart from "../charts/PieChart.jsx";
import Loading from "./Loading.jsx";
import ScreenshotList from "./ScreenshotList.jsx";
import BrandTestCharts from "../charts/BrandTestCharts.jsx";
import "../App.css";
import "../charts/BrandChart.css";
import VisualCards from "./VisualCards.jsx";

let data;

async function fetchData() {
  try {
    const response = await fetch(
      "https://test-dashboard-66zd.onrender.com/api/proxy/merged-results"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const jsonData = await response.json();
    console.log("Data loaded:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
}
async function fetchList() {
  try {
    const response = await fetch(
      "https://test-dashboard-66zd.onrender.com/api/proxy/baselineList"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const textData = await response.text();
    return textData.split("\n").filter((path) => path.trim() !== "");
  } catch (error) {
    console.error("Failed to fetch screenshot paths:", error);
    return [];
  }
}

const VisualDashboard = () => {
  const [modalImage, setModalImage] = useState(null);
  const [theme, setTheme] = useState("light");
  const [statusFilter, setStatusFilter] = useState(null);
  const [deviceFilter, setDeviceFilter] = useState(null);
  const [brandFilter, setBrandFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [screenshotPaths, setScreenshotPaths] = useState([]);
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [loadingScreenshots, setLoadingScreenshots] = useState(false);

  const loadScreenshotPaths = async () => {
    if (screenshotPaths.length > 0 || loadingScreenshots) return;

    setLoadingScreenshots(true);
    try {
      const paths = await fetchList();
      setScreenshotPaths(paths);
    } catch (error) {
      console.error("Error loading screenshots:", error);
    } finally {
      setLoadingScreenshots(false);
    }
  };

  // Theme handling
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        setLoading(true);
        data = await fetchData();
        setTestData(data || []);
        setLoading(false);
        setInitialLoad(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchDataAndSetState();
  }, []);

  const passed = testData.filter((t) => t.status === "passed").length;
  const failed = testData.filter((t) => t.status === "failed").length;

  const handleViewImage = (url) => {
    setModalImage(url);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setDeviceFilter(null);
    setBrandFilter(null);
    setSearchTerm("");
  };

  const filteredData = testData.filter((t) => {
    // Search by test name
    if (
      searchTerm &&
      !t.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by status
    if (statusFilter && t.status !== statusFilter.toLowerCase()) {
      return false;
    }

    // Filter by device
    if (deviceFilter && t.device !== deviceFilter) {
      return false;
    }

    // Filter by brand
    if (brandFilter && t.brand !== brandFilter) {
      return false;
    }

    return true;
  });

  if (initialLoad) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <Loading
          text="Loading ..."
          size="1.8rem"
          color={theme === "dark" ? "#00e5ff" : "#0066cc"}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <button
        className="hamburger-button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        {/* Hamburger icon */}
        <img
          src="https://img.icons8.com/fluency/48/menu--v3.png"
          alt="Menu"
          style={{ width: "24px", height: "24px" }}
        />
      </button>
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "600",
            color: "var(--text-primary)",
            letterSpacing: "-0.025em",
          }}
        >
          Visual Test Dashboard
        </h1>
      </div>

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <Loading
            text="Loading Data..."
            size="1.5rem"
            color={theme === "dark" ? "#00e5ff" : "#0066cc"}
          />
        </div>
      ) : (
        <>
          <VisualCards data={data} theme={theme} />
          <PieChart
            passed={passed}
            failed={failed}
            onSliceClick={(status) => setStatusFilter(status)}
          />

          {/* Brand Test Charts Section */}
          <div className="brand-charts-section">
            <h2
              style={{
                textAlign: "center",
                color: "var(--text-primary)",
                margin: "2rem 0 1rem",
                padding: "0 1rem",
              }}
            >
              Brand Test Analysis
            </h2>
            <BrandTestCharts data={testData} />
          </div>

          <div
            className="filters-container"
            style={{
              margin: "1rem 0",
              textAlign: "center",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {/* Search by Test Name */}
            <div className="search-wrapper">
              <label htmlFor="test-search" style={{ marginRight: "10px" }}>
                Search Test Name:
              </label>
              <input
                type="text"
                id="test-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "5px" }}
                placeholder="Search by test name"
              />
            </div>

            {/* Filter by Device */}
            <div className="device-select-wrapper">
              <label htmlFor="device-select" style={{ marginRight: "10px" }}>
                Filter by Device:
              </label>
              <select
                id="device-select"
                value={deviceFilter || ""}
                onChange={(e) => setDeviceFilter(e.target.value || null)}
                style={{ padding: "8px 12px", borderRadius: "5px" }}
              >
                <option value="">All Devices</option>
                {[...new Set(testData.map((t) => t.device))].map((device) => (
                  <option key={device} value={device}>
                    {device}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Brand */}
            <div className="brand-select-wrapper">
              <label htmlFor="brand-select" style={{ marginRight: "10px" }}>
                Filter by Brand:
              </label>
              <select
                id="brand-select"
                value={brandFilter || ""}
                onChange={(e) => setBrandFilter(e.target.value || null)}
                style={{ padding: "8px 12px", borderRadius: "5px" }}
              >
                <option value="">All Brands</option>
                {[...new Set(testData.map((t) => t.brand).filter(Boolean))].map(
                  (brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Filter by Test Status */}
            <div className="status-select-wrapper">
              <label htmlFor="status-select" style={{ marginRight: "10px" }}>
                Filter by Status:
              </label>
              <select
                id="status-select"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                style={{ padding: "8px 12px", borderRadius: "5px" }}
              >
                <option value="">All Statuses</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || deviceFilter || brandFilter || statusFilter) && (
              <div style={{ width: "100%", textAlign: "center" }}>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: "0.5rem 1rem",
                    marginTop: "0.5rem",
                    backgroundColor: theme === "light" ? "#ef4444" : "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
            <button
              onClick={() => {
                if (!showScreenshots) loadScreenshotPaths();
                setShowScreenshots(!showScreenshots);
              }}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors screenshot-toggle-button"
            >
              {showScreenshots
                ? "Hide Screenshot Paths"
                : "Show Screenshot Paths"}
            </button>
          </div>

          <div>
            {showScreenshots && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {loadingScreenshots ? (
                  <div className="text-gray-500 dark:text-gray-400 text-center">
                    Loading screenshot paths...
                  </div>
                ) : screenshotPaths.length > 0 ? (
                  <ScreenshotList paths={screenshotPaths} />
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-center">
                    No screenshot paths available! Seems like the baseline
                    screenshots have already been uploaded.
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className="test-card column-labels"
            style={{
              marginTop: "2rem",
              fontWeight: 600,
              display: "grid",
              padding: "0.5rem 1rem",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <span>Test Name</span>
            <span>Brand</span>
            <span>Device</span>
            <span>Difference Image</span>
            <span>Test Status</span>
          </div>

          {filteredData.map((test, idx) => (
            <TestCard key={idx} test={test} onViewImage={handleViewImage} />
          ))}

          {modalImage && <Modal imageUrl={modalImage} onClose={closeModal} />}
        </>
      )}
    </div>
  );
};

export default VisualDashboard;
