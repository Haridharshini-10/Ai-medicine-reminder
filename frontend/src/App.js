import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Register from "./Register";
import Login from "./Login";
import PersistentDrawerLeft from "./Sidebar";
import AddMedicineForm from "./AddMedicineForm";
import AddHospitalForm from "./AddHospitalForm";
import AddPatientForm from "./AddPatientForm";
import ViewHospitals from "./ViewHospitals";
import EditHospital from "./EditHospital";

const AppContent = () => {
  const location = useLocation();

  // Define routes where the Navbar should NOT appear
  const noNavbarRoutes = ["/register", "/", "/side", "/add-medicine", "/add-hospital", "/add-patient"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      {/* Route definitions */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/side" element={<PersistentDrawerLeft />} />
        
        {/* Other routes */}
        <Route path="/add-medicine" element={<AddMedicineForm />} />
        <Route path="/add-hospital" element={<AddHospitalForm />} />
        <Route path="/add-patient" element={<AddPatientForm />} />
        <Route path="/view-hospital" element={<ViewHospitals />} />
        <Route path="/edit-hospital" element={<EditHospital />} />
        
      </Routes>
    </>
  );
};

const SideContent = () => {
  const location = useLocation();

  // Routes where PersistentDrawerLeft sidebar should NOT appear
  const noSidebarRoutes = ['/register',  '/'];

  return (
    <>
      {/* Conditionally render PersistentDrawerLeft */}
      {!noSidebarRoutes.includes(location.pathname) && <PersistentDrawerLeft />}
    </>
  );
}

function App() {
  return (
    <Router>
      {/* Main Content Area */}
      <AppContent />
      
      {/* Sidebar (Persistent Drawer) Area */}
      <SideContent />
    </Router>
  );
}

export default App;
