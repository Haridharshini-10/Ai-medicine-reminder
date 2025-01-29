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

const AddReminderForm = () => {
  const [formData, setFormData] = useState({
    treatment_id: "",
    reminder_time: "",
    start_date: "",
    total_days: "",
    message: "",
    status: "active",
    times_of_day: "",
  });

  const [errors, setErrors] = useState({});
  const [treatments, setTreatments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axios.get("http://localhost:5001/prescribedMedicines");
        setTreatments(response.data);
      } catch (err) {
        console.error("Error fetching treatments:", err);
        setSnackbar({ open: true, message: "Failed to fetch treatments.", severity: "error" });
      }
    };

    fetchTreatments();
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
  
    if (!formData.treatment_id) newErrors.treatment_id = "Treatment ID is required";
    if (!formData.reminder_time) newErrors.reminder_time = "Reminder time is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.total_days) newErrors.total_days = "Total days are required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.times_of_day) newErrors.time_of_day = "Times of day is required";  // Add validation
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await axios.post("http://localhost:5001/add-reminder", formData);
        setSnackbar({ open: true, message: "Reminder added successfully!", severity: "success" });
        setFormData({
          treatment_id: "",
          reminder_time: "",
          start_date: "",
          total_days: "",
          message: "",
          status: "active",
          times_of_day: " ",
        });

        setTimeout(() => {
          navigate("/view-reminder");
        }, 1000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to add reminder.";
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
          Add Reminder
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Treatment"
            name="treatment_id"
            value={formData.treatment_id}
            onChange={handleChange}
            error={!!errors.treatment_id}
            helperText={errors.treatment_id}
            margin="normal"
          >
            {treatments.map((treatment) => (
              <MenuItem key={treatment.treatment_id} value={treatment.treatment_id}>
                {`${treatment.treatment_id} - ${treatment.patient_name},${treatment.hospital_name} (${treatment.medicine_name}, ${treatment.dosage})`}
              </MenuItem>
            ))}
          </TextField>
           <TextField
                fullWidth
                label="Reminder Time"
                name="reminder_time"
                type="time"
                value={formData.reminder_time}
                onChange={handleChange}
                error={!!errors.reminder_time}
                helperText={errors.reminder_time}
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                  }}
                />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            error={!!errors.start_date}
            helperText={errors.start_date}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Total Days"
            type="number"
            name="total_days"
            value={formData.total_days}
            onChange={handleChange}
            error={!!errors.total_days}
            helperText={errors.total_days}
            margin="normal"
          />
                    <TextField
            select
            fullWidth
            label="Times of Day"
            name="times_of_day"
            value={formData.times_of_day}
            onChange={handleChange}
            error={!!errors.times_of_day}
            helperText={errors.times_of_day}
            margin="normal"
          >
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Afternoon">Afternoon</MenuItem>
            <MenuItem value="Night">Night</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            error={!!errors.message}
            helperText={errors.message}
            margin="normal"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Reminder
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

export default AddReminderForm;
