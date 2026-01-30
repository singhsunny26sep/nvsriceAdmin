import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LineChart = ({ 
  data = [], 
  title = "Line Chart",
  xAxisKey = "name",
  lines = [{ key: "value", color: "#16a34a", name: "Value" }],
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  strokeWidth = 2,
  dot = true
}) => {
  // Default data if none provided
  const defaultData = [
    { name: 'Jan', value: 4000, users: 2400, revenue: 3400 },
    { name: 'Feb', value: 3000, users: 1398, revenue: 2300 },
    { name: 'Mar', value: 2000, users: 9800, revenue: 1200 },
    { name: 'Apr', value: 2780, users: 3908, revenue: 4300 },
    { name: 'May', value: 1890, users: 4800, revenue: 2100 },
    { name: 'Jun', value: 2390, users: 3800, revenue: 3800 },
    { name: 'Jul', value: 3490, users: 4300, revenue: 2900 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  // Auto-detect lines if not provided
  const autoLines = lines.length === 1 && lines[0].key === "value" && chartData.length > 0
    ? Object.keys(chartData[0]).filter(key => 
        key !== xAxisKey && typeof chartData[0][key] === 'number'
      ).map((key, index) => ({
        key,
        color: index === 0 ? "#16a34a" : index === 1 ? "#059669" : "#10b981",
        name: key.charAt(0).toUpperCase() + key.slice(1)
      }))
    : lines;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name || entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xAxisKey}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend />}
          
          {autoLines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={strokeWidth}
              dot={dot ? { fill: line.color, strokeWidth: 2, r: 4 } : false}
              activeDot={{ r: 6, stroke: line.color, strokeWidth: 2, fill: '#fff' }}
              name={line.name}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Predefined chart variants
export const GrowthChart = ({ data }) => (
  <LineChart
    data={data}
    title="Growth Trends"
    xAxisKey="month"
    lines={[
      { key: "users", color: "#16a34a", name: "Users" },
      { key: "revenue", color: "#059669", name: "Revenue" }
    ]}
    height={350}
    showLegend={true}
  />
);

export const PerformanceChart = ({ data }) => (
  <LineChart
    data={data}
    title="Performance Metrics"
    xAxisKey="time"
    lines={[
      { key: "cpu", color: "#dc2626", name: "CPU Usage" },
      { key: "memory", color: "#2563eb", name: "Memory Usage" },
      { key: "network", color: "#16a34a", name: "Network Usage" }
    ]}
    height={300}
    showLegend={true}
    dot={false}
  />
);

export const AnalyticsChart = ({ data }) => (
  <LineChart
    data={data}
    title="Analytics Overview"
    xAxisKey="date"
    lines={[
      { key: "visitors", color: "#16a34a", name: "Visitors" },
      { key: "pageviews", color: "#059669", name: "Page Views" }
    ]}
    height={400}
    showLegend={true}
  />
);

export default LineChart;