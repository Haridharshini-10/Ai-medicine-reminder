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
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ViewHospitals = ({ hospitalList = [], setHospitalList }) => { // Default to an empty array
  const navigate = useNavigate();

  const handleDelete = (index) => {
    const updatedHospitals = hospitalList.filter((_, i) => i !== index);
    setHospitalList(updatedHospitals);
  };

  if (!Array.isArray(hospitalList)) {
    return <Typography variant="h6">Invalid hospital list data</Typography>;
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
        View Hospitals
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hospital Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hospitalList.map((hospital, index) => (
              <TableRow key={index}>
                <TableCell>{hospital.hospital_name}</TableCell>
                <TableCell>{hospital.hospital_type}</TableCell>
                <TableCell>{hospital.address}</TableCell>
                <TableCell>{hospital.phone_no}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/View-hospital/${index}`)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(index)}
                    color="error"
                  >
                    Delete
                  </IconButton>
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

export default ViewHospitals;
