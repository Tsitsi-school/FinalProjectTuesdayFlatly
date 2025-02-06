import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/users";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import {
  Container, TextField, Button, Select, MenuItem, Typography, Paper
} from "@mui/material";
import "./styles.css";

function AddUser() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: "USER",
  });

  const navigate = useNavigate();

  const handleCreateUser = async () => {
    try {
      await createUser(user);
      alert("User created successfully!");
      navigate("/admin/manage-users");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="sm">
        <Paper elevation={3} className="form-container">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Add New User
          </Typography>

          <TextField
            label="First Name"
            fullWidth
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Last Name"
            fullWidth
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Email"
            fullWidth
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            fullWidth
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Select
            fullWidth
            value={user.roles}
            onChange={(e) => setUser({ ...user, roles: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>

          <Button variant="contained" color="primary" onClick={handleCreateUser} sx={{ mt: 2, mr: 2 }}>
            Create User
          </Button>
          <Button variant="outlined" color="error" onClick={() => navigate("/admin/manage-users")}>
            Cancel
          </Button>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}

export default AddUser;
