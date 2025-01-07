import React from "react";
import { CssBaseline, Box, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#E3F2FD", // Light blue background
    },
  },
});

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box textAlign="center" mt={4}>
        <Typography variant="h1">AI MEDICINE REMINDER</Typography>
        <Box mt={4}>
          <img 
            src="/image/background.jpg" 
            alt="Background" 
            style={{ maxWidth: "100%", height: "auto" }} 
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;


