import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { formatNumber } from "../utils/dataGenerator";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B9D', '#C44569', '#1B9CFC', '#55E6C1'];

function PieChart({ data, dataKey, nameKey, colors = COLORS, title, isVolume = false }) {
  const theme = useTheme();
  const tokenColors = tokens(theme.palette.mode);

  // Calculate total for percentage calculation
  const total = data.reduce((sum, entry) => sum + (entry[dataKey] || 0), 0);

  // Custom label that shows only the name on the pie slices
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Position labels outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill={tokenColors.grey[100]}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {name}
      </text>
    );
  };

  // Custom tooltip with formatted values
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const value = item.value || 0;
      
      // Calculate percentage: (value / total) * 100
      const percentage = total > 0 ? (value / total) * 100 : 0;
      
      // Determine label based on whether it's volume data
      const valueLabel = isVolume ? "Units" : "Value";
      
      return (
        <div
          style={{
            backgroundColor: tokenColors.primary[400],
            border: `2px solid ${tokenColors.blueAccent[500]}`,
            borderRadius: '8px',
            padding: '12px',
            color: tokenColors.grey[100],
          }}
        >
          <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '0 0 8px 0' }}>
            {item.name}
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}>
            {valueLabel}: <strong>{formatNumber(value)}</strong>
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}>
            Share: <strong>{percentage.toFixed(1)}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        {title && (
          <text
            x="50%"
            y="30"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              fill: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
              textShadow: theme.palette.mode === "dark" ? "0px 1px 2px rgba(0,0,0,0.5)" : "0px 1px 2px rgba(255,255,255,0.5)",
            }}
          >
            {title}
          </text>
        )}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={renderCustomLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export default PieChart;

