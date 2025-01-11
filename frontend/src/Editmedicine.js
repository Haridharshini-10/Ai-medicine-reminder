import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function EditMedicine() {
  const [form, setForm] = useState({
    medicine_name: '',
    dosage: '',
    manufacture_date: '',
    expiry_date: '',
    provider_name: '',
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

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
    alert('Medicine updated successfully!');
    navigate("/side");
    setForm({
      medicine_name: '',
      dosage: '',
      manufacture_date: '',
      expiry_date: '',
      provider_name: '',
    });
    setErrors({});
    setOpenDialog(false);
  };

  const handleCancelSubmit = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
          Edit Medicine
        </Typography>
        <TextField
          fullWidth
          label="Medicine Name"
          name="medicine_name"
          value={form.medicine_name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.medicine_name}
          helperText={errors.medicine_name}
        />
        <TextField
          fullWidth
          label="Dosage"
          name="dosage"
          value={form.dosage}
          onChange={handleChange}
          margin="normal"
          error={!!errors.dosage}
          helperText={errors.dosage}
        />
        <TextField
          fullWidth
          label="Manufacture Date"
          name="manufacture_date"
          type="date"
          value={form.manufacture_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          error={!!errors.manufacture_date}
          helperText={errors.manufacture_date}
        />
        <TextField
          fullWidth
          label="Expiry Date"
          name="expiry_date"
          type="date"
          value={form.expiry_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          error={!!errors.expiry_date}
          helperText={errors.expiry_date}
        />
        <TextField
          fullWidth
          label="Provider Name"
          name="provider_name"
          value={form.provider_name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.provider_name}
          helperText={errors.provider_name}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2, backgroundColor: '#1976d2', color: '#fff' }}
        >
          Update
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
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to update this medicine?</Typography>
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
