import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookings";
import { getUsers } from "../api/users"; // Fetch users for dropdown
import { getFlats } from "../api/flats"; // Fetch flats for dropdown
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Paper,
  FormControl,
  InputLabel
} from "@mui/material";
import "./styles.css";

function AddBooking() {
  const navigate = useNavigate();

  // State for new booking
  const [newBooking, setNewBooking] = useState({
    userId: "",
    flatId: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    system: "WEB",
  });

  // State for dropdown data
  const [users, setUsers] = useState([]);
  const [flats, setFlats] = useState([]);

  // Fetch users and flats for dropdowns
  useEffect(() => {
    async function fetchData() {
      try {
        const usersData = await getUsers();
        const flatsData = await getFlats();
        setUsers(usersData);
        setFlats(flatsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleCreateBooking = async () => {
    try {
      const bookingPayload = {
        user: { id: newBooking.userId },
        flat: { id: newBooking.flatId },
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
        status: newBooking.status,
        system: newBooking.system,
      };

      await createBooking(bookingPayload);
      alert("Booking created successfully!");
      navigate("/admin/manage-bookings"); // Redirect to Manage Bookings
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="sm">
        <Paper elevation={3} className="form-container">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Add New Booking
          </Typography>

          {/* User Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={newBooking.userId}
              onChange={(e) => setNewBooking({ ...newBooking, userId: e.target.value })}
            >
              <MenuItem value="">Select a User</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Flat Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Flat</InputLabel>
            <Select
              value={newBooking.flatId}
              onChange={(e) => setNewBooking({ ...newBooking, flatId: e.target.value })}
            >
              <MenuItem value="">Select a Flat</MenuItem>
              {flats.map((flat) => (
                <MenuItem key={flat.id} value={flat.id}>
                  {flat.name} - {flat.location} (${flat.price})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Start Date */}
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newBooking.startDate}
            onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
            sx={{ mb: 2 }}
          />

          {/* End Date */}
          <TextField
            fullWidth
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newBooking.endDate}
            onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
            sx={{ mb: 2 }}
          />

          {/* Status Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newBooking.status}
              onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="CANCELED">Canceled</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>

          {/* Buttons */}
          <Button variant="contained" color="primary" onClick={handleCreateBooking} sx={{ mt: 2, mr: 2 }}>
            Create Booking
          </Button>
          <Button variant="outlined" color="error" onClick={() => navigate("/admin/manage-bookings")}>
            Cancel
          </Button>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}

export default AddBooking;
