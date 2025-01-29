import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Snackbar,
  Alert,
  MenuItem
} from "@mui/material";

const EditPatient = () => {
  const { patientId } = useParams(); // Get the patientId from the URL
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    patient_name: "",
    hospital_name: "",
    issues: "",
    phone_number: "",
    address: "",
    age: "",
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
    const [hospitals, setHospitals] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5001/hospitals");
        setHospitals(response.data);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setSnackbar({ open: true, message: "Failed to fetch hospitals.", severity: "error" });
      }
    };

    fetchHospitals();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
      [name]: value,
    });
  };

  const districts = [
    "Ariyalur",
    "Chennai",
    "Coimbatore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kanchipuram",
    "Madurai",
    "Nagai",
    "Salem",
    "Tirunelveli",
    "Trichy",
    "Vellore",
    "Villupuram",
    "Virudhunagar",
  ];

  // Fetch patient data when the component loads
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/patients/${patientId}`
        );
        setPatientData(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  // Handle field validation
  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!patientData.patient_name)
      newErrors.patient_name = "Patient name is required";
    if (!patientData.hospital_name)
      newErrors.hospital_name = "Hospital name is required";
    if (!patientData.issues) newErrors.issues = "Issues are required";
    if (!patientData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!phoneRegex.test(patientData.phone_number)) {
      newErrors.phone_number = "Phone number must start with 6-9 and have 10 digits";
    }
    if (!patientData.age || patientData.age <= 0)
      newErrors.age = "Age must be a positive number";
    if (!patientData.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update patient data
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(
        `http://localhost:5001/patients/${patientId}`,
        patientData // Send updated data to the backend
      );

      setOpenSnackbar(true); // Show Snackbar when update is successful
      setTimeout(() => {
        navigate("/view-patients"); // Redirect to the patient list page after 1 second
      }, 1000); // 1-second delay before redirecting
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Backend validation errors
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating patient:", error);
        alert("Failed to update patient. Please try again.");
      }
    }
  };

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height
        backgroundColor: "#ADD8E6", // Light blue background color
        overflow: "hidden", // Prevent scrollbar
      }}
    >
      <Box
        sx={{
          width: "400px",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          maxHeight: "100%", // Ensure it doesn't overflow
          overflowY: "auto", // Allow internal scroll if needed
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          Edit Patient
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <TextField
            label="Patient Name"
            value={patientData.patient_name || ""}
            onChange={(e) =>
              setPatientData({
                ...patientData,
                patient_name: e.target.value,
              })
            }
            error={!!errors.patient_name}
            helperText={errors.patient_name}
          />
          <FormControl fullWidth>
               <TextField
                      select
                      fullWidth
                      label="Hospital"
                      name="hospital_name"
                      value={patientData.hospital_name}
                      onChange={handleChange}
                      error={!!errors.hospital_name}
                      helperText={errors.hospital_name || "Select a hospital"}
                      margin="normal"
                    >
                      {hospitals.map((hospital) => (
                        <MenuItem key={hospital.hospital_id} value={hospital.hospital_name}>
                          {hospital.hospital_name}
                        </MenuItem>
                      ))}
                    </TextField>
          </FormControl>
          <TextField
            label="Issues"
            value={patientData.issues || ""}
            onChange={(e) =>
              setPatientData({
                ...patientData,
                issues: e.target.value,
              })
            }
            error={!!errors.issues}
            helperText={errors.issues}
          />
          <TextField
            label="Phone Number"
            value={patientData.phone_number || ""}
            onChange={(e) =>
              setPatientData({
                ...patientData,
                phone_number: e.target.value,
              })
            }
            error={!!errors.phone_number}
            helperText={errors.phone_number}
          />
          <FormControl fullWidth>
            <TextField
              select
              label="Address"
              value={patientData.address || ""}
              onChange={(e) =>
                setPatientData({
                  ...patientData,
                  address: e.target.value,
                })
              }
              error={!!errors.address}
              helperText={errors.address}
            >
              {districts.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <TextField
            label="Age"
            type="number"
            value={patientData.age || ""}
            onChange={(e) =>
              setPatientData({
                ...patientData,
                age: e.target.value,
              })
            }
            error={!!errors.age}
            helperText={errors.age}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Box>
      </Box>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Patient updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditPatient;
