import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditPatientForm() {
  const { id } = useParams(); // Assuming the patient ID is passed as a URL parameter
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patient_name: '',
    age: '',
    address: '',
    phone_number: '',
    issues: '',
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch patient data by ID and populate the form
    // Replace the below example with an actual API call
    const fetchPatientData = async () => {
      // Simulated API response
      const response = {
        patient_name: '',
        age: '',
        address: '',
        phone_number: '',
        issues: '',
      };
      setForm(response);
    };
    fetchPatientData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setOpenDialog(true); // Show confirmation dialog if form is valid
    } else {
      setOpenSnackbar(true); // Show snackbar if form is invalid
    }
  };

  const handleConfirmSubmit = () => {
    // Replace the below alert with actual API call for updating patient data
    alert('Patient updated successfully!');
    navigate('/side');
  };

  const handleCancelSubmit = () => {
    setOpenDialog(false); // Close the dialog without submitting
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the snackbar
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 2,
        backgroundColor: 'lightblue',
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 3,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Edit Patient
        </Typography>
        <TextField
          fullWidth
          label="Patient Name"
          name="patient_name"
          value={form.patient_name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.patient_name}
          helperText={errors.patient_name}
        />
        <TextField
          fullWidth
          label="Age"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          margin="normal"
          error={!!errors.age}
          helperText={errors.age}
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          margin="normal"
          error={!!errors.address}
          helperText={errors.address}
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone_number"
          type="tel"
          value={form.phone_number}
          onChange={handleChange}
          margin="normal"
          error={!!errors.phone_number}
          helperText={errors.phone_number}
        />
        <TextField
          fullWidth
          label="Issues"
          name="issues"
          value={form.issues}
          onChange={handleChange}
          margin="normal"
          error={!!errors.issues}
          helperText={errors.issues}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2, backgroundColor: '#1976d2', color: '#fff' }}
        >
          Save Changes
        </Button>
      </Box>

      {/* Snackbar for validation error */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Please fill all required fields!
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelSubmit}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to save these changes?</Typography>
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
}
