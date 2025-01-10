import React, { useState } from "react";
import { CssBaseline, Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#E3F2FD", // Light blue background
    },
  },
});

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate(); // Hook for navigation

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!username.trim()) newErrors.username = "Username is required.";

    // Email validation
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is not valid.";

    // Password validation
    if (!password.trim()) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters long.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return; // Validate the form before proceeding

    try {
      const response = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Registration successful:", data);
        setSuccessMessage(data.message);
        setTimeout(() => {
          navigate("/login"); // Navigate to the login page after a short delay
        }, 2000); // Delay for 2 seconds to show the success message
      } else {
        console.error("Registration failed:", data.error);
        setErrorMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while registering. Please try again.");
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box sx={{ width: 400, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "white" }}>
          <Typography variant="h5" textAlign="center" mb={2}>
            Register
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Register
            </Button>
          </form>
        </Box>
      </Box>
  
    </ThemeProvider>
  );
};

export default Register;
