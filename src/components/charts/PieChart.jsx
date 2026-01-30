import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PieChart = ({ 
  data = [], 
  title = "Pie Chart",
  nameKey = "name",
  valueKey = "value",
  colors = ["#16a34a", "#059669", "#10b981", "#34d399", "#6ee7b7"],
  height = 300,
  showTooltip = true,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
  showLabels = true
}) => {
  // Default data if none provided
  const defaultData = [
    { name: 'Active Users', value: 400 },
    { name: 'Inactive Users', value: 300 },
    { name: 'Pending Users', value: 200 },
    { name: 'Suspended Users', value: 100 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {`Value: ${data.value}`}
          </p>
          <p className="text-sm text-gray-600">
            {`Percentage: ${((data.value / chartData.reduce((sum, item) => sum + item[valueKey], 0)) * 100).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (!showLabels || percent < 0.05) return null; // Hide labels for slices < 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? CustomLabel : false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend content={<CustomLegend />} />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Predefined chart variants
export const UserStatusChart = ({ data }) => (
  <PieChart
    data={data}
    title="User Status Distribution"
    nameKey="status"
    valueKey="count"
    colors={["#16a34a", "#f59e0b", "#ef4444", "#6b7280"]}
    height={350}
  />
);

export const DonutChart = ({ data, title }) => (
  <PieChart
    data={data}
    title={title || "Donut Chart"}
    innerRadius={40}
    outerRadius={80}
    height={300}
    colors={["#16a34a", "#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"]}
  />
);

export const RegionChart = ({ data }) => (
  <PieChart
    data={data}
    title="Users by Region"
    nameKey="region"
    valueKey="users"
    colors={["#16a34a", "#059669", "#10b981", "#34d399", "#6ee7b7"]}
    height={400}
  />
);

export const DeviceChart = ({ data }) => (
  <DonutChart
    data={data}
    title="Device Usage"
    colors={["#16a34a", "#2563eb", "#dc2626", "#f59e0b"]}
  />
);

export default PieChart;