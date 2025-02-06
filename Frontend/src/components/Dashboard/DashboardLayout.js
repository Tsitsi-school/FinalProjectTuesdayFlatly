
import React from "react";
import { AppBar, Box, CssBaseline, Drawer, Toolbar, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;
const leftSpace = 10;

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h4" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/admin">
            <DashboardIcon sx={{ mr: 2, color: "#64b5f6" }} />
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/admin/manage-flats">
            <HomeWorkIcon sx={{ mr: 2, color: "#ffca28" }} />
            <ListItemText primary="Manage Flats" />
          </ListItem>
          <ListItem button component={Link} to="/admin/manage-users">
            <PeopleIcon sx={{ mr: 2, color: "#4caf50" }} />
            <ListItemText primary="Manage Users" />
          </ListItem>
          <ListItem button component={Link} to="/admin/manage-bookings">
            <EventNoteIcon sx={{ mr: 2, color: "#f44336" }} />
            <ListItemText primary="Manage Bookings" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${leftSpace}px`, mt: "64px" }}>
        {children}
      </Box>
    </Box>
  );
}

