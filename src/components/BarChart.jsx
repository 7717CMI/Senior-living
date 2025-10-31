import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { formatNumber } from "../utils/dataGenerator";

function BarChart({ data, dataKey, nameKey, color = "#8884d8", xAxisLabel, yAxisLabel, isVolume = false }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Custom tooltip for better clarity
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const valueLabel = isVolume ? "Units" : (yAxisLabel || "Value");
      
      return (
        <div
          style={{
            backgroundColor: colors.primary[400],
            border: `2px solid ${colors.blueAccent[500]}`,
            borderRadius: '8px',
            padding: '12px',
            color: colors.grey[100],
          }}
        >
          <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '0 0 8px 0' }}>
            {label}
          </p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}>
            {valueLabel}: <strong>{formatNumber(value)}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 60,
          bottom: 100,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[800]} />
        <XAxis 
          dataKey={nameKey} 
          stroke={colors.grey[100]}
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
              fill: colors.grey[100] 
            }
          }}
        />
        <YAxis 
          stroke={colors.grey[100]}
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => formatNumber(value)}
          label={{
            value: yAxisLabel || dataKey,
            angle: -90,
            position: "insideLeft",
            offset: 10,
            style: { 
              fontSize: "14px", 
              fontWeight: "bold",
              fill: colors.grey[100],
              textAnchor: "middle"
            }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill={color} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;