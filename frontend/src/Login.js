import React, { useState } from "react";
import {
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Add axios to handle the API requests

const theme = createTheme({
  palette: {
    background: {
      default: "#E3F2FD", // Light blue background
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json", // Ensure Content-Type is set
          },
        }
      );

      if (response.status === 200) {
        // Handle successful login
        console.log("Login successful", response.data);
        navigate("/Admin Dashboard"); // Redirect to the dashboard
      }
    } catch (error) {
      // Handle error response
      if (error.response && error.response.status === 401) {
        alert("Invalid email or password.");
      } else {
        setError("An error occurred. Please try again.");
      }
      setOpenSnackbar(true);
    }
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
            label="Email"
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      {/* Snackbar for error message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Login;
