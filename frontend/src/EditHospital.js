import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";

const EditHospital = () => {
  const { hospitalId } = useParams(); // Get the hospitalId from the URL
  const navigate = useNavigate();
  const [hospitalData, setHospitalData] = useState({
    hospital_name: "",
    hospital_type: "",
    address: "",
    phone_no: "",
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

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

  // Fetch hospital data when the component loads
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/hospitals/${hospitalId}`
        );
        setHospitalData(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching hospital details:", error);
      }
    };

    if (hospitalId) {
      fetchHospital();
    }
  }, [hospitalId]);

  // Handle field validation
  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!hospitalData.hospital_name)
      newErrors.hospital_name = "Hospital name is required";
    if (!hospitalData.hospital_type)
      newErrors.hospital_type = "Hospital type is required";
    if (!hospitalData.address) newErrors.address = "District is required";
    if (!hospitalData.phone_no) {
      newErrors.phone_no = "Phone number is required";
    } else if (!phoneRegex.test(hospitalData.phone_no)) {
      newErrors.phone_no = "Phone number must start with 6-9 and have 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update hospital data
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(
        `http://localhost:5001/hospitals/${hospitalId}`,
        hospitalData // Send updated data to the backend
      );

      setOpenSnackbar(true); // Show Snackbar when update is successful
      setTimeout(() => {
        navigate("/view-hospital"); // Redirect to the hospital list page after 1 second
      }, 1000); // 1-second delay before redirecting
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Backend validation errors
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating hospital:", error);
        alert("Failed to update hospital. Please try again.");
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
          Edit Hospital
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <TextField
            label="Hospital Name"
            value={hospitalData.hospital_name || ""}
            onChange={(e) =>
              setHospitalData({
                ...hospitalData,
                hospital_name: e.target.value,
              })
            }
            error={!!errors.hospital_name}
            helperText={errors.hospital_name}
          />
          <FormControl fullWidth>
            <TextField
              select
              label="Hospital Type"
              value={hospitalData.hospital_type || ""}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
                  hospital_type: e.target.value,
                })
              }
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
          <FormControl fullWidth>
            <TextField
              select
              label="District"
              value={hospitalData.address || ""}
              onChange={(e) =>
                setHospitalData({
                  ...hospitalData,
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
            label="Phone Number"
            value={hospitalData.phone_no || ""}
            onChange={(e) =>
              setHospitalData({
                ...hospitalData,
                phone_no: e.target.value,
              })
            }
            error={!!errors.phone_no}
            helperText={errors.phone_no}
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
          Hospital updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditHospital;