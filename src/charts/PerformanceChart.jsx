import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Required for waterfall support
require("highcharts/modules/stock")(Highcharts);
require("highcharts/modules/waterfall")(Highcharts);

const PerformanceChart = ({ data }) => {
  // Group data by scenario
  const grouped = data.reduce((acc, item) => {
    const key = item.scenario;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const chartBlocks = Object.entries(grouped).map(([scenario, entries]) => {
    const sorted = entries.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    const chartData = sorted.map((item) => ({
      name: new Date(item.created_at).toLocaleDateString(),
      y: item.performance_metrics,
    }));

    const options = {
      chart: {
        type: "waterfall",
        height: 300,
      },
      title: {
        text: scenario,
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        title: {
          text: "Performance",
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        pointFormat: "Performance: <b>{point.y}</b><br/>",
      },
      series: [
        {
          upColor: "#90ed7d",
          color: "#f45b5b",
          data: chartData,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
            },
            formatter: function () {
              return `${this.y}`;
            },
          },
        },
      ],
    };

    return (
      <div key={scenario} style={{ marginBottom: "40px" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  });

  return <div style={{ padding: "20px" }}>{chartBlocks}</div>;
};

export default PerformanceChart;
