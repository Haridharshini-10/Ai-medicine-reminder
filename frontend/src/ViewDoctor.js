import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);  // Added state for hospitals
  const [searchQueryDoctor, setSearchQueryDoctor] = useState("");
  const [searchQueryHospital, setSearchQueryHospital] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get("http://localhost:5001/hospitals");
      setHospitals(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching Doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedDoctorId(null);
  };

  const handleEdit = (doctorId) => {
    navigate(`/edit-doctor/${doctorId}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/doctors/${selectedDoctorId}`);
      setSnackbarOpen(true);
      closeDeleteDialog();
      fetchDoctors(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleSearchHospital = (event) => {
    setSearchQueryHospital(event.target.value);
  };

  const handleSearchDoctor = (event) => {
    setSearchQueryDoctor(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Function to get the hospital name
  const getHospitalName = (hospitalId) => {
    const hospital = hospitals.find((hosp) => hosp.hospital_id === hospitalId);
    return hospital ? hospital.hospital_name : "Unknown Hospital";
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const hospital = hospitals.find((hosp) => hosp.hospital_id === doctor.hospital_id);
    const hospitalName = hospital ? hospital.hospital_name.toLowerCase() : "";
  
    const matchesHospitalID = doctor.hospital_id.toString().includes(searchQueryHospital);
    const matchesHospitalName = hospitalName.includes(searchQueryHospital.toLowerCase());
    const matchesDoctorName = doctor.doctor_name.toLowerCase().includes(searchQueryDoctor.toLowerCase());
  
    return (matchesHospitalID || matchesHospitalName) && matchesDoctorName;
  });

  const columns = [
    {
      name: "Serial No.",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Hospital",  // Changed to show both Hospital ID and Name
      selector: (row) => `${row.hospital_id} (${getHospitalName(row.hospital_id)})`, // Display both Hospital ID and Name
      sortable: true,
    },
    {
      name: "Doctor Name",
      selector: (row) => row.doctor_name,
      sortable: true,
    },
    {
      name: "Specialization",
      selector: (row) => row.doctor_specialization,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEdit(row.doctor_id)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => openDeleteDialog(row.doctor_id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          padding: "1rem",
          backgroundColor: "#00796b",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          View Doctors
        </Typography>
      </Box>

      <Box sx={{ flex: 1, padding: "5rem" }}>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
            marginLeft: "2.5rem",
          }}
        >
          <TextField
            label="Search by Hospital ID"
            variant="outlined"
            value={searchQueryHospital}
            onChange={handleSearchHospital}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: "150px" }}
          />

          <TextField
            label="Search by Doctor Name"
            variant="outlined"
            value={searchQueryDoctor}
            onChange={handleSearchDoctor}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: "150px" }}
          />
        </Box>

        <Paper
          sx={{
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <CircularProgress />
              <Typography sx={{ marginLeft: "1rem" }}>Loading...</Typography>
            </Box>
          ) : (
            <DataTable
              columns={columns}
              data={filteredDoctors}
              pagination
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[6, 12, 18]}
              highlightOnHover
              responsive
              customStyles={{
                headCells: {
                  style: {
                    fontWeight: "bold",
                    backgroundColor: "#00796b",
                    color: "white",
                  },
                },
                cells: {
                  style: {
                    fontSize: "14px",
                    padding: "12px 12px",
                  },
                },
              }}
            />
          )}
        </Paper>
      </Box>

      <Dialog open={dialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this doctor?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Doctor deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewDoctors;