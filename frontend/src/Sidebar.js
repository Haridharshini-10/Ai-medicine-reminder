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
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
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
  const [managePatientOpen, setManagePatientOpen] = useState(false);
  const [manageMedicineOpen, setManageMedicineOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const menuItems = [
    {
      text: 'Admin Dashboard',
      path: '/admin-dashboard',
      icon: <AdminPanelSettingsIcon />,
    },
    {
      text: 'Manage Hospital',
      icon: <LocalHospitalIcon />,
      subItems: [
        {
          text: 'Add Hospital',
          path: '/add-hospital',
          icon: <LocalHospitalIcon />,
        },
        {
          text: 'View Hospitals',
          path: '/view-hospital',
          icon: <LocalHospitalIcon />,
        },
        {
          text: 'Edit Hospitals',
          path: '/edit-hospital',
          icon: <LocalHospitalIcon />,
        }
      ],
      onClick: () => setManageHospitalOpen(!manageHospitalOpen),
    },
    {
      text: 'Manage Patient',
      icon: <PersonIcon />,
      subItems: [
        {
          text: 'Add Patient',
          path: '/add-patient',
          icon: <PersonIcon />,
        },

        //sdsafsd
        {
          text: 'View Patients',
          path: '/view-patients',
          icon: <PersonIcon />,
        },{
          text: 'Edit Patients',
          path: '/view-patients',
          icon: <PersonIcon />,
        },
      ],
      onClick: () => setManagePatientOpen(!managePatientOpen),
    },
    {
      text: 'Manage Medicine',
      icon: <MedicationLiquidIcon />,
      subItems: [
        {
          text: 'Add Medicine',
          path: '/add-medicine',
          icon: <MedicationLiquidIcon />,
        },
        {
          text: 'View Medicines',
          path: '/view-medicines',
          icon: <MedicationLiquidIcon />,
        },
        {
          text: 'Edit Medicines',
          path: '/view-medicines',
          icon: <MedicationLiquidIcon />,
        },
      ],
      onClick: () => setManageMedicineOpen(!manageMedicineOpen),
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
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
        onMouseLeave={handleDrawerClose}
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
                                item.text === 'Manage Hospital' && manageHospitalOpen
                                  ? 'rotate(90deg)'
                                  : item.text === 'Manage Patient' && managePatientOpen
                                  ? 'rotate(90deg)'
                                  : item.text === 'Manage Medicine' && manageMedicineOpen
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
                      (item.text === 'Manage Patient' && managePatientOpen) ||
                      (item.text === 'Manage Medicine' && manageMedicineOpen)
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
          Welcome to the Admin Dashboard. Customize this content as needed.
        </Typography>
      </Main>
    </Box>
  );
}
