import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const BarChart = ({ 
  data = [], 
  title = "Bar Chart",
  xAxisKey = "name",
  yAxisKey = "value",
  color = "#16a34a",
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false
}) => {
  // Default data if none provided
  const defaultData = [
    { name: 'Jan', value: 400, users: 240 },
    { name: 'Feb', value: 300, users: 198 },
    { name: 'Mar', value: 200, users: 180 },
    { name: 'Apr', value: 278, users: 208 },
    { name: 'May', value: 189, users: 198 },
    { name: 'Jun', value: 239, users: 180 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
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
        <RechartsBarChart
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
          
          <Bar 
            dataKey={yAxisKey} 
            fill={color}
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity duration-200"
          />
          
          {/* Additional bars if data contains more keys */}
          {chartData.length > 0 && Object.keys(chartData[0]).filter(key => 
            key !== xAxisKey && key !== yAxisKey && typeof chartData[0][key] === 'number'
          ).map((key, index) => (
            <Bar 
              key={key}
              dataKey={key} 
              fill={index === 0 ? "#059669" : "#10b981"}
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity duration-200"
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Predefined chart variants
export const UserRegistrationChart = ({ data }) => (
  <BarChart
    data={data}
    title="User Registrations"
    xAxisKey="month"
    yAxisKey="registrations"
    color="#16a34a"
    height={350}
  />
);

export const RevenueChart = ({ data }) => (
  <BarChart
    data={data}
    title="Monthly Revenue"
    xAxisKey="month"
    yAxisKey="revenue"
    color="#059669"
    height={350}
  />
);

export const ActivityChart = ({ data }) => (
  <BarChart
    data={data}
    title="User Activity"
    xAxisKey="day"
    yAxisKey="activity"
    color="#10b981"
    height={300}
    showLegend={true}
  />
);

export default BarChart;