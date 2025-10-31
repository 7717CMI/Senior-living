import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { tokens } from "../theme";

function DemoNotice() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" 
          ? "rgba(244, 67, 54, 0.15)" 
          : "rgba(255, 152, 0, 0.15)",
        border: `2px solid ${theme.palette.mode === "dark" ? "#f44336" : "#ff9800"}`,
        padding: "20px 30px",
        borderRadius: "12px",
        mb: "30px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow: theme.palette.mode === "dark" 
          ? "0 4px 12px rgba(244, 67, 54, 0.3)" 
          : "0 4px 12px rgba(255, 152, 0, 0.3)",
      }}
    >
      <WarningAmberOutlinedIcon 
        sx={{ 
          fontSize: "42px", 
          color: theme.palette.mode === "dark" ? "#ff5252" : "#ff6f00",
          flexShrink: 0
        }} 
      />
      <Box>
        <Typography 
          variant="h4" 
          sx={{ 
            color: theme.palette.mode === "dark" ? "#ff5252" : "#ff6f00",
            fontWeight: "bold",
            mb: "5px"
          }}
        >
          ⚠ DEMO DATASET - FOR ILLUSTRATION PURPOSES ONLY
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.palette.mode === "dark" ? colors.grey[300] : colors.grey[700],
            lineHeight: 1.4
          }}
        >
          This dashboard uses synthetic data for demonstration purposes. No real-world data or actual vaccine market information is represented in this application.
        </Typography>
      </Box>
    </Box>
  );
}

export default DemoNotice;

