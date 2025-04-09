/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import MetricBox from "./components/MetricBox";
import PerformanceChart from "./charts/PerformanceChart";
import SEOChart from "./charts/SEOChart";
import AccessibilityChart from "./charts/AccessibilityChart";
import BestPracticeChart from "./charts/BestPracticeChart";
import DeviceChart from "./charts/DeviceChart";
import DataTable from "./components/DataTable";
import Loading from "./components/Loading";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  const [allData, setAllData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [searchTerm, setSearchTerm] = useState("");
  const [urlFilter, setUrlFilter] = useState("");

  // Apply theme class to body element
  useEffect(() => {
    document.body.className = `${theme}-mode`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get unique URLs from allData
  const uniqueUrls = React.useMemo(() => {
    if (!allData || allData.length === 0) return [];
    const urls = allData.map((item) => item.url).filter(Boolean);
    return [...new Set(urls)].sort();
  }, [allData]);

  // Combined filter function
  const filterData = (data) => {
    return data.filter((item) => {
      // Search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          item.name?.toLowerCase().includes(term) ||
          item.url?.toLowerCase().includes(term) ||
          item.scenario?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // URL filter
      if (urlFilter && item.url !== urlFilter) return false;

      return true;
    });
  };

  const filteredData = filterData(allData);
  const filteredLatestData = filterData(latestData);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://test-dashboard-66zd.onrender.com/api/data"
      );
      const data = await response.json();
      setAllData(data);
      const latest = await fetchLatestData(data);
      setLatestData(latest);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestData = async (data) => {
    const latestRunResults = Object.values(
      data.reduce((acc, test) => {
        const { scenario, created_at } = test;
        if (
          !acc[scenario] ||
          new Date(created_at) > new Date(acc[scenario].created_at)
        ) {
          acc[scenario] = test;
        }
        return acc;
      }, {})
    );
    return latestRunResults;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearAllFilters = () => {
    setSearchTerm("");
    setUrlFilter("");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`app-container ${theme}`}>
      <ThemeToggle toggleTheme={toggleTheme} theme={theme} />

      <Header>
        <div className="filters-container">
          <div className="global-search-container">
            <input
              type="text"
              placeholder="Search by Test Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="global-search-input"
            />
          </div>

          <div className="url-filter">
            <label htmlFor="url-filter">Filter by URL:</label>
            <select
              id="url-filter"
              value={urlFilter}
              onChange={(e) => setUrlFilter(e.target.value)}
              disabled={uniqueUrls.length === 0}
            >
              <option value="">All URLs</option>
              {uniqueUrls.map((url) => (
                <option key={url} value={url}>
                  {url}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || urlFilter) && (
            <button onClick={clearAllFilters} className="clear-all-filters">
              Clear All Filters
            </button>
          )}
        </div>
      </Header>

      <div className="metrics">
        <MetricBox
          title="Accessibility"
          score={filteredLatestData[0]?.accessibility_metrics || 0}
          onClick={() =>
            document
              .getElementById("AccessibilityChart")
              .scrollIntoView({ behavior: "smooth", force: true })
          }
          theme={theme}
        />
        <MetricBox
          title="SEO"
          score={filteredLatestData[0]?.seo_metrics || 0}
          onClick={() =>
            document
              .getElementById("SEOChart")
              .scrollIntoView({ behavior: "smooth", force: true })
          }
          theme={theme}
        />
        <MetricBox
          title="Best-Practices"
          score={filteredLatestData[0]?.best_practice_metrics || 0}
          onClick={() =>
            document
              .getElementById("Best-PracticesChart")
              .scrollIntoView({ behavior: "smooth", force: true })
          }
          theme={theme}
        />
      </div>

      <PerformanceChart
        data={filteredLatestData}
        allData={filteredData}
        theme={theme}
      />
      <SEOChart
        data={filteredLatestData}
        allData={filteredData}
        theme={theme}
      />
      <AccessibilityChart
        data={filteredLatestData}
        allData={filteredData}
        theme={theme}
      />
      <BestPracticeChart
        data={filteredLatestData}
        allData={filteredData}
        theme={theme}
      />
      <DeviceChart data={filteredData} theme={theme} />

      <DataTable
        data={filteredData}
        latestData={filteredLatestData}
        theme={theme}
      />

      <footer>
        <div className="version-details">
          <p>Dashboard Version: 2.2.0</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
