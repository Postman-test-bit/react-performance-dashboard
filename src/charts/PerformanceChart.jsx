// src/charts/PerformanceChart.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  Text,
} from "recharts";
import FilterContainer from "../components/FilterContainer";
import ChartContainer from "../components/ChartContainer";

// Custom YAxis tick to handle text truncation
const CustomYAxisTick = ({ x, y, payload, theme }) => {
  const maxLength = 20; // Maximum characters before truncation
  let displayValue = payload.value;

  if (displayValue.length > maxLength) {
    displayValue = displayValue.substring(0, maxLength) + "...";
  }

  return (
    <Text
      x={x}
      y={y}
      fill={theme === "dark" ? "#fff" : "#333"}
      textAnchor="end"
      verticalAnchor="middle"
      fontSize={12}
    >
      {displayValue}
    </Text>
  );
};

const CustomTooltip = ({ active, payload, label, tooltipData, theme }) => {
  if (active && payload && payload.length && tooltipData[label]) {
    const runs = tooltipData[label];
    return (
      <div
        style={{
          backgroundColor: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#333",
          border: "1px solid #6a11cb",
          padding: "10px",
        }}
      >
        <strong>{label}</strong>
        {runs.map((run, index) => (
          <div key={index}>
            Run {index + 1} ({run.date}): {run.score}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PerformanceChart = ({ data, allData, theme }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [deviceFilter, setDeviceFilter] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");

  const deviceTypes = [...new Set(allData.map((d) => d.device))];

  useEffect(() => {
    applyFilters();
  }, [deviceFilter, performanceFilter, data]);

  const applyFilters = () => {
    let filtered = [...data];

    if (deviceFilter !== "All") {
      filtered = filtered.filter((d) => d.device === deviceFilter);
    }

    if (performanceFilter !== "All") {
      let [min, max] = performanceFilter.split("-").map(Number);
      if (min > max) [min, max] = [max, min];
      filtered = filtered.filter(
        (d) => d.performance_metrics >= min && d.performance_metrics <= max
      );
    }

    setFilteredData(filtered);
  };

  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const latestTests = {};
  const latestTestsTooltip = {};

  sortedData.forEach((d) => {
    if (!latestTests[d.scenario]) latestTests[d.scenario] = [];
    if (latestTests[d.scenario].length < 3) latestTests[d.scenario].push(d);
  });

  allData.forEach((d) => {
    if (!latestTestsTooltip[d.scenario]) latestTestsTooltip[d.scenario] = [];
    if (latestTestsTooltip[d.scenario].length < 3)
      latestTestsTooltip[d.scenario].push(d);
  });

  const testNames = Object.keys(latestTests);
  const barData = testNames.map((test) => {
    const score = latestTests[test][0].performance_metrics;
    return {
      name: test,
      score,
      fill:
        score >= 80
          ? "rgb(0, 190, 0)"
          : score >= 60
          ? "rgba(255, 159, 64, 0.8)"
          : "rgb(190, 0, 0)",
    };
  });

  const tooltipData = {};
  testNames.forEach((test) => {
    tooltipData[test] = latestTestsTooltip[test]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((run) => ({
        date: new Date(run.created_at).toLocaleDateString(),
        score: run.performance_metrics,
      }));
  });

  const filters = (
    <FilterContainer
      deviceTypes={deviceTypes}
      selectedDevice={deviceFilter}
      onDeviceChange={setDeviceFilter}
      selectedValue={performanceFilter}
      onValueChange={setPerformanceFilter}
      valueOptions={[
        { value: "All", label: "All" },
        { value: "100-80", label: "100-80" },
        { value: "79-60", label: "79-60" },
        { value: "59-0", label: "59-0" },
      ]}
      valueLabel="Filter by Performance:"
    />
  );

  return (
    <ChartContainer title="Performance for Last 3 Runs" filters={filters}>
      <div
        style={{
          width: "100%",
          height: `${Math.max(400, barData.length * 40)}px`,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: theme === "dark" ? "#fff" : "#333" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={(props) => <CustomYAxisTick {...props} theme={theme} />}
              tickLine={false}
            />
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  {...props}
                  tooltipData={tooltipData}
                  theme={theme}
                />
              )}
            />
            <Bar dataKey="score" isAnimationActive={false}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="score"
                position="right"
                style={{
                  fill: theme === "dark" ? "#fff" : "#333",
                  fontWeight: "bold",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default PerformanceChart;