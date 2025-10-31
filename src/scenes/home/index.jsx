import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import DemoNotice from "../../components/DemoNotice";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";

function Home() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const modules = [
    {
      title: "Epidemiology",
      subtitle: "Disease prevalence and incidence analysis",
      icon: <LocalHospitalOutlinedIcon sx={{ fontSize: "48px" }} />,
      path: "/epidemiology",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Vaccination Rate",
      subtitle: "Coverage and vaccination rate tracking",
      icon: <HealingOutlinedIcon sx={{ fontSize: "48px" }} />,
      path: "/vaccination-rate",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Pricing Analysis",
      subtitle: "Price trends and elasticity insights",
      icon: <AttachMoneyOutlinedIcon sx={{ fontSize: "48px" }} />,
      path: "/pricing",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "CAGR Analysis",
      subtitle: "Growth rates by segments",
      icon: <TrendingUpOutlinedIcon sx={{ fontSize: "48px" }} />,
      path: "/cagr",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      title: "MSA Comparison",
      subtitle: "Market share comparative analysis",
      icon: <PieChartOutlinedIcon sx={{ fontSize: "48px" }} />,
      path: "/msa-comparison",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      title: "Procurement Analysis",
      subtitle: "Public and private procurement tracking",
      icon: <ShoppingCartOutlinedIcon sx={{ fontSize: "48px" }} />,
      path: "/procurement",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
    {
      title: "Brand-Demographic",
      subtitle: "Brand performance by demographics",
      icon: <MedicationOutlinedIcon sx={{ fontSize: "48px" }} />,
      path: "/brand-demographic",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
      title: "FDF Analysis",
      subtitle: "Formulation and ROA performance",
      icon: <ScienceOutlinedIcon sx={{ fontSize: "48px" }} />,
      path: "/fdf",
      gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
    },
  ];

  return (
    <Box m="20px">
      <Box textAlign="center" mb="40px">
        <Typography
          variant="h1"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ mb: "10px" }}
        >
          Global Vaccine Market Analytics Dashboard
        </Typography>
        <Typography variant="h5" color={colors.greenAccent[400]}>
          Comprehensive market intelligence and forecasting analysis | 2021-2035
        </Typography>
      </Box>

      <DemoNotice />

      <Typography variant="h3" color={colors.grey[100]} sx={{ mb: "30px", mt: "30px" }}>
        Select Analysis Module
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
        gap="20px"
        sx={{
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      >
        {modules.map((module) => (
          <Link
            key={module.path}
            to={module.path}
            style={{ textDecoration: "none", height: "100%" }}
          >
            <Box
              sx={{
                backgroundColor: colors.primary[400],
                padding: "30px",
                borderRadius: "12px",
                cursor: "pointer",
                height: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 8px 16px ${colors.primary[600]}`,
                },
              }}
            >
              <Box
                sx={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 16px",
                  background: module.gradient,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {module.icon}
              </Box>
              <Typography
                variant="h4"
                color={colors.grey[100]}
                fontWeight="bold"
                textAlign="center"
                sx={{ mb: "8px" }}
              >
                {module.title}
              </Typography>
              <Typography
                variant="h6"
                color={colors.grey[300]}
                textAlign="center"
              >
                {module.subtitle}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

export default Home;

