import React from "react";
import MetricChartTemplate from "./MetricChartTemplate";

const SEOChart = ({ data, allData, theme }) => (
  <MetricChartTemplate
    data={data}
    allData={allData}
    theme={theme}
    title="SEO for Last 3 Runs"
    metricKey="seo_metrics"
    valueLabel="Filter by SEO:"
  />
);

export default SEOChart;
