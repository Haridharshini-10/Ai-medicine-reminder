import React, { useState } from "react";
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

const AddHospitalForm = () => {
  const [formData, setFormData] = useState({
    hospital_name: "",
    hospital_type: "",
    address: "",
    phone_no: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" }); // Snackbar state
  const navigate = useNavigate();

  const hospitalTypes = [
    "General Hospital",
    "Private Hospital",
    "Government Hospital",
    "Clinic",
    "Multi-Speciality Hospital",
    "Speciality Hospital",
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/; // Starts with 6-9 and has exactly 10 digits.

    if (!formData.hospital_name) newErrors.hospital_name = "Hospital name is required";
    if (!formData.hospital_type) newErrors.hospital_type = "Hospital type is required";
    if (!formData.address) newErrors.address = "District is required";
    if (!formData.phone_no) {
      newErrors.phone_no = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone_no)) {
      newErrors.phone_no = "Phone number must start with 6-9 and have 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      const response = await axios.post("http://localhost:5001/add-hospital", formData);
      setSnackbar({ open: true, message: "Hospital added successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/view-hospital"); // Navigate to the view hospital page after a short delay
      }, 1000); // 1-second delay
    } catch (error) {
      console.error("Error adding hospital:", error);
    

      if (error.response) {
        const { message } = error.response.data;
        console.log(error.response.data);
       
    
        if (message === "Hospital name already exists") {
          setSnackbar({
            open: true,
            message: "Hospital name is already in use. Please choose another name.",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: message || "Hospital already exists",
            severity: "error",
          });
        }
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
          Add Hospital
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Hospital Name"
            name="hospital_name"
            value={formData.hospital_name}
            onChange={handleChange}
            error={!!errors.hospital_name}
            helperText={errors.hospital_name}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <TextField
              select
              label="Hospital Type"
              name="hospital_type"
              value={formData.hospital_type}
              onChange={handleChange}
              error={!!errors.hospital_type}
              helperText={errors.hospital_type}
            >
              {hospitalTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              select
              label="District"
              name="address"
              value={formData.address}
              onChange={handleChange}
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
            fullWidth
            label="Phone Number"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
            error={!!errors.phone_no}
            helperText={errors.phone_no}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Add Hospital
          </Button>
        </form>
      </Paper>

      {/* Snackbar for Success or Error Messages */}
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

export default AddHospitalForm;