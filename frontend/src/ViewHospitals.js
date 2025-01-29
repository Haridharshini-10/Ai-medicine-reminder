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
  CircularProgress, // Import CircularProgress for loading spinner
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

const ViewHospitals = () => {
  const [hospitalList, setHospitalList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setDistrict] = useState("all");
  const [hospital_type, setHospitalType] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
  }, [address]);

  const fetchHospitals = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.get("http://localhost:5001/hospitals");
      setHospitalList(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching
    }
  };

  const handleDelete = async (hospitalId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hospital?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/hospitals/${hospitalId}`);
        setHospitalList(
          hospitalList.filter((hospital) => hospital.hospital_id !== hospitalId)
        );
        setSnackbarOpen(true); // Open Snackbar for success message
      } catch (error) {
        console.error("Error deleting hospital:", error);
        alert("Failed to delete hospital. Please try again.");
      }
    }
  };

  const handleEdit = (hospitalId) => {
    navigate(`/edit-hospital/${hospitalId}`);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredHospitals = hospitalList.filter((hospital) => {
    const matchesSearchQuery = hospital.hospital_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDistrict =
      address === "all" || hospital.address.toLowerCase() === address.toLowerCase();
    const matchesHospitalType =
      hospital_type === "all" ||
      hospital.hospital_type.toLowerCase() === hospital_type.toLowerCase();
    return matchesSearchQuery && matchesDistrict && matchesHospitalType;
  });

  const columns = [
    {
      name: "Serial No.",
      selector: (row, index) => index + 1, // To show serial number
      sortable: false,
    },
    {
      name: "Hospital ID",
      selector: (row) => row.hospital_id,
      sortable: true,
    },
    {
      name: "Hospital Name",
      selector: (row) => row.hospital_name,
      sortable: true,
    },
    {
      name: "Hospital Type",
      selector: (row) => row.hospital_type,
      sortable: true,
    },
    {
      name: "District",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone_no,
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
            onClick={() => handleEdit(row.hospital_id)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(row.hospital_id)}
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
          View Hospitals
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
            label="Search Hospitals"
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
            label="Select District"
            value={address}
            onChange={(e) => setDistrict(e.target.value)}
            variant="outlined"
            sx={{ flex: 1, minWidth: "200px" }}
          >
            <MenuItem value="all">All Districts</MenuItem>
            {[
              "Ariyalur",
              "Chennai",
              "Coimbatore",
              "Dharmapuri",
              "Dindigul",
              "Erode",
              "Kanchipuram",
              "Madurai",
              "Nagai",
              "Salem",
              "Tirunelveli",
              "Trichy",
              "Vellore",
              "Villupuram",
              "Virudhunagar",
              "Namakkal",
            ].map((district) => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Hospital Type"
            value={hospital_type}
            onChange={(e) => setHospitalType(e.target.value)}
            variant="outlined"
            sx={{ flex: 1, minWidth: "200px" }}
          >
            <MenuItem value="all">All Hospital Types</MenuItem>
            <MenuItem value="General Hospital">General Hospital</MenuItem>
            <MenuItem value="Private Hospital">Private Hospital</MenuItem>
            <MenuItem value="Government Hospital">Government Hospital</MenuItem>
            <MenuItem value="Clinic">Clinic</MenuItem>
            <MenuItem value="Multi-Speciality Hospital">Multi-Speciality Hospital</MenuItem>
            <MenuItem value="Speciality Hospital">Speciality Hospital</MenuItem>
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
              data={filteredHospitals}
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
          Hospital deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewHospitals;