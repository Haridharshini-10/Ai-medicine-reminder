import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDoctorForm = () => {
  const [formData, setFormData] = useState({
    doctor_name: "",
    doctor_specialization: "",
    hospital_name: "", // Add hospital_name field
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [hospitals, setHospitals] = useState([]); // State to store hospitals
  const navigate = useNavigate();

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "General Physician",
    "Neurologist",
    "Orthopedic Surgeon",
    "Pediatrician",
    "Psychiatrist",
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

    if (!formData.doctor_name) newErrors.doctor_name = "Doctor name is required";
    if (!formData.doctor_specialization)
      newErrors.doctor_specialization = "Specialization is required";
    if (!formData.hospital_name)
      newErrors.hospital_name = "Hospital is required";

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

    const validatedData = { ...formData, hospital_id: selectedHospital.hospital_id };

    if (validateForm()) {
      try {
        await axios.post("http://localhost:5001/add-doctor", validatedData);
        setSnackbar({ open: true, message: "Doctor added successfully!", severity: "success" });
        setTimeout(() => {
          navigate("/view-doctors"); // Navigate to the view doctors page after a short delay
        }, 1000); // 1-second delay
      } catch (error) {
        console.error("Error adding doctor:", error);

        if (error.response) {
          const { message } = error.response.data;

          setSnackbar({
            open: true,
            message: message || "Failed to add doctor. Please try again.",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "An unexpected error occurred. Please try again later.",
            severity: "error",
          });
        }
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
          Add Doctor
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Doctor Name"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
            error={!!errors.doctor_name}
            helperText={errors.doctor_name}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <TextField
              select
              label="Specialization"
              name="doctor_specialization"
              value={formData.doctor_specialization}
              onChange={handleChange}
              error={!!errors.doctor_specialization}
              helperText={errors.doctor_specialization}
            >
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              select
              label="Hospital"
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              error={!!errors.hospital_name}
              helperText={errors.hospital_name || "Select a hospital"}
            >
              {hospitals.map((hospital) => (
                <MenuItem key={hospital.hospital_id} value={hospital.hospital_name}>
                  {hospital.hospital_name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Add Doctor
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddDoctorForm;