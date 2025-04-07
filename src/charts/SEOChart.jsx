// src/charts/SEOChart.jsx
import React, { useEffect, useRef } from "react";
import Chart from "../utils/chartConfig";
import FilterContainer from "../components/FilterContainer";
import ChartContainer from "../components/ChartContainer";

const SEOChart = ({ data, allData, theme }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [filteredData, setFilteredData] = React.useState(data);
  const [deviceFilter, setDeviceFilter] = React.useState("All");
  const [seoFilter, setSeoFilter] = React.useState("All");

  const deviceTypes = [...new Set(allData.map((d) => d.device))];

  useEffect(() => {
    applyFilters();
  }, [deviceFilter, seoFilter, data]);

  const applyFilters = () => {
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

    setFilteredData(filtered);
  };

  useEffect(() => {
    if (filteredData.length === 0 || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

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
    const barData = testNames.map((test) => latestTests[test][0].seo_metrics);

    const tooltipData = testNames.map((test) =>
      latestTestsTooltip[test]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((run) => ({
          date: new Date(run.created_at).toLocaleDateString(),
          score: run.seo_metrics,
        }))
    );

    const barColors = barData.map((score) => {
      if (score >= 80) return "rgb(0, 190, 0)";
      if (score >= 60 && score <= 79) return "rgba(255, 159, 64, 0.8)";
      return "rgb(190, 0, 0)";
    });

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: testNames,
        datasets: [
          {
            label: "Latest SEO",
            data: barData,
            backgroundColor: barColors,
            borderColor: barColors.map((color) => color.replace("0.8", "1")),
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            beginAtZero: true,
            max: 100,
          },
          y: {
            type: "category",
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => {
                const runs = tooltipData[context.dataIndex];
                return runs.map(
                  (run, index) => `Run ${index + 1} (${run.date}): ${run.score}`
                );
              },
            },
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            titleColor: theme === "dark" ? "#fff" : "#333",
            bodyColor: theme === "dark" ? "#fff" : "#333",
            borderColor: "#6a11cb",
            borderWidth: 1,
          },
          legend: { display: false },
          title: {
            display: true,
            text: "SEO for Last 3 Runs",
            color: theme === "dark" ? "#fff" : "#333",
          },
          datalabels: {
            anchor: "end",
            align: (context) =>
              context.dataset.data[context.dataIndex] >= 95 ? "start" : "end",
            color: (context) => {
              if (context.raw >= 90) return "#000";
              return theme === "dark" ? "#fff" : "#333";
            },
            font: { weight: "bold", size: 14 },
            formatter: (value) => value,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [filteredData, theme]);

  const filters = (
    <FilterContainer
      deviceTypes={deviceTypes}
      selectedDevice={deviceFilter}
      onDeviceChange={setDeviceFilter}
      selectedValue={seoFilter}
      onValueChange={setSeoFilter}
      valueOptions={[
        { value: "All", label: "All" },
        { value: "100-80", label: "100-80" },
        { value: "79-60", label: "79-60" },
        { value: "59-0", label: "59-0" },
      ]}
      valueLabel="Filter by SEO:"
    />
  );

  return (
    <ChartContainer title="SEO for Last 3 Runs" filters={filters}>
      <canvas id="seoChart" ref={chartRef}></canvas>
    </ChartContainer>
  );
};

export default SEOChart;
