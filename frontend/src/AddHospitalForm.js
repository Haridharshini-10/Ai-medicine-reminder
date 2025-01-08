import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const AddHospitalForm = () => {
  const [formData, setFormData] = useState({
    hospital_name: "",
    hospital_type: "",
    address: "",
    phone_no: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // State for the dialog
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hospital_name) newErrors.hospital_name = "Hospital name is required";
    if (!formData.hospital_type) newErrors.hospital_type = "Hospital type is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone_no) {
      newErrors.phone_no = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_no)) {
      newErrors.phone_no = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setOpenDialog(true); // Show confirmation dialog if form is valid
    } else {
      setFailureMessage("Failed to add hospital. Please check the form.");
      setSuccessMessage("");
    }
  };

  const handleConfirmSubmit = () => {
    setSuccessMessage("Hospital added successfully!");
    navigate("/side");
    setFailureMessage("");
    setFormData({
      hospital_name: "",
      hospital_type: "",
      address: "",
      phone_no: "",
    });
    setErrors({});
    setOpenDialog(false); // Close the dialog after submission
  };

  const handleCancelSubmit = () => {
    setOpenDialog(false); // Close the dialog without submitting
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
          <TextField
            fullWidth
            label="Hospital Type"
            name="hospital_type"
            value={formData.hospital_type}
            onChange={handleChange}
            error={!!errors.hospital_type}
            helperText={errors.hospital_type}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            margin="normal"
          />
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
          {successMessage && (
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "green", mt: 2 }}
            >
              {successMessage}
            </Typography>
          )}
          {failureMessage && (
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "red", mt: 2 }}
            >
              {failureMessage}
            </Typography>
          )}
        </form>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelSubmit}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to add this hospital?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddHospitalForm;
