import React, { useState, useEffect } from "react";
import MetricsCard from "../components/MetricsCard";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const SEOChart = ({ data, allData, theme }) => {
  const [sortConfig, setSortConfig] = useState({ key: "score", order: "asc" });
  const [columnCount, setColumnCount] = useState(1);
  const [deviceFilter, setDeviceFilter] = React.useState("All");
  const [seoFilter, setSeoFilter] = React.useState("All");

  const processData = () => {
    if (!data || data.length === 0) return [];

    let filtered = [...data];

    if (deviceFilter !== "All") {
      filtered = filtered.filter((d) => d.device === deviceFilter);
    }

    if (seoFilter !== "All") {
      let [min, max] = seoFilter.split("-").map(Number);
      if (min > max) [min, max] = [max, min];
      filtered = filtered.filter(
        (d) => d.seo_metrics >= min && d.seo_metrics <= max
      );
    }

    const grouped = filtered.reduce((acc, item) => {
      const key = item.scenario;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([scenario, entries]) => {
        const sorted = entries
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3)
          .reverse();

        const scores = sorted.map((item) => parseFloat(item.seo_metrics) || 0);
        const currentScore = scores[scores.length - 1];
        const trend = currentScore - scores[0];

        return {
          scenario,
          entries: sorted,
          currentScore,
          trend,
        };
      })
      .sort((a, b) => {
        const { key, order } = sortConfig;
        const multiplier = order === "asc" ? 1 : -1;

        if (key === "score") {
          return (a.currentScore - b.currentScore) * multiplier;
        } else {
          return (a.trend - b.trend) * multiplier;
        }
      });
  };

  const processedScenarios = processData();

  const getColumnCount = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1200) return 2;
    return processedScenarios.length <= 4
      ? 1
      : processedScenarios.length <= 9
      ? 2
      : 3;
  };

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [processedScenarios.length]);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const getScoreColor = (score) => {
    if (score >= 90) return theme === "light" ? "#22c55e" : "#4ade80";
    if (score >= 70) return theme === "light" ? "#3b82f6" : "#60a5fa";
    if (score >= 50) return theme === "light" ? "#f97316" : "#fb923c";
    return theme === "light" ? "#ef4444" : "#f87171";
  };

  const sparklineOptions = (scenarioData) => ({
    chart: {
      type: "line",
      height: 30,
      width: 80,
      backgroundColor: "transparent",
      margin: [2, 0, 2, 0],
      style: {
        overflow: "visible",
      },
    },
    title: null,
    credits: { enabled: false },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
      min:
        Math.min(
          ...scenarioData.entries.map((e) => parseFloat(e.seo_metrics))
        ) - 5,
      max:
        Math.max(
          ...scenarioData.entries.map((e) => parseFloat(e.seo_metrics))
        ) + 5,
    },
    tooltip: {
      hideDelay: 0,
      outside: true,
      shared: true,
      backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
      style: {
        color: theme === "light" ? "#1e293b" : "#e2e8f0",
      },
      formatter: function () {
        const points = this.points || [this];
        const point = points[0];
        const index = point.index;
        const entry = scenarioData.entries[index];

        return `
          <div style="font-weight: 600; margin-bottom: 4px">
            ${scenarioData.scenario}
          </div>
          <div>
            <span style="color:${point.color}">●</span> 
            Run ${index + 1}: <b>${point.y.toFixed(1)}%</b>
          </div>
          <div style="font-size: 0.8em; color: ${
            theme === "light" ? "#64748b" : "#94a3b8"
          }">
            ${new Date(entry.created_at).toLocaleDateString()}
          </div>
        `;
      },
    },
    legend: { enabled: false },
    plotOptions: {
      series: {
        animation: false,
        lineWidth: 2,
        marker: {
          enabled: true,
          radius: 3,
        },
        states: {
          hover: {
            lineWidth: 2,
          },
        },
      },
    },
    series: [
      {
        data: scenarioData.entries.map((e) => parseFloat(e.seo_metrics)),
        color:
          scenarioData.trend > 0
            ? theme === "light"
              ? "#22c55e"
              : "#4ade80"
            : theme === "light"
            ? "#ef4444"
            : "#f87171",
      },
    ],
  });

  const SortButton = ({ type, label, order }) => (
    <button
      onClick={() => setSortConfig({ key: type, order })}
      style={{
        background:
          sortConfig.key === type && sortConfig.order === order
            ? theme === "light"
              ? "#e2e8f0"
              : "#374151"
            : "transparent",
        border: "none",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        cursor: "pointer",
        color: theme === "light" ? "#475569" : "#94a3b8",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {label} {order === "asc" ? "↑" : "↓"}
    </button>
  );

  const deviceTypes = [...new Set(allData.map((d) => d.device))];
  const scenariosPerColumn = Math.ceil(processedScenarios.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    processedScenarios.slice(
      i * scenariosPerColumn,
      (i + 1) * scenariosPerColumn
    )
  );

  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      style={{
        padding: "20px",
        color: theme === "light" ? "#1e293b" : "#e2e8f0",
      }}
    >
      {/* Sort Controls */}
      <div
        style={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: "8px",
          marginBottom: "16px",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: isSmallScreen ? "stretch" : "center",
            gap: "8px",
            backgroundColor: theme === "light" ? "white" : "#1f2937",
            padding: "8px",
            borderRadius: "6px",
            boxShadow:
              theme === "light"
                ? "0 1px 2px rgba(0,0,0,0.05)"
                : "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: theme === "light" ? "#64748b" : "#94a3b8",
              marginBottom: isSmallScreen ? "4px" : "0",
            }}
          >
            Sort by:
          </span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isSmallScreen
                ? "1fr 1fr"
                : "auto auto auto auto",
              gap: "4px",
            }}
          >
            <SortButton type="score" label="Lowest Score" order="asc" />
            <SortButton type="score" label="Highest Score" order="desc" />
            <SortButton type="trend" label="Most Declining" order="asc" />
            <SortButton type="trend" label="Most Improving" order="desc" />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap: isSmallScreen ? "12px" : "20px",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        {columns.map((columnScenarios, columnIndex) => (
          <div
            key={columnIndex}
            style={{
              backgroundColor: theme === "light" ? "white" : "#1f2937",
              borderRadius: "8px",
              boxShadow:
                theme === "light"
                  ? "0 1px 3px rgba(0,0,0,0.1)"
                  : "0 1px 3px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isSmallScreen
                  ? "minmax(0, 1fr) auto"
                  : "3fr 80px 120px",
                gap: isSmallScreen ? "8px" : "12px",
                padding: isSmallScreen ? "8px 12px" : "12px 16px",
                backgroundColor: theme === "light" ? "#f8fafc" : "#111827",
                borderBottom: `1px solid ${
                  theme === "light" ? "#e2e8f0" : "#374151"
                }`,
                fontWeight: "600",
                color: theme === "light" ? "#475569" : "#94a3b8",
              }}
            >
              {isSmallScreen ? (
                <div>Page</div>
              ) : (
                <>
                  <div>Page</div>
                  <div style={{ textAlign: "center" }}>Latest Score</div>
                  <div style={{ textAlign: "center" }}>Trend</div>
                </>
              )}
            </div>

            {/* Rows */}
            {columnScenarios.map((scenarioData) => (
              <div
                key={scenarioData.scenario}
                style={{
                  display: "grid",
                  gridTemplateColumns: isSmallScreen
                    ? "minmax(0, 1fr) auto"
                    : "3fr 80px 120px",
                  gap: isSmallScreen ? "8px" : "12px",
                  padding: isSmallScreen ? "8px 12px" : "12px 16px",
                  borderBottom: `1px solid ${
                    theme === "light" ? "#e2e8f0" : "#374151"
                  }`,
                  alignItems: "center",
                  backgroundColor:
                    scenarioData.currentScore < 70
                      ? theme === "light"
                        ? "#fff1f2"
                        : "#450a0a"
                      : theme === "light"
                      ? "white"
                      : "#1f2937",
                }}
              >
                <div>
                  {/* Page Name */}
                  <div
                    style={{
                      fontSize: isSmallScreen ? "12px" : "13px",
                      fontWeight: "500",
                      wordBreak: "break-word",
                      display: "-webkit-box",
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.4",
                      minHeight: "2.8em",
                      margin: "4px 0",
                    }}
                  >
                    {scenarioData.scenario}
                  </div>

                  {isSmallScreen && (
                    <div
                      style={{
                        fontSize: "11px",
                        color:
                          scenarioData.trend >= 0
                            ? theme === "light"
                              ? "#22c55e"
                              : "#4ade80"
                            : theme === "light"
                            ? "#ef4444"
                            : "#f87171",
                        marginTop: "2px",
                      }}
                    >
                      {scenarioData.trend > 0 ? "↑" : "↓"}{" "}
                      {Math.abs(scenarioData.trend).toFixed(1)}%
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {/* Current Score */}
                  <div
                    style={{
                      fontSize: isSmallScreen ? "13px" : "14px",
                      fontWeight: "600",
                      color: getScoreColor(scenarioData.currentScore),
                      textAlign: "center",
                      alignSelf: "center",
                      padding: "4px 0",
                    }}
                  >
                    {scenarioData.currentScore.toFixed(0)}%
                  </div>

                  {/* Sparkline - Only show on larger screens */}
                  {!isSmallScreen && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        padding: "4px 0",
                      }}
                    >
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={sparklineOptions(scenarioData)}
                      />
                      <div
                        style={{
                          marginLeft: "4px",
                          fontSize: "11px",
                          fontWeight: "500",
                          color:
                            scenarioData.trend >= 0
                              ? theme === "light"
                                ? "#22c55e"
                                : "#4ade80"
                              : theme === "light"
                              ? "#ef4444"
                              : "#f87171",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {scenarioData.trend > 0 ? "↑" : "↓"}{" "}
                        {Math.abs(scenarioData.trend).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEOChart;