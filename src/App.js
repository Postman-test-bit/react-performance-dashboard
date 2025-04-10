import React, { useState, useEffect, useMemo } from "react";
import ThemeToggle from "./components/ThemeToggle";
import MetricsContainer from "./components/MetricsContainer";
import DataTable from "./components/DataTable";
import GlobalFilters from "./components/GlobalFilters";
import DateFilter from "./components/DateFilter";
import KPICards from './components/KPICards';

import "./App.css";
import "./styles/theme.css";

function App() {
  const [allData, setAllData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [uriFilter, setUriFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Theme handling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
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
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Extract available filter options
  const availableURIs = useMemo(() => 
    [...new Set(allData.map(d => d.url || d.uri || ''))].filter(Boolean).sort(),
    [allData]
  );

  const availableProducts = useMemo(() => 
    [...new Set(allData.map(d => d.brand || d.product || ''))].filter(Boolean).sort(),
    [allData]
  );

  const availableDevices = useMemo(() => 
    [...new Set(allData.flatMap(d => {
      if (Array.isArray(d.tags)) return d.tags;
      if (d.device) return [d.device];
      return [];
    }))].filter(Boolean).sort(),
    [allData]
  );

  // Filter data based on all filters
  const filteredData = useMemo(() => {
    return allData.filter(item => {
      // Search query filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        Object.values(item).some(value => 
          value && String(value).toLowerCase().includes(searchLower)
        );

      // URI filter
      const itemURI = item.url || item.uri || '';
      const matchesURI = !uriFilter || itemURI === uriFilter;

      // Product filter
      const itemProduct = item.brand || item.product || '';
      const matchesProduct = !productFilter || itemProduct === productFilter;

      // Device filter
      const itemDevices = Array.isArray(item.tags) ? item.tags : 
                         item.device ? [item.device] : [];
      const matchesDevice = !deviceFilter || 
        itemDevices.includes(deviceFilter);

      // Date filter
      const itemDate = new Date(item.created_at);
      const matchesStartDate = !startDate || itemDate >= new Date(startDate);
      const matchesEndDate = !endDate || itemDate <= new Date(endDate);

      return matchesSearch && matchesURI && matchesProduct && 
             matchesDevice && matchesStartDate && matchesEndDate;
    });
  }, [allData, searchQuery, uriFilter, productFilter, deviceFilter, startDate, endDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://test-dashboard-66zd.onrender.com/api/data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Debug log
        setAllData(data);
        
        // Get latest data for each scenario
        const latestByScenario = Object.values(
          data.reduce((acc, curr) => {
            if (!acc[curr.scenario] || new Date(curr.created_at) > new Date(acc[curr.scenario].created_at)) {
              acc[curr.scenario] = curr;
            }
            return acc;
          }, {})
        );
        setLatestData(latestByScenario);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'var(--text-primary)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app">
      {/* Theme Toggle */}
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      {/* Global Header */}
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
          Networks Performance Dashboard
        </h1>
      </div>

      {/* KPI Cards */}
      <KPICards data={filteredData} theme={theme} />

      {/* Global Filters */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <GlobalFilters
              uriFilter={uriFilter}
              setUriFilter={setUriFilter}
              productFilter={productFilter}
              setProductFilter={setProductFilter}
              deviceFilter={deviceFilter}
              setDeviceFilter={setDeviceFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              availableProducts={availableProducts}
              availableDevices={availableDevices}
              availableURIs={availableURIs}
              theme={theme}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "0 20px",
              }}
            >
              <DateFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                theme={theme}
              />
            </div>
          </div>

          <MetricsContainer
            data={filteredData}
            allData={allData}
            theme={theme}
          />

          <DataTable
            data={filteredData}
            latestData={latestData}
            theme={theme}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
