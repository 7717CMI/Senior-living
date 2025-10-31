import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function ChartInstructions() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        padding: "15px 20px",
        borderRadius: "8px",
        mb: "20px",
        display: "flex",
        alignItems: "center",
        gap: 2,
        border: `1px solid ${colors.blueAccent[500]}`,
      }}
    >
      <InfoOutlinedIcon 
        sx={{ 
          color: colors.blueAccent[500], 
          fontSize: "28px",
          flexShrink: 0
        }} 
      />
      <Box>
        <Typography
          variant="h6"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ mb: 0.5 }}
        >
          How to View Charts
        </Typography>
        <Typography
          variant="body2"
          color={colors.grey[300]}
          sx={{ lineHeight: 1.6 }}
        >
          <strong>Hover</strong> over any chart element to see detailed values and percentages • 
          <strong> Click</strong> on KPI cards to view pie chart breakdowns • 
          Use <strong>filters</strong> above to customize the data view • 
          All values are formatted (B=Billion, M=Million, K=Thousand)
        </Typography>
      </Box>
    </Box>
  );
}

export default ChartInstructions;

