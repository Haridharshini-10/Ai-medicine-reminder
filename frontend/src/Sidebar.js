import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import {
  Menu,
  MenuItem,
  Modal,
  TextField,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      marginLeft: `${drawerWidth}px`,
    }),
  })
);

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1, // Ensure navbar stays above the sidebar
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [manageHospitalOpen, setManageHospitalOpen] = useState(false);
  const [manageDoctorOpen, setManageDoctorOpen] = useState(false);
  const [managePatientOpen, setManagePatientOpen] = useState(false);
  const [manageMedicineOpen, setManageMedicineOpen] = useState(false);
  const[managePrescribedMedicine, setManagePrescribedMedicine] = useState(false);
  const[manageReminder, setManageReminder] = useState(false);

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
      sessionStorage.removeItem("email"); // Clear email from session storage
      navigate("/"); // Redirect to login page
    handleMenuClose();
  };

  const handleChangePassword = async () => {
    // Ensure all fields are filled
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Ensure new passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
  
    try {
      // Send request to backend
      const response = await axios.put('http://localhost:5001/change', {
        email: sessionStorage.getItem('email'), // Get the logged-in user's email
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      // Handling the response from the backend
      if (response.status === 200) {
        alert(response.data.message); // Display success message
        setIsChangePasswordOpen(false); // Close the modal
      } else {
        alert(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      alert('An error occurred while changing the password.');
    }
  };
  

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  

  const menuItems = [
    {
      text: 'Dashboard overview',
      path: '/admin-dashboard',
      icon: <AdminPanelSettingsIcon sx={{ color: '#ECF0F1', minWidth: 30 }} />,
    },
    {
      text: 'Manage Hospital',
      icon: <LocalHospitalIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/>,
      subItems: [
        { text: 'Add Hospital', path: '/add-hospital', icon: <LocalHospitalIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/> },
        { text: 'View Hospitals', path: '/view-hospital', icon: <LocalHospitalIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/> },
        
      ],
      onClick: () => setManageHospitalOpen(!manageHospitalOpen),
    },
    {
      text: 'Manage Doctor',
      icon: <PersonIcon sx={{ color: '#ECF0F1', minWidth: 30 }} />, // Replace with a doctor-specific icon if preferred
      subItems: [
        { text: 'Add Doctor', path: '/add-doctor', icon: <PersonIcon sx={{ color: '#ECF0F1', minWidth: 30 }} /> },
        { text: 'View Doctors', path: '/view-doctors', icon: <PersonIcon sx={{ color: '#ECF0F1', minWidth: 30 }} /> },
      ],
      onClick: () => setManageDoctorOpen(!manageDoctorOpen), // Add state for toggling this section
    },
    {
      text: 'Manage Patient',
      icon: <PersonIcon sx={{ color: '#ECF0F1', minWidth: 30 }} />,
      subItems: [
        { text: 'Add Patient', path: '/add-patient', icon: <PersonIcon sx={{ color: '#ECF0F1', minWidth: 30 }} /> },
        { text: 'View Patients', path: '/view-patients', icon: <PersonIcon sx={{ color: '#ECF0F1', minWidth: 30 }} /> },
        
      ],
      onClick: () => setManagePatientOpen(!managePatientOpen),
    },
    {
      text: 'Manage Medicine',
      icon: <MedicationLiquidIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/>,
      subItems: [
        { text: 'Add Medicine', path: '/add-medicine', icon: <MedicationLiquidIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/> },
        { text: 'View Medicines', path: '/view-medicines', icon: <MedicationLiquidIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/> },
      ],
      onClick: () => setManageMedicineOpen(!manageMedicineOpen),
    },
    {
      text: 'prescribed-medicine',
      icon: <MedicationLiquidIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/>,
      subItems: [
        { text: 'Add prescribed-Medicine', path: '/add-prescribed-medicine', icon: <MedicationLiquidIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/> },
        { text: 'View prescribed-Medicines', path: '/view-treatments', icon: <MedicationLiquidIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/> },
      ],
      onClick: () => setManagePrescribedMedicine(!managePrescribedMedicine),
    },
    {
      text: 'Manage-reminder',
      icon: <MedicationLiquidIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/>,
      subItems: [
        { text: 'Add-reminder', path: '/add-reminder', icon: <MedicationLiquidIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/> },
        { text: 'view-reminder', path: '/view-reminder', icon: <MedicationLiquidIcon sx={{ color: '#ECF0F1', minWidth: 30 }}/> },
      ],
      onClick: () => setManageReminder(!manageReminder),
    },
   
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{backgroundColor: "#2C3E50",}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI REMINDER SYSTEM
        </Typography>
          <AccountCircleIcon sx={{color: '#ECF0F1', minWidth: 30,}}/>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          {sessionStorage.getItem('email')}
          <IconButton onClick={handleMenuOpen}>
          <KeyboardArrowDownIcon sx={{color: '#ECF0F1',minWidth: 30,}}/>
        </IconButton>
        </Typography>
      

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => setIsChangePasswordOpen(true)}>Change Password</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>

      {/* Change Password Modal */}
      <Modal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      >
        <Box sx={{ p: 4, bgcolor: 'white', mx: 'auto', mt: 10, width: 300 }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleChangePassword}
          >
            Submit
          </Button>
       </Box>
      </Modal>
    </AppBar>


      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            backgroundColor: '#2C3E50',
            color: '#ECF0F1',
          },
        }}
        variant="permanent"
        anchor="left"
        open={open}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={() => {
          handleDrawerClose();
          setManageHospitalOpen(false);
          setManagePatientOpen(false);
          setManageMedicineOpen(false);
          setManageDoctorOpen(false);
          setManagePrescribedMedicine(false);
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#ECF0F1' }}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (item.subItems) item.onClick();
                    else navigate(item.path);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      item.subItems ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.text}
                          <ArrowRightIcon
                            sx={{
                              fontSize: '1rem',
                              ml: 1,
                              transform:
                                (item.text === 'Manage Hospital' && manageHospitalOpen) ||
                                (item.text === 'Manage Doctor' && manageDoctorOpen) ||
                                (item.text === 'Manage Patient' && managePatientOpen) ||
                                (item.text === 'Manage Medicine' && manageMedicineOpen) ||
                                (item.text === 'prescribed-medicine' && managePrescribedMedicine)||
                                (item.text === 'set-reminder' && manageReminder)
                                  ? 'rotate(90deg)'
                                  : 'none',
                              transition: 'transform 0.3s',
                            }}
                          />
                        </Box>
                      ) : (
                        item.text
                      )
                    }
                  />
                </ListItemButton>
              </ListItem>
              {item.subItems && (
                <List
                  sx={{
                    display:
                      (item.text === 'Manage Hospital' && manageHospitalOpen) ||
                      (item.text === 'Manage Doctor' && manageDoctorOpen) ||
                      (item.text === 'Manage Patient' && managePatientOpen) ||
                      (item.text === 'Manage Medicine' && manageMedicineOpen) ||
                      (item.text === 'prescribed-medicine' && managePrescribedMedicine)||
                      (item.text === 'set-reminder' && manageReminder)
                        ? 'block'
                        : 'none',
                    pl: 4, // Indent sub-items
                  }}
                >
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.text} disablePadding>
                      <ListItemButton onClick={() => navigate(subItem.path)}>
                        <ListItemIcon sx={{ minWidth: 30 }}>{subItem.icon}</ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Typography paragraph>
          
        </Typography>
      </Main>
    </Box>
  );
}