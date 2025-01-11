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
  Button,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const ViewMedicines = ({ medicineList = [], setMedicineList }) => {
  const navigate = useNavigate();

  const handleDelete = (index) => {
    const updatedMedicines = medicineList.filter((_, i) => i !== index);
    setMedicineList(updatedMedicines);
  };

  if (!Array.isArray(medicineList)) {
    return <Typography variant="h6">Invalid medicine list data</Typography>;
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
          View Medicines
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medicine Name</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Manufacture Date</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Provider Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicineList.map((medicine, index) => (
                <TableRow key={index}>
                  <TableCell>{medicine.medicine_name}</TableCell>
                  <TableCell>{medicine.dosage}</TableCell>
                  <TableCell>{medicine.manufacture_date}</TableCell>
                  <TableCell>{medicine.expiry_date}</TableCell>
                  <TableCell>{medicine.provider_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/edit-medicine/${index}`)}
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

export default ViewMedicines;
