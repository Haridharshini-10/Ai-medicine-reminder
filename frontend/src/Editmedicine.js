import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditMedicine = () => {
  const [form, setForm] = useState({
    medicine_name: '',
    manufacture_date: '',
    expiry_date: '',
    company_name: '',
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { medicineId } = useParams(); // Get the medicine ID from the URL
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch the medicine details when the component mounts
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/medicine/${medicineId}`);
        if (response.data) {
          setForm({
            medicine_name: response.data.medicine_name,
            manufacture_date: new Date(response.data.manufacture_date).toISOString().split('T')[0],
            expiry_date: new Date(response.data.expiry_date).toISOString().split('T')[0],
            company_name: response.data.company_name,
          });
        }
      } catch (error) {
        console.error("Error fetching medicine data:", error);
        setSnackbar({ open: true, message: "Failed to fetch hospitals.", severity: "error" });
      }
    };

    fetchMedicine();
  }, [medicineId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!form.medicine_name.trim()) newErrors.medicine_name = "Medicine Name is required";
    if (!form.manufacture_date) newErrors.manufacture_date = "Manufacture Date is required";
    if (!form.expiry_date) newErrors.expiry_date = "Expiry Date is required";
    if (new Date(form.expiry_date) <= new Date(form.manufacture_date)) {
      newErrors.expiry_date = "Expiry Date must be after Manufacture Date";
    }
    if (!form.company_name.trim()) newErrors.company_name = "Company Name is required";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleCancelSubmit = () => {
    setForm({
      medicine_name: '',
      manufacture_date: '',
      expiry_date: '',
      company_name: '',
    });
    setOpenDialog(false);
  };
  

  const handleSubmit = () => {
    if (validateForm()) {
      setOpenDialog(true); // Show confirmation dialog if form is valid
    } else {
      setOpenSnackbar(true); // Show snackbar if form is invalid
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      await axios.put(`http://localhost:5001/medicine/${medicineId}`, form);
      setOpenSnackbar(true); // Show Snackbar when update is successful
      setTimeout(() => {
        navigate("/view-medicines",);
      },1000);
      setForm({ 
        medicine_name: '',
        manufacture_date: '',
        expiry_date: '',
        company_name: '',
      });
      setErrors({});
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating medicine:", error);
      alert('Server error');
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: '400px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" textAlign="center" marginBottom={2}>
          Edit Medicine
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Medicine Name"
            name="medicine_name"
            value={form.medicine_name}
            onChange={handleChange}
            error={!!errors.medicine_name}
            helperText={errors.medicine_name}
          />
          <TextField
            label="Manufacture Date"
            name="manufacture_date"
            type="date"
            value={form.manufacture_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.manufacture_date}
            helperText={errors.manufacture_date}
          />
          <TextField
            label="Expiry Date"
            name="expiry_date"
            type="date"
            value={form.expiry_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.expiry_date}
            helperText={errors.expiry_date}
          />
          <TextField
            label="Company Name"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            error={!!errors.company_name}
            helperText={errors.company_name}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
            Medicine updated successfully!
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelSubmit}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          Are you sure you want to update the medicine details?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmit}>Cancel</Button>
          <Button onClick={handleConfirmSubmit} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditMedicine;
