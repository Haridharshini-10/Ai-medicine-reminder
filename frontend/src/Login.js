import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  FormHelperText,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  // Redirect if already logged in
  useEffect(() => {
    const loggedInEmail = sessionStorage.getItem("email");
    if (loggedInEmail) {
      navigate("/Admin Dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    // Reset previous errors and success message
    setEmailError("");
    setPasswordError("");
    setSuccessMessage(""); // Reset success message

    // Validation
    let hasError = false;
    if (!email) {
      setEmailError("C'mon, we need an email. What's your email address?");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("That's not an email, genius. Try again.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("No password? Really? Please enter a password.");
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await axios.post(
        "http://localhost:5001/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Save email to session storage
        sessionStorage.setItem("email", email);

        // Show success message
        setSuccessMessage("Login Successful!...");

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/Admin Dashboard");
        }, 1000); // Wait 3 seconds before redirecting
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setPasswordError("Incorrect email or password. Try again, Sherlock.");
      } else {
        setEmailError("Oops, something went wrong. Try again later.");
      }
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
          background: "linear-gradient(135deg, rgba(227,242,253,1) 0%, rgba(144,202,249,1) 100%)",
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
            error={!!emailError}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#E3F2FD", // Light blue background for the entire email field
              },
            }}
          />
          {emailError && (
            <FormHelperText error>{emailError}</FormHelperText>
          )}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"} // Toggle password visibility
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#E3F2FD", // Light blue background for the entire password field
              },
              "& .MuiInputAdornment-root": {
                backgroundColor: "#E3F2FD", // Lighter blue for the eye icon area
                borderRadius: "4px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordError && (
            <FormHelperText error>{passwordError}</FormHelperText>
          )}
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

          {/* Success Message - Inside the Box */}
          {successMessage && (
            <Box mt={2}>
              <Alert severity="success">{successMessage}</Alert>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;