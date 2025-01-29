import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPatientForm = () => {
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    address: "",
    phone_number: "",
    issues: "",
    hospital_name: "",
  });

  const [errors, setErrors] = useState({});
  const [hospitals, setHospitals] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const districts = [
    "Ariyalur", "Chennai", "Coimbatore", "Dharmapuri", "Dindigul", "Erode",
    "Kanchipuram", "Madurai", "Nagai", "Salem", "Tirunelveli", "Trichy", "Vellore",
    "Villupuram", "Virudhunagar",
  ];

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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.patient_name.trim()) newErrors.patient_name = "Patient name is required";
    if (!formData.age.trim() || isNaN(formData.age) || formData.age <= 0) {
      newErrors.age = "Age must be a valid positive number";
    }
    if (!formData.address.trim()) newErrors.address = "District is required";
    if (!formData.phone_number.trim() || !phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number must start with 6-9 and have 10 digits";
    }
    if (!formData.issues.trim()) newErrors.issues = "Patient issues are required";
    if (!formData.hospital_name.trim()) newErrors.hospital_name = "Hospital is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedHospital = hospitals.find(
      (hospital) => hospital.hospital_name === formData.hospital_name
    );
  
    // If no hospital is selected, show an error
    if (!selectedHospital) {
      setSnackbar({ open: true, message: "Please select a valid hospital", severity: "error" });
      return;
    }
    const validatedData = { ...formData, hospital_id: selectedHospital.hospital_id,age: Number(formData.age) };

  console.log("Validated Data being sent to the backend:", validatedData);

    if (validateForm()) {
      try {
        await axios.post("http://localhost:5001/add-patient", validatedData);
        setSnackbar({ open: true, message: "Patient added successfully!", severity: "success" });
        setFormData({
          patient_name: "",
          age: "",
          address: "",
          phone_number: "",
          issues: "",
          hospital_name: "",
        });

        setTimeout(() => {
          navigate("/view-patients");
        }, 1000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to add patient.";
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        backgroundColor: "lightblue",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          width: "400px",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Add Patient
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Patient Name"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            error={!!errors.patient_name}
            helperText={errors.patient_name}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Hospital"
            name="hospital_name"
            value={formData.hospital_name}
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
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            error={!!errors.age}
            helperText={errors.age}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="District"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            margin="normal"
          >
            {districts.map((district) => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            error={!!errors.phone_number}
            helperText={errors.phone_number}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Issues"
            name="issues"
            value={formData.issues}
            onChange={handleChange}
            error={!!errors.issues}
            helperText={errors.issues}
            margin="normal"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Patient
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddPatientForm;
