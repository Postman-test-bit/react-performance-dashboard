// src/components/VisualDashboard.jsx

import React, { useEffect, useState, useMemo } from "react";
import TestCard from "./TestCard.jsx";
import Modal from "./Modal.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import SidebarMenu from "./SidebarMenu";
import PieChart from "../charts/PieChart.jsx";
import Loading from "./Loading.jsx";
import "../App.css";
import logoImage from "../image.png";

const supabaseUrl =
  "https://ocpaxmghzmfbuhxzxzae.supabase.co/storage/v1/object/public/visual-dashboard-json/merged-results.json";

async function fetchData() {
  try {
    const response = await fetch(supabaseUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const jsonData = await response.json();
    console.log("Data loaded:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
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
        const data = await fetchData();
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
        ☰
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
          <PieChart
            passed={passed}
            failed={failed}
            onSliceClick={(status) => setStatusFilter(status)}
          />

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
                {[...new Set(testData.map((t) => t.brand))].map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
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
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          <div
            className="test-card column-labels"
            style={{ marginTop: "2rem", fontWeight: 600 }}
          >
            <span>Test Name</span>
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
