import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Modal,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

const ViewPatient = () => {
  const [patientList, setPatientList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitalName, setHospitalName] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); // For modal data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, [hospitalName]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5001/hospitals");
        setHospitals(response.data);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setSnackbar({ open: true, message: "Failed to fetch hospitals.", severity: "error" });
      }
    };

    fetchHospitals();
  }, []);



  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/patients");
      setPatientList(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/patients/${patientId}`);
        setPatientList(
          patientList.filter((patient) => patient.patient_id !== patientId)
        );
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient. Please try again.");
      }
    }
  };

  const handleEdit = (patientId) => {
    navigate(`/edit-patients/${patientId}`);
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredPatients = patientList.filter((patient) => {
    const matchesSearchQuery = patient.patient_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesHospitalName =
      hospitalName === "all" ||
      patient.hospital_name.toLowerCase() === hospitalName.toLowerCase();
    return matchesSearchQuery && matchesHospitalName;
  });

  const columns = [
    {
      name: "Serial No.",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Patient ID",
      selector: (row) => row.patient_id,
      sortable: true,
    },
    {
      name: "Patient Name",
      selector: (row) => row.patient_name,
      sortable: true,
    },
    {
      name: "Hospital Name",
      selector: (row) => row.hospital_name,
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
            onClick={() => handleEdit(row.patient_id)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{
              minWidth: 80, // Set a minimum width for the button
              width: 'auto', // Allow the button to adjust based on content, but maintain minWidth
              padding: '8px 8px', // Adjust padding if needed
            }}
            onClick={() => handleDelete(row.patient_id)}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="info"
            size="small"
            onClick={() => handleView(row)}
          >
            View
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
          View Patients
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
            label="Search Patients"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: "200px" }}
          />

          <TextField
            select
            label="Select Hospital"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            variant="outlined"
            sx={{ flex: 1, minWidth: "200px" }}
          >
             <MenuItem value="all">All Hospital Names</MenuItem>
           {hospitals.map((hospital) => (
                        <MenuItem key={hospital.hospital_id} value={hospital.hospital_name}>
                          {hospital.hospital_name}
                        </MenuItem>
                      ))}
          </TextField>
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
              data={filteredPatients}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Patient deleted successfully!
        </Alert>
      </Snackbar>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          {selectedPatient && (
            <>
              <Typography variant="h6" gutterBottom>
                Patient Details
              </Typography>
              <Typography><strong>Patient ID:</strong> {selectedPatient.patient_id}</Typography>
              <Typography><strong>Name:</strong> {selectedPatient.patient_name}</Typography>
              <Typography><strong>Hospital Name:</strong> {selectedPatient.hospital_name}</Typography>
              <Typography><strong>Hospital ID:</strong> {selectedPatient.hospital_id}</Typography>
              <Typography><strong>Age:</strong> {selectedPatient.age}</Typography>
              <Typography><strong>Phone:</strong> {selectedPatient.phone_number}</Typography>
              <Typography><strong>District:</strong> {selectedPatient.address}</Typography>
              <Typography><strong>Issues:</strong> {selectedPatient.issues}</Typography>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewPatient;

