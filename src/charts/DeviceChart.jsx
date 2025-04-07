import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const DeviceChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const devices = {};
    data.forEach((d) => {
      if (!devices[d.device]) {
        devices[d.device] = { count: 0, performance_metrics: 0 };
      }
      devices[d.device].count++;
      devices[d.device].performance_metrics += d.performance_metrics;
    });

    const deviceLabels = Object.keys(devices);
    const deviceData = deviceLabels.map((d) =>
      Math.round(devices[d].performance_metrics / devices[d].count)
    );

    const ctx = chartRef.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: deviceLabels,
        datasets: [
          {
            label: "Avg Performance",
            data: deviceData,
            backgroundColor: "rgb(88, 62, 37)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              font: {
                size: window.innerWidth < 480 ? 10 : 14,
              },
              maxRotation: 0,
              minRotation: 0,
            },
          },
          x: {
            ticks: {
              font: {
                size: window.innerWidth < 480 ? 10 : 14,
              },
            },
            beginAtZero: true,
          },
        },
        elements: {
          bar: {
            barThickness: window.innerWidth < 480 ? 10 : 20,
          },
        },
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Device Performance Comparison" },
          datalabels: {
            color: "#fff",
            font: { weight: "bold", size: 14 },
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    return () => chart.destroy();
  }, [data]);

  return (
    <div className="chart-container">
      <h2>Average Performance by Device</h2>
      <canvas id="deviceChart" ref={chartRef}></canvas>
    </div>
  );
};

export default DeviceChart;
