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
import MenuIcon from '@mui/icons-material/Menu';
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
import AddHomeIcon from '@mui/icons-material/AddHome';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  const [manageHospitalOpen, setManageHospitalOpen] = useState(false); // State to manage "Manage Hospital" dropdown
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toggleManageHospitalMenu = () => {
    setManageHospitalOpen((prev) => !prev); // Toggle the visibility of the "Manage Hospital" sub-menu
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
  {[{ text: 'Home', icon: <AddHomeIcon />, path: '/Home' },
    { text: 'Admin Dashboard', icon: <AdminPanelSettingsIcon />, path: '/side' },
    {
      text: 'Manage Hospital',
      icon: <LocalHospitalIcon />,
      path: '',
      onClick: toggleManageHospitalMenu,
      subItems: [
        { text: 'Add Hospital', icon: <PersonIcon />, path: '/add-hospital' },
        { text: 'View Hospital', icon: <PersonIcon />, path: '/view-hospital' },
        { text: 'Edit Hospital', icon: <PersonIcon />, path: '/edit-hospital' },
      ],
    },
    { text: 'Add Patient', icon: <PersonIcon />, path: '/add-patient' },
    { text: 'Add Medicine', icon: <MedicationLiquidIcon />, path: '/add-medicine' },
  ].map((item) => (
    <ListItem key={item.text} disablePadding>
      <ListItemButton onClick={() => {
        if (item.subItems) {
          toggleManageHospitalMenu(); // Toggle submenu
        } else {
          navigate(item.path); // Navigate if no submenu
        }
      }}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
   {item.subItems && (
  <List
    sx={{
      display: manageHospitalOpen ? 'block' : 'none', // Show/hide submenu conditionally
      marginLeft: 0, // Align submenu with parent item
      marginTop: 0,  // Ensure it appears directly below
      paddingLeft: 4, // Optional: Indent submenu for a hierarchical look
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

    </ListItem>
  ))}
</List>

        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {/* Additional components can go here */}
      </Main>
    </Box>
  );
}
