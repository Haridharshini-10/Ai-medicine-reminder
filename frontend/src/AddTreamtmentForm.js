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

const AddTreatmentForm = () => {
  const [formData, setFormData] = useState({
    hospital_id: "",
    patient_id: "",
    doctor_id: "",
    medicine_id: "",
    dosage: "",
  });

  const [errors, setErrors] = useState({});
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalRes, patientRes, medicineRes, doctorRes] = await Promise.all([
          axios.get("http://localhost:5001/hospitals"),
          axios.get("http://localhost:5001/patients"),
          axios.get("http://localhost:5001/medicines"),
          axios.get("http://localhost:5001/doctors"),
        ]);

        setHospitals(hospitalRes.data);
        setPatients(patientRes.data);
        setMedicines(medicineRes.data);
        setDoctors(doctorRes.data);
        console.log("Doctors data:", doctorRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setSnackbar({ open: true, message: "Failed to fetch data.", severity: "error" });
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "hospital_id") {
      const selectedHospital = hospitals.find((hospital) => hospital.hospital_id === value);
      const selectedHospitalId = selectedHospital ? selectedHospital.hospital_id : null;

      const filteredPatients = patients.filter(
        (patient) => patient.hospital_id === selectedHospitalId
      );
      const filteredDoctors = doctors.filter(
        (doctor) => doctor.hospital_id === selectedHospitalId
      );

      setFilteredPatients(filteredPatients);
      setFilteredDoctors(filteredDoctors);

      setFormData((prevState) => ({
        ...prevState,
        hospital_id: value,
        patient_id: "",
        doctor_id: "",
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hospital_id) newErrors.hospital_id = "Hospital is required";
    if (!formData.patient_id) newErrors.patient_id = "Patient is required";
    if (!formData.doctor_id) newErrors.doctor_id = "Doctor is required";
    if (!formData.medicine_id) newErrors.medicine_id = "Medicine is required";
    if (!formData.dosage.trim()) newErrors.dosage = "Dosage is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await axios.post("http://localhost:5001/add-treatment", formData);
        setSnackbar({ open: true, message: "Treatment added successfully!", severity: "success" });
        setFormData({
          hospital_id: "",
          patient_id: "",
          doctor_id: "",
          medicine_id: "",
          dosage: "",
        });

        setTimeout(() => {
          navigate("/view-treatments");
        }, 1000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to add treatment.";
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
          Add Treatment
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Hospital"
            name="hospital_id"
            value={formData.hospital_id}
            onChange={handleChange}
            error={!!errors.hospital_id}
            helperText={errors.hospital_id}
            margin="normal"
          >
            {hospitals.map((hospital) => (
              <MenuItem key={hospital.hospital_id} value={hospital.hospital_id}>
                {hospital.hospital_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Patient"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            error={!!errors.patient_id}
            helperText={errors.patient_id}
            margin="normal"
          >
            {filteredPatients.map((patient) => (
              <MenuItem key={patient.patient_id} value={patient.patient_id}>
                {patient.patient_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Doctor"
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleChange}
            error={!!errors.doctor_id}
            helperText={errors.doctor_id}
            margin="normal"
          >
            {filteredDoctors.map((doctor) => (
              <MenuItem key={doctor.doctor_id} value={doctor.doctor_id}>
                {doctor.doctor_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Medicine"
            name="medicine_id"
            value={formData.medicine_id}
            onChange={handleChange}
            error={!!errors.medicine_id}
            helperText={errors.medicine_id}
            margin="normal"
          >
            {medicines.map((medicine) => (
              <MenuItem key={medicine.medicine_id} value={medicine.medicine_id}>
                {`${medicine.medicine_name} (${medicine.company_name}, Exp: ${new Date(
                  medicine.expiry_date
                ).toLocaleDateString()})`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            error={!!errors.dosage}
            helperText={errors.dosage}
            margin="normal"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Treatment
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

export default AddTreatmentForm;
