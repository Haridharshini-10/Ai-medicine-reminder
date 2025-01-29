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
import EditPatientForm from "./Editpatient";
import ViewMedicines from "./Viewmedicine";
import EditMedicine from "./Editmedicine";
import ViewPatients from "./Viewpatient";
import AddDoctorForm from "./AddDoctorForm";
import ViewDoctors from "./ViewDoctor";
import EditDoctor from "./EditDoctor";
import AddTreatmentForm from "./AddTreamtmentForm";
import ViewTreatment from "./ViewTreaments";
import EditTreatment from "./EditTreatment";
import AddReminderForm from "./AddReminderForm";
import ViewReminders from "./ViewReminders";
import EditReminder from "./EditReminder";

const AppContent = () => {
  const location = useLocation();

  // Define routes where the Navbar should NOT appear
  const noNavbarRoutes = ["/register", "/", "/side", "/add-medicine", "/add-hospital", "/add-patient","/add-doctor"];

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
        <Route path="/view-patients" element={<ViewPatients />} />
        <Route path="/edit-patients" element={<EditPatientForm />} />
        <Route path="/view-medicines" element={<ViewMedicines/>} />
        <Route path="/edit-medicines" element={<EditMedicine />} />
        <Route path="/edit-hospital/:hospitalId" element={<EditHospital />} />
        <Route path="/edit-patients/:patientId" element={<EditPatientForm/>} />
        <Route path="/add-doctor" element={<AddDoctorForm/>}/>
        <Route path="/view-doctors"element={<ViewDoctors/>}/>
        <Route path="/edit-doctor"element={<EditDoctor/>}/>
        <Route path="/edit-doctor/:doctorId" element={<EditDoctor />} />
        <Route path = "/edit-medicines/:medicineId" element = {<EditMedicine />}/>
        <Route path = "/add-prescribed-medicine" element = {<AddTreatmentForm />}/>
        <Route path = "/view-treatments" element = {<ViewTreatment />} />
        <Route path = "/edit-prescribed-medicine/:treatmentId" element = {<EditTreatment />} />
        <Route path = "/add-reminder" element = {<AddReminderForm />} />
        <Route path = "/view-reminder" element = {<ViewReminders />} />
        <Route path = "/edit-reminders/:reminderId" element = {<EditReminder />} />
        



        
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