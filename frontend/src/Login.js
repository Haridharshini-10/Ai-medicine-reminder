import React, { useState } from "react";
import { CssBaseline, Box, TextField, Button, Typography, Alert } from "@mui/material";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // For demo purposes, assuming username is "user" and password is "password"
      if (username === "Hari" && password === "1234") {
        setLoginSuccess(true);
        alert("Login successful!");
        navigate("/side");
      } else {
        setLoginSuccess(false);
        alert("Invalid credentials. Please try again.");
      }
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
            Login
          </Typography>

          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fill out all fields correctly.
            </Alert>
          )}

          <form onSubmit={handleLogin}>
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
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </form>
          {!loginSuccess && username && password && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Invalid username or password.
            </Alert>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
