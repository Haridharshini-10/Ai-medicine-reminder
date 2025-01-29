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

const ViewReminders = () => {
  const [reminderList, setReminderList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitalName, setHospitalName] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null); // For modal data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchReminders();
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


  const fetchReminders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/reminders");
      setReminderList(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reminderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reminder?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/reminders/${reminderId}`);
        setReminderList(
          reminderList.filter((reminder) => reminder.reminder_id !== reminderId)
        );
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting reminder:", error);
        alert("Failed to delete reminder. Please try again.");
      }
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
  const handleEdit = (reminderId) => {
    navigate(`/edit-reminders/${reminderId}`);
  };

  const handleView = (reminder) => {
    setSelectedReminder(reminder);
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

  const filteredReminders = reminderList.filter((reminder) => {
    const matchesSearchQuery = reminder.patient_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesHospitalName =
      hospitalName === "all" ||
      reminder.hospital_name.toLowerCase() === hospitalName.toLowerCase();
    return matchesSearchQuery && matchesHospitalName;
  });

  const calculateEndDate = (startDate, totalDays) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + totalDays);
    return start.toLocaleDateString(); // Format as needed
  };

  const columns = [
    {
      name: "Serial No.",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Treatment ID",
      selector: (row) => row.treatment_id,
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
            onClick={() => handleEdit(row.reminder_id)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{
              minWidth: 80,
            }}
            onClick={() => handleDelete(row.reminder_id)}
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
          View Reminders
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
              data={filteredReminders}
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
          Reminder deleted successfully!
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
          {selectedReminder && (
            <>
              <Typography variant="h6" gutterBottom>
                Reminder Details
              </Typography>
              <Typography><strong>Treatment ID:</strong> {selectedReminder.treatment_id}</Typography>
              <Typography><strong>Hospital Name:</strong> {selectedReminder.hospital_name}</Typography>
              <Typography><strong>Patient Name:</strong> {selectedReminder.patient_name}</Typography>
              <Typography><strong>Medicine Name:</strong> {selectedReminder.medicine_name}</Typography>
              <Typography><strong>Doctor Name:</strong> {selectedReminder.doctor_name}</Typography>
              <Typography><strong>Reminder Time:</strong> {selectedReminder.reminder_time}</Typography>
              <Typography><strong>Times of day:</strong> {selectedReminder.times_of_day}</Typography>
              <Typography><strong>Start Date:</strong> {formatDate(selectedReminder.start_date)}</Typography>
              <Typography><strong>Total days</strong> {selectedReminder.total_days}</Typography>
              <Typography><strong>End Date:</strong> {formatDate(calculateEndDate(selectedReminder.start_date, selectedReminder.total_days))}</Typography>
              <Typography><strong>Dosage:</strong> {selectedReminder.dosage}</Typography>
              <Typography><strong>Message:</strong> {selectedReminder.message}</Typography>
              <Typography><strong>Phone Number:</strong> {selectedReminder.phone_number}</Typography>
              
              
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewReminders;
