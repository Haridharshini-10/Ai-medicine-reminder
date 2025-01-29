import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddMedicineForm() {
  const [formData, setFormData] = useState({
    medicine_name: '',
    manufacture_date: '',
    expiry_date: '',
    company_name: '',
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateData = () => {
    const newErrors = {};
    if (!formData.medicine_name.trim()) newErrors.medicine_name = 'Medicine name is required';
    if (!formData.manufacture_date) newErrors.manufacture_date = 'Manufacture date is required';
    if (!formData.expiry_date) newErrors.expiry_date = 'Expiry date is required';
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
  
    // Check if expiry date is after manufacture date
    const manufactureDate = new Date(formData.manufacture_date);
    const expiryDate = new Date(formData.expiry_date);
    if (expiryDate <= manufactureDate) {
      newErrors.expiry_date = 'Expiry date must be after the manufacture date';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    if (validateData()) {
      setDialogOpen(true);
    } else {
      setSnackbar({ open: true, message: 'Please correct the errors', severity: 'error' });
    }
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/add-medicine', formData);
      if (response.status === 200) {
        setSnackbar({ open: true, message: 'Medicine added successfully!', severity: 'success' });
        setTimeout(() => navigate('/view-medicines'), 2000); // Wait for Snackbar to display before navigating

        setFormData({
          medicine_name: '',
          manufacture_date: '',
          expiry_date: '',
          company_name: '',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error adding medicine',
        severity: 'error',
      });
    }
    setLoading(false);
    setDialogOpen(false);
  };

  const handleDialogClose = () => setDialogOpen(false);

  const handleSnackbarClose = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'lightblue',
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 3,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 15
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Add Medicine
        </Typography>
        <TextField
          fullWidth
          label="Medicine Name"
          name="medicine_name"
          value={formData.medicine_name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.medicine_name}
          helperText={errors.medicine_name}
        />
        <TextField
          fullWidth
          label="Manufacture Date"
          name="manufacture_date"
          type="date"
          value={formData.manufacture_date}
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
          value={formData.expiry_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          error={!!errors.expiry_date}
          helperText={errors.expiry_date}
        />
        <TextField
          fullWidth
          label="Company Name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.company_name}
          helperText={errors.company_name}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to add this medicine?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmSubmit} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
