import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ViewPatients = ({ patientList = [], setPatientList }) => {
  const navigate = useNavigate();

  const handleDelete = (index) => {
    const updatedPatients = patientList.filter((_, i) => i !== index);
    setPatientList(updatedPatients);
  };

  if (!Array.isArray(patientList)) {
    return <Typography variant="h6">Invalid patient list data</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: '10px', backgroundColor: '#ADD8E6', padding: '2rem' }}>
        {/* Add Sidebar Content Here (if needed) */}
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: "2rem", backgroundColor: '#ADD8E6' }}>
        <Typography variant="h4" gutterBottom>
          View Patients
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Issues</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientList.map((patient, index) => (
                <TableRow key={index}>
                  <TableCell>{patient.patient_name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>{patient.phone_number}</TableCell>
                  <TableCell>{patient.issues}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/edit-patient/${index}`)}
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ViewPatients;
