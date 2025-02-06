import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFlat, uploadFlatImage } from "../api/flats"; // Import image upload API
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import {
  Container, TextField, Button, Select, MenuItem, Typography, Paper, Input
} from "@mui/material";
import "./styles.css";

function AddFlat() {
  const [flat, setFlat] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    distance: "",
    amenities: "",
    availability: "Available",
  });

  const [selectedFiles, setSelectedFiles] = useState([]); // ✅ Store selected images

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFlat({ ...flat, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files); // ✅ Store selected files
  };

  const handleAddFlat = async () => {
    try {
      // Format amenities from comma-separated string to an array
      const formattedFlat = {
        ...flat,
        price: parseFloat(flat.price),
        distance: parseFloat(flat.distance),
        roomNumber: flat.roomNumber, // ✅ Ensure `roomNumber` is a number
        amenities: flat.amenities ? flat.amenities.split(",").map((item) => item.trim()) : [],
      };

      console.log("Succesfully formatted");

      // ✅ Step 1: Create flat first
      const createdFlat = await addFlat(formattedFlat, selectedFiles);
      console.log("Succesfully created : ", createdFlat);

      alert("Flat added successfully!");
      navigate("/admin/manage-flats");
    } catch (error) {
      console.error("Error adding flat:", error);
      alert("Failed to add flat. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="sm">
        <Paper elevation={3} className="form-container">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Add New Flat
          </Typography>

          <TextField
            label="Flat Name"
            fullWidth
            name="name"
            value={flat.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Location"
            fullWidth
            name="location"
            value={flat.location}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Price"
            fullWidth
            name="price"
            type="number"
            value={flat.price}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            fullWidth
            name="description"
            multiline
            rows={3}
            value={flat.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Distance (km)"
            fullWidth
            name="distance"
            type="number"
            value={flat.distance}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Amenities (comma separated)"
            fullWidth
            name="amenities"
            value={flat.amenities}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {/* ✅ Image Upload Field */}
          <Input
            type="file"
            inputProps={{ multiple: true }} // Allow multiple file selection
            onChange={handleFileChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Room Number"
            fullWidth
            name="roomNumber"
            type="number"
            value={flat.roomNumber}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />


          <Select
            fullWidth
            name="availability"
            value={flat.availability}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Not Available">Not Available</MenuItem>
          </Select>

          <Button variant="contained" color="primary" onClick={handleAddFlat} sx={{ mt: 2, mr: 2 }}>
            Create Flat
          </Button>
          <Button variant="outlined" color="error" onClick={() => navigate("/admin/manage-flats")}>
            Cancel
          </Button>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}

export default AddFlat;














// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { addFlat } from "../api/flats";
// import DashboardLayout from "../components/Dashboard/DashboardLayout";
// import {
//   Container, TextField, Button, Select, MenuItem, Typography, Paper
// } from "@mui/material";
// import "./styles.css";

// function AddFlat() {
//   const [flat, setFlat] = useState({
//     name: "",
//     location: "",
//     price: "",
//     description: "",
//     distance: "",
//     amenities: "",
//     availability: "Available",
//     images: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFlat({ ...flat, [e.target.name]: e.target.value });
//   };

//   const handleAddFlat = async () => {
//     try {
//       // Format amenities & images from comma-separated string to an array
//       const formattedFlat = {
//         ...flat,
//         price: parseFloat(flat.price),
//         distance: parseFloat(flat.distance),
//         amenities: flat.amenities ? flat.amenities.split(",").map((item) => item.trim()) : [],
//         images: flat.images ? flat.images.split(",").map((item) => item.trim()) : [],
//       };

//       await addFlat(formattedFlat);
//       alert("Flat added successfully!");
//       navigate("/admin/manage-flats");
//     } catch (error) {
//       console.error("Error adding flat:", error);
//       alert("Failed to add flat. Please try again.");
//     }
//   };

//   return (
//     <DashboardLayout>
//       <Container maxWidth="sm">
//         <Paper elevation={3} className="form-container">
//           <Typography variant="h4" sx={{ mb: 2 }}>
//             Add New Flat
//           </Typography>

//           <TextField
//             label="Flat Name"
//             fullWidth
//             name="name"
//             value={flat.name}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             label="Location"
//             fullWidth
//             name="location"
//             value={flat.location}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             label="Price"
//             fullWidth
//             name="price"
//             type="number"
//             value={flat.price}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             label="Description"
//             fullWidth
//             name="description"
//             multiline
//             rows={3}
//             value={flat.description}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             label="Distance (km)"
//             fullWidth
//             name="distance"
//             type="number"
//             value={flat.distance}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             label="Amenities (comma separated)"
//             fullWidth
//             name="amenities"
//             value={flat.amenities}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             label="Images URLs (comma separated)"
//             fullWidth
//             name="images"
//             value={flat.images}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <Select
//             fullWidth
//             name="availability"
//             value={flat.availability}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           >
//             <MenuItem value="Available">Available</MenuItem>
//             <MenuItem value="Not Available">Not Available</MenuItem>
//           </Select>

//           <Button variant="contained" color="primary" onClick={handleAddFlat} sx={{ mt: 2, mr: 2 }}>
//             Create Flat
//           </Button>
//           <Button variant="outlined" color="error" onClick={() => navigate("/admin/manage-flats")}>
//             Cancel
//           </Button>
//         </Paper>
//       </Container>
//     </DashboardLayout>
//   );
// }

// export default AddFlat;
