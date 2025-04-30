// Update your BrandTestCharts.jsx component with this code:

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const BrandTestCharts = ({ data }) => {
  // Process data to group by brand and calculate pass/fail counts
  const processData = (rawData) => {
    const brands = {};

    rawData.forEach((item) => {
      if (!brands[item.brand]) {
        brands[item.brand] = { pass: 0, fail: 0 };
      }
      if (item.status === "passed") {
        brands[item.brand].pass++;
      } else if (item.status === "failed") {
        brands[item.brand].fail++;
      }
    });

    return brands;
  };

  // Generate chart options for each brand
  const generateChartOptions = (brandName, brandData) => {
    return {
      chart: {
        type: "column",
        height: 300,
      },
      title: {
        text: `${brandName} Test Results`,
      },
      xAxis: {
        categories: ["Pass", "Fail"],
        title: {
          text: "Test Status",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Number of Tests",
        },
        allowDecimals: false,
      },
      plotOptions: {
        column: {
          colorByPoint: true,
          dataLabels: {
            enabled: true,
            format: "{point.y}",
          },
        },
      },
      colors: ["#4CAF50", "#F44336"], // Green for pass, red for fail
      series: [
        {
          name: "Tests",
          data: [
            {
              name: "Pass",
              y: brandData.pass,
              color: "#4CAF50",
            },
            {
              name: "Fail",
              y: brandData.fail,
              color: "#F44336",
            },
          ],
          showInLegend: false,
        },
      ],
      credits: {
        enabled: false,
      },
    };
  };

  const brandData = processData(data);
  const brandNames = Object.keys(brandData);

  return (
    <div
      className="brand-charts-container"
      //   style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
    >
      {brandNames.map((brand) => (
        <div
          key={brand}
          className="brand-chart"
          style={{ flex: "1 1 300px", minWidth: "300px" }}
        >
          <HighchartsReact
            highcharts={Highcharts}
            options={generateChartOptions(brand, brandData[brand])}
          />
        </div>
      ))}
    </div>
  );
};

export default BrandTestCharts;
