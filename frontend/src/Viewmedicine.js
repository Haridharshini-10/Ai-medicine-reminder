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
  Modal,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

const ViewMedicines = () => {
  const [medicineList, setMedicineList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyNameQuery, setCompanyNameQuery] = useState("");
  const [expiryDateQuery, setExpiryDateQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/medicines");
      setMedicineList(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setSnackbar({ open: true, message: "Failed to fetch medicines.", severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A"; // Handle cases where date might be missing
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Change to `YYYY-MM-DD` if preferred
  };
  

  const handleDelete = async (medicineId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this medicine?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/medicines/${medicineId}`);
        setMedicineList(medicineList.filter((medicine) => medicine.medicine_id !== medicineId));
        setSnackbar({ open: true, message: "Medicine deleted successfully!", severity: "success" });
      } catch (error) {
        console.error("Error deleting medicine:", error);
        setSnackbar({ open: true, message: "Failed to delete medicine.", severity: "error" });
      }
    }
  };

  const handleEdit = (medicineId) => {
    navigate(`/edit-medicines/${medicineId}`);
  };

  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredMedicines = medicineList.filter((medicine) => {
    const matchesSearchQuery = medicine.medicine_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCompanyName = medicine.company_name
      .toLowerCase()
      .includes(companyNameQuery.toLowerCase());
    const matchesExpiryDate = medicine.expiry_date
      .toLowerCase()
      .includes(expiryDateQuery.toLowerCase());
    return matchesSearchQuery && matchesCompanyName && matchesExpiryDate;
  });

  const columns = [
    {
      name: "Serial No.",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Medicine Name",
      selector: (row) => row.medicine_name,
      sortable: true,
    },

    {
      name: "Company Name",
      selector: (row) => row.company_name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(row.medicine_id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(row.medicine_id)}
            sx={{
              minWidth: 80, // Set a minimum width for the button
              width: 'auto', // Allow the button to adjust based on content, but maintain minWidth
              padding: '8px 8px', // Adjust padding if needed
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="success"
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
          View Medicines
        </Typography>
      </Box>

      <Box sx={{ flex: 1, padding: "5rem" }}>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <TextField
            label="Search by Medicine Name"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: "200px", backgroundColor: "white" }}
          />

          <TextField
            label="Search by Expiry Date"
            variant="outlined"
            value={expiryDateQuery}
            onChange={(e) => setExpiryDateQuery(e.target.value)}
            sx={{ flex: 1, minWidth: "200px", backgroundColor: "white" }}
          />

          <TextField
            label="Search by Company Name"
            variant="outlined"
            value={companyNameQuery}
            onChange={(e) => setCompanyNameQuery(e.target.value)}
            sx={{ flex: 1, minWidth: "200px", backgroundColor: "white" }}
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
              data={filteredMedicines}
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
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
            {selectedMedicine && (
              <>
                <Typography variant="h6" gutterBottom>
                  Medicine Details
                </Typography>
                <Typography><strong>Medicine ID:</strong> {selectedMedicine.medicine_id}</Typography>
                <Typography><strong>Name:</strong> {selectedMedicine.medicine_name}</Typography>
                <Typography><strong>Company Name:</strong> {selectedMedicine.company_name}</Typography>
                <Typography><strong>Expiry Date:</strong>  {formatDate(selectedMedicine.expiry_date)}</Typography>
                <Typography><strong>Manufacture Date:</strong> {formatDate(selectedMedicine.manufacture_date)}</Typography>

              </>
            )}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default ViewMedicines;