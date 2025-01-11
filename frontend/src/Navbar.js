import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#2C3E50", // Grey-blue background
        color: "#ECF0F1", // Light text color
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Navbar
        </Typography>
        <Button sx={{ color: "#ECF0F1" }} component={Link} to="/">
          Home
        </Button>
        <Button sx={{ color: "#ECF0F1" }} component={Link} to="/register">
          Register
        </Button>
        <Button sx={{ color: "#ECF0F1" }} component={Link} to="/login">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
