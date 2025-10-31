import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { formatNumber } from "../utils/dataGenerator";

function LineChart({ data, dataKeys, nameKey, colors = ["#8884d8", "#82ca9d"], xAxisLabel, yAxisLabel, isVolume = false }) {
  const theme = useTheme();
  const tokenColors = tokens(theme.palette.mode);

  // Custom tooltip for better clarity
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const valueLabel = isVolume ? "Units" : (yAxisLabel || "Value");
      
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
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', fontSize: '13px', color: entry.color }}>
              {entry.name}: <strong>{formatNumber(entry.value)}</strong> {isVolume ? "units" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 60,
          bottom: 100,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={tokenColors.grey[800]} />
        <XAxis 
          dataKey={nameKey} 
          stroke={tokenColors.grey[100]}
          style={{ fontSize: "12px" }}
          angle={-45}
          textAnchor="end"
          height={80}
          label={{
            value: xAxisLabel || nameKey,
            position: "insideBottom",
            offset: -15,
            style: { 
              fontSize: "14px", 
              fontWeight: "bold",
              fill: tokenColors.grey[100] 
            }
          }}
        />
        <YAxis 
          stroke={tokenColors.grey[100]}
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => formatNumber(value)}
          label={{
            value: yAxisLabel || "Value",
            angle: -90,
            position: "insideLeft",
            offset: 10,
            style: { 
              fontSize: "14px", 
              fontWeight: "bold",
              fill: tokenColors.grey[100],
              textAnchor: "middle"
            }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index] || colors[0]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;