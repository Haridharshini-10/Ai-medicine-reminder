import React, {  } from "react";
import {
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    background: {
      default: "#E3F2FD", // Light blue background
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
 
  const handleLogin = () => {
    navigate("/Admin Dashboard");
  };

  const handleSignUp = () => {
    navigate("/register");
  };



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background: `linear-gradient(135deg, rgba(227,242,253,1) 0%, rgba(144,202,249,1) 100%)`,
        }}
      >
        <Box
          p={4}
          borderRadius={4}
          boxShadow={4}
          bgcolor="white"
          width="400px"
          textAlign="center"
        >
          <Typography variant="h4" gutterBottom>
            AI Medicine Reminder
          </Typography>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Or
          </Typography>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={handleSignUp}
              underline="none"
            >
              Sign up
            </Link>
          </Typography>
        </Box>

       
      </Box>
    </ThemeProvider>
  );
};

export default Login;
