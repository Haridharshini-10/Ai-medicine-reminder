import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

const ViewTreatment = () => {
  const [medicineList, setMedicineList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitalName, setHospitalName] = useState("all");
  const [isLoading, setIsLoading] = useState(false);// For modal data
  const [hospitals, setHospitals] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  // Fetch medicines
  useEffect(() => {
    fetchMedicines();
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

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/prescribedMedicines");
      setMedicineList(response.data);
    } catch (error) {
      console.error("Error fetching prescribed medicines:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (treatmentId) => {
    // Log the treatmentId to confirm it's being passed correctly
    console.log("Deleting treatment with ID:", treatmentId);
  
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this prescribed medicine?"
    );
  
    if (confirmDelete) {
      try {
        // Make DELETE request to backend API with the treatmentId
        const response = await axios.delete(`http://localhost:5001/prescribed-medicines/${treatmentId}`);
  
        // If delete is successful, update the medicine list
        if (response.status === 200) {
          setMedicineList(
            medicineList.filter((medicine) => medicine.treatment_id !== treatmentId)
          );
          setSnackbar({
            open: true,
            message: "Prescribed Medicine deleted successfully!",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Failed to delete prescribed medicine.",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error deleting prescribed medicine:", error);
        setSnackbar({
          open: true,
          message: "Failed to delete prescribed medicine.",
          severity: "error",
        });
      }
    }
  };
  
  

  const handleEdit = (treatmentId) => {
    navigate(`/edit-prescribed-medicine/${treatmentId}`);
  };



  const handleSearch = (event) => {
    setSearchQuery(event.target.value.trim().toLowerCase());
  };
  

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  const filteredMedicines = medicineList.filter((medicine) => {
    const matchesSearchQuery = medicine.patient_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesHospitalName =
      hospitalName === "all" ||
      medicine.hospital_name.toLowerCase() === hospitalName.toLowerCase();
    return matchesSearchQuery && matchesHospitalName;
  });
  

  const columns = [
    {
      name: "Treatment ID",
      selector: (row) => row.treatment_id,
      sortable: true,
    },
    {
      name: "Hospital Name",
      selector: (row) => row.hospital_name,
      sortable: true,
    },
    {
      name: "Medicine Name",
      selector: (row) => row.medicine_name,
      sortable: true,
    },
    {
      name: "Doctor Name",
      selector: (row) => row.doctor_name,
      sortable: true,
    },
    {
      name: "Patient Name",
      selector: (row) => row.patient_name,
      sortable: true,
    },
    {
      name: "Dosage",
      selector: (row) => row.dosage,
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
            onClick={() => handleEdit(row.treatment_id)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(row.treatment_id)}
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
          View Prescribed Medicines
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
            label="Search patients"
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
              data={filteredMedicines}
              pagination
              paginationPerPage={6}
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
        open={snackbar.open}
        autoHideDuration={1000}
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

export default ViewTreatment;
