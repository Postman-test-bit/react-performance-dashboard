import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

const DeviceChart = ({ data }) => {
  // Process data to calculate average performance per device
  const processData = () => {
    const devices = {};
    data.forEach((d) => {
      if (!devices[d.device]) {
        devices[d.device] = { count: 0, performance_metrics: 0 };
      }
      devices[d.device].count++;
      devices[d.device].performance_metrics += d.performance_metrics;
    });

    return Object.keys(devices).map((device) => ({
      device,
      performance: Math.round(
        devices[device].performance_metrics / devices[device].count
      ),
    }));
  };

  const chartData = processData();

  return (
    <div className="chart-container">
      <h2>Average Performance by Device</h2>

      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="horizontal" // Changed to horizontal for vertical bars
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="device"
              tick={{ fontSize: window.innerWidth < 480 ? 10 : 14 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: window.innerWidth < 480 ? 10 : 14 }}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Average Performance"]}
              labelFormatter={(label) => `Device: ${label}`}
            />
            <Bar
              dataKey="performance"
              name="Average Performance"
              barSize={window.innerWidth < 480 ? 60 : 100} // Responsive bar thickness
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="rgb(88, 62, 37)" />
              ))}
              <LabelList
                dataKey="performance"
                position="middle"
                formatter={(value) => `${value}%`}
                fill="#fff"
                fontSize={14}
                fontWeight="bold"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeviceChart;
