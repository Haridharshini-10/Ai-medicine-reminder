import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import PersistentDrawerLeft  from "./Sidebar";

const AppContent = () => {
  const location = useLocation();

  // Define routes where the Navbar should NOT appear
  const noNavbarRoutes = ["/register", "/login"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      {/* Route definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/side" element={<PersistentDrawerLeft />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
