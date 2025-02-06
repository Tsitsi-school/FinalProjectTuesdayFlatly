import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFlats, getFlatDetails, updateFlat, deleteFlat, uploadFlatImage, filterFlats, deleteFlatImage } from "../api/flats";
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
  MenuItem,
} from "@mui/material";

function ManageFlats() {
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // ✅ Store uploaded files
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    roomNumber: "",
    minDistance: "",
    maxDistance: "",
  });

  useEffect(() => {
    async function fetchFlats() {
      try {
        const data = await getFlats();
        setFlats(data);
      } catch (error) {
        console.error("Error fetching flats:", error);
      }
    }
    fetchFlats();
  }, []);

  const handleSelectFlat = async (id) => {
    try {
      const flatDetails = await getFlatDetails(id);
      setSelectedFlat(flatDetails);
      console.log(flatDetails);
      setIsEditing(false); // Ensure it starts in view mode
    } catch (error) {
      console.error("Error fetching flat details:", error);
    }
  };

  const handleEditFlat = () => {
    setIsEditing(true);
  };

  const handleUpdateFlat = async () => {
    if (!selectedFlat) return;
    try {
      await updateFlat(selectedFlat.id, selectedFlat, selectedFiles);
      alert("Flat updated successfully");
      setSelectedFlat(null);
      setIsEditing(false);
      const data = await getFlats();
      setFlats(data);
    } catch (error) {
      console.error("Error updating flat:", error);
    }
  };

  const handleDeleteFlat = async (id) => {
    try {
      await deleteFlat(id);
      alert("Flat deleted successfully");
      setFlats(flats.filter((flat) => flat.id !== id));
    } catch (error) {
      console.error("Error deleting flat:", error);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files); // ✅ Convert FileList to array
    setSelectedFiles(files); // ✅ Store selected files
  };

  const applyFilters = async () => {
    try {
      const data = await filterFlats(filters);
      setFlats(data);
    } catch (error) {
      console.error("Failed to apply filters");
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Helper function: Returns full image URL if necessary
  const getImageUrl = (img) => {
    return img.startsWith("http") ? img : `http://localhost:8080/${img}`;
  };

  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Manage Flats
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/admin/add-flat")}
        sx={{ mb: 2 }}
      >
        + Add New Flat
      </Button>

      {selectedFlat && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h5">Flat Details</Typography>
          {!isEditing ? (
            <>
              <p>
                <strong>Name:</strong> {selectedFlat.name}
              </p>
              <p>
                <strong>Location:</strong> {selectedFlat.location}
              </p>
              <p>
                <strong>Price:</strong> ${selectedFlat.price}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedFlat.description || "No description available"}
              </p>
              <p>
                <strong>Distance:</strong>{" "}
                {selectedFlat.distance ? `${selectedFlat.distance} km` : "N/A"}
              </p>
              <p>
                <strong>Amenities:</strong>{" "}
                {selectedFlat.amenities?.length
                  ? selectedFlat.amenities.join(", ")
                  : "No amenities listed"}
              </p>
              <p>
                <strong>Availability:</strong>{" "}
                {selectedFlat.availability || "Unknown"}
              </p>

              {/* Display images if available */}
              {selectedFlat.images?.length > 0 && (
                <div>
                  <strong>Images:</strong>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                    {selectedFlat.images.map((img, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        <img
                          src={getImageUrl(img)}
                          alt={`Flat ${index}`}
                          style={{
                            width: "400px",
                            height: "400px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                          }}
                          onClick={async () => {
                            try {
                              // Call the API to delete the image
                              const updatedFlat = await deleteFlatImage(selectedFlat.id, img);
                              setSelectedFlat(updatedFlat);
                              // Optionally, refresh the list of flats if needed
                              const data = await getFlats();
                              setFlats(data);
                            } catch (error) {
                              console.error("Error deleting image:", error);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Show Booking Details */}
              {selectedFlat.bookings?.length > 0 ? (
                <div>
                  <Typography variant="h6">Bookings</Typography>
                  <ul>
                    {selectedFlat.bookings.map((booking) => (
                      <li key={booking.id}>
                        <p>
                          <strong>User:</strong> {booking.userEmail}
                        </p>
                        <p>
                          <strong>Booking Dates:</strong> {booking.startDate} -{" "}
                          {booking.endDate}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No bookings for this flat.</p>
              )}

              {/* Close Details Button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setSelectedFlat(null)}
                sx={{ mt: 2, mr: 2 }}
              >
                Close Details
              </Button>

              <Button variant="contained" onClick={handleEditFlat} sx={{ mt: 2 }}>
                Edit Flat Details
              </Button>
            </>
          ) : (
            <div>
              <Typography variant="h5">Edit Flat</Typography>

              <TextField
                label="Name"
                fullWidth
                value={selectedFlat.name}
                onChange={(e) =>
                  setSelectedFlat({ ...selectedFlat, name: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Location"
                fullWidth
                value={selectedFlat.location}
                onChange={(e) =>
                  setSelectedFlat({ ...selectedFlat, location: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Price"
                fullWidth
                type="number"
                value={selectedFlat.price}
                onChange={(e) =>
                  setSelectedFlat({ ...selectedFlat, price: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                value={selectedFlat.description}
                onChange={(e) =>
                  setSelectedFlat({
                    ...selectedFlat,
                    description: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Distance (km)"
                fullWidth
                type="number"
                value={selectedFlat.distance}
                onChange={(e) =>
                  setSelectedFlat({ ...selectedFlat, distance: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Amenities (comma-separated)"
                fullWidth
                value={selectedFlat.amenities?.join(", ")}
                onChange={(e) =>
                  setSelectedFlat({
                    ...selectedFlat,
                    amenities: e.target.value.split(",").map((item) =>
                      item.trim()
                    ),
                  })
                }
                sx={{ mb: 2 }}
              />

              {/* Image Upload Field */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ marginTop: "10px" }}
              />

              <Select
                label="Availability"
                fullWidth
                value={selectedFlat.availability}
                onChange={(e) =>
                  setSelectedFlat({
                    ...selectedFlat,
                    availability: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Not Available">Not Available</MenuItem>
              </Select>

              <Button
                variant="contained"
                onClick={handleUpdateFlat}
                sx={{ mt: 2, mr: 2 }}
              >
                Update Flat
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </Paper>
      )}

      {/* 🔽 FILTER SECTION STARTS HERE */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Filter Flats</Typography>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "10px",
          }}
        >
          <TextField
            label="Location"
            name="location"
            value={filters.location}
            onChange={handleChange}
          />
          <TextField
            label="Min Price"
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <TextField
            label="Max Price"
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
          />
          <TextField
            label="Rooms"
            type="number"
            name="roomNumber"
            value={filters.roomNumber}
            onChange={handleChange}
          />
          <TextField
            label="Min Distance (km)"
            type="number"
            name="minDistance"
            value={filters.minDistance}
            onChange={handleChange}
          />
          <TextField
            label="Max Distance (km)"
            type="number"
            name="maxDistance"
            value={filters.maxDistance}
            onChange={handleChange}
          />
          <Button variant="contained" color="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </Paper>
      {/* 🔼 FILTER SECTION ENDS HERE */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Location</strong>
              </TableCell>
              <TableCell>
                <strong>Price</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flats.map((flat) => (
              <TableRow key={flat.id}>
                <TableCell>
                  {flat.images?.length > 0 ? (
                    <img
                      src={getImageUrl(flat.images[0])}
                      alt="Flat"
                      style={{
                        width: "200px", // Reduced size for table
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>
                <TableCell>{flat.name}</TableCell>
                <TableCell>{flat.location}</TableCell>
                <TableCell>${flat.price}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleSelectFlat(flat.id)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteFlat(flat.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardLayout>
  );
}

export default ManageFlats;
