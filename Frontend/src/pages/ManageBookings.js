import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBookings,
  getBookingDetails,
  updateBooking,
  cancelBooking,  // <-- Import the cancelBooking API function
  deleteBooking
} from "../api/bookings";
import { getFlatDetails } from "../api/flats";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem
} from "@mui/material";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedFlat, setSelectedFlat] = useState(null); // Stores the clicked flat's details
  const [filteredBookings, setFilteredBookings] = useState([]); // Stores filtered bookings
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [updatedBooking, setUpdatedBooking] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getBookings();
        setBookings(data);
        setFilteredBookings(data); // Initialize with all bookings
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }
    fetchBookings();
  }, []);

  // Search Function
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = bookings.filter((booking) =>
      (booking.flatId && booking.flatId.toString().includes(query)) ||
      (booking.userEmail && booking.userEmail.toLowerCase().includes(query)) ||
      (booking.startDate && booking.startDate.includes(query)) ||
      (booking.endDate && booking.endDate.includes(query)) ||
      (booking.status && booking.status.toLowerCase().includes(query))
    );

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    let updatedBookings = [...bookings];

    // Apply sorting if a field is selected
    if (sortField) {
      updatedBookings.sort((a, b) => {
        let valA = a[sortField] ?? "";
        let valB = b[sortField] ?? "";

        // Convert dates to timestamps for correct sorting
        if (sortField === "startDate" || sortField === "endDate") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        return sortOrder === "asc" ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
      });
    }

    // Update state
    setFilteredBookings(updatedBookings);
  }, [bookings, sortField, sortOrder]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    if (!sortField) return 0;

    let valA = a[sortField] ?? ""; // Ensure non-null values
    let valB = b[sortField] ?? "";

    // Convert dates to timestamps for correct sorting
    if (sortField === "startDate" || sortField === "endDate") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    return sortOrder === "asc" ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
  });

  const handleSelectBooking = async (id) => {
    try {
      const bookingDetails = await getBookingDetails(id);
      console.log(bookingDetails);
      setSelectedBooking(bookingDetails);
      setUpdatedBooking({ ...bookingDetails });

      if (bookingDetails.flatId) {
        const flatDetails = await getFlatDetails(bookingDetails.flatId);
        setSelectedFlat(flatDetails);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const handleUpdateBooking = async () => {
    try {
      await updateBooking(selectedBooking.id, updatedBooking);
      alert("Booking updated successfully");
      const data = await getBookings(); // Refresh list
      setBookings(data);
      setSelectedBooking(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  // New function: Cancel the booking using the cancelBooking endpoint
  const handleCancelBooking = async (id) => {
    try {
      await cancelBooking(id);  // Calls POST /api/bookings/{id}/cancel
      alert("Booking canceled successfully");
      const data = await getBookings();
      setBookings(data);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  // Optionally, keep the delete functionality if needed, otherwise remove it
  const handleDeleteBooking = async (id) => {
    try {
      await deleteBooking(id);
      alert("Booking deleted successfully");
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Manage Bookings
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/admin/add-booking")}
        sx={{ mb: 2 }}
      >
        + Add New Booking
      </Button>

      {/* Search Bar */}
      <TextField
        label="Search Bookings"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {/* Booking Details */}
  {selectedBooking && (
    <Paper sx={{ mt: 3, p: 3 }}>
      <Typography variant="h5">Booking Details</Typography>
      <p><strong>Booking ID:</strong> {selectedBooking.id}</p>
      <p><strong>User:</strong> {selectedBooking.userEmail}</p>
      <p><strong>Start Date:</strong> {selectedBooking.startDate}</p>
      <p><strong>End Date:</strong> {selectedBooking.endDate}</p>
      <p><strong>Status:</strong> {selectedBooking.status}</p>

      {selectedFlat && (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>Apartment Details</Typography>
          <p><strong>Name:</strong> {selectedFlat.name}</p>
          <p><strong>Location:</strong> {selectedFlat.location}</p>
          <p><strong>Price:</strong> ${selectedFlat.price}</p>
          <p><strong>Availability:</strong> {selectedFlat.availability || "Unknown"}</p>

          {/* Display images if available */}
          {selectedFlat.images?.length > 0 && (
            <div>
              <strong>Images:</strong>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {selectedFlat.images.map((img, index) => (
                  <img
                    key={index}
                    src={`${img}`}
                    alt={`Flat ${index}`}
                    style={{
                      width: "400px",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Action buttons */}
      <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mt: 2, mr: 2 }}>
        Edit Booking
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleCancelBooking(selectedBooking.id)}
        sx={{ mt: 2, mr: 2 }}
      >
        Cancel Booking
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleDeleteBooking(selectedBooking.id)}
        sx={{ mt: 2, mr: 2 }}
      >
        Delete Booking
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setSelectedBooking(null);
          setSelectedFlat(null);
        }}
        sx={{ mt: 2, mr: 2 }}
      >
        Close Details
      </Button>
    </Paper>
  )}
      {/* Edit Booking Form */}
      {isEditing && selectedBooking && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h5">Edit Booking</Typography>

          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={updatedBooking.startDate || ""}
            onChange={(e) =>
              setUpdatedBooking({ ...updatedBooking, startDate: e.target.value })
            }
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={updatedBooking.endDate || ""}
            onChange={(e) =>
              setUpdatedBooking({ ...updatedBooking, endDate: e.target.value })
            }
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <Typography>Status:</Typography>
          <Select
            fullWidth
            value={updatedBooking.status || ""}
            onChange={(e) =>
              setUpdatedBooking({ ...updatedBooking, status: e.target.value })
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="CANCELED">Canceled</MenuItem>
          </Select>

          <Button variant="contained" onClick={handleUpdateBooking} sx={{ mr: 2 }}>
            Save Changes
          </Button>
          <Button variant="outlined" color="error" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Button onClick={() => handleSort("flatId")} variant="text">
                  <strong>Flat ID {sortField === "flatId" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</strong>
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSort("userEmail")} variant="text">
                  <strong>User {sortField === "userEmail" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</strong>
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSort("startDate")} variant="text">
                  <strong>Start Date {sortField === "startDate" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</strong>
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSort("endDate")} variant="text">
                  <strong>End Date {sortField === "endDate" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</strong>
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSort("status")} variant="text">
                  <strong>Status {sortField === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</strong>
                </Button>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
      <TableBody>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.flatId || "N/A"}</TableCell>
            <TableCell>{booking.userEmail || "N/A"}</TableCell>
            <TableCell>{booking.startDate}</TableCell>
            <TableCell>{booking.endDate}</TableCell>
            <TableCell>{booking.status}</TableCell>
            <TableCell>
              <Button
                variant="outlined"
                onClick={() => handleSelectBooking(booking.id)}
                sx={{ mr: 1 }}
              >
                View
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCancelBooking(booking.id)}
                sx={{ mr: 1 }}
              >
                Cancel Booking
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteBooking(booking.id)}
              >
                Delete Booking
              </Button>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
                <TableCell colSpan={6} align="center">
                  No bookings found.
                </TableCell>
              </TableRow>
      )}
      </TableBody>
        </Table>
      </TableContainer>
    </DashboardLayout>
  );
}

export default ManageBookings;
