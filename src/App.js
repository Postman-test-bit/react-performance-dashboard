// src/App.js
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`app-container ${theme}`}>
      <ThemeToggle toggleTheme={toggleTheme} theme={theme} />

      <Header />

      <div className="metrics">
        <MetricBox
          title="Accessibility"
          score={allData[allData.length - 1].accessibility_metrics}
          onClick={() =>
            document
              .getElementById("accessibilityChart")
              .scrollIntoView({ behavior: "smooth" })
          }
          theme={theme}
        />
        <MetricBox
          title="SEO"
          score={allData[allData.length - 1].seo_metrics}
          onClick={() =>
            document
              .getElementById("seoChart")
              .scrollIntoView({ behavior: "smooth" })
          }
          theme={theme}
        />
        <MetricBox
          title="Best Practices"
          score={allData[allData.length - 1].best_practice_metrics}
          onClick={() =>
            document
              .getElementById("bestPracticeChart")
              .scrollIntoView({ behavior: "smooth" })
          }
          theme={theme}
        />
      </div>

      <PerformanceChart data={latestData} allData={allData} theme={theme} />
      <SEOChart data={latestData} allData={allData} theme={theme} />
      <AccessibilityChart data={latestData} allData={allData} theme={theme} />
      <BestPracticeChart data={latestData} allData={allData} theme={theme} />
      <DeviceChart data={allData} theme={theme} />

      <DataTable data={allData} latestData={latestData} theme={theme} />

      <footer>
        <div className="version-details">
          <p>Dashboard Version: 1.0.6</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
