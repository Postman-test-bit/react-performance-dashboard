// components/PieChart.jsx

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChart = ({ passed, failed, onSliceClick }) => {
  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: "Visual Test Result Breakdown",
      style: {
        color: "var(--text-primary)",
        fontWeight: "600",
        fontSize: "1.25rem",
      },
    },
    subtitle: {
      text: 'Source: <a href="https://yourcompany.test-reports.com" target="_blank">Test Reports</a>',
      style: {
        color: "var(--text-secondary)",
      },
    },
    tooltip: {
      valueSuffix: " test(s)",
      backgroundColor: "var(--card-bg)",
      borderColor: "var(--border-color)",
      style: {
        color: "var(--text-primary)",
      },
    },
    legend: {
      itemStyle: {
        color: "var(--text-primary)",
      },
      itemHoverStyle: {
        color: "var(--text-secondary)",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              if (onSliceClick) {
                onSliceClick(this.name);
              }
            },
          },
        },
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            style: {
              fontWeight: "bold",
              color: "var(--text-primary)",
            },
          },
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "1.2em",
              textOutline: "none",
              opacity: 0.7,
              color: "var(--text-primary)",
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 10,
            },
          },
        ],
      },
    },
    series: [
      {
        name: "Tests",
        colorByPoint: true,
        data: [
          {
            name: "Passed",
            y: passed,
            color: "var(--success-color, limegreen)",
            sliced: passed > failed,
            selected: passed > failed,
          },
          {
            name: "Failed",
            y: failed,
            color: "var(--error-color, tomato)",
            sliced: failed >= passed,
            selected: failed >= passed,
          },
        ],
      },
    ],
  };

  return (
    <div className="pie-chart-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart;
