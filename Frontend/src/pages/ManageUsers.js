import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser, updateUser } from "../api/users";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Typography
} from "@mui/material";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Stores filtered users
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data); // Initialize with all users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter users based on name, email, or role
    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.roles.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUpdatedUser({ ...user });
  };

  const handleUpdateUser = async () => {
    try {
      await updateUser(editingUser.id, updatedUser);
      const updatedList = users.map((user) =>
        user.id === editingUser.id ? updatedUser : user
      );
      setUsers(updatedList);
      setFilteredUsers(updatedList);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Manage Users
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/admin/add-user")}
        sx={{ mb: 2 }}
      >
        Add New User
      </Button>

      {/* Search Bar */}
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {/* Edit User Form */}
      {editingUser && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h5">Edit User</Typography>
          <TextField
            label="First Name"
            fullWidth
            value={updatedUser.firstName || ""}
            onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={updatedUser.lastName || ""}
            onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={updatedUser.email || ""}
            onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleUpdateUser} sx={{ mr: 2 }}>
            Save
          </Button>
          <Button variant="outlined" color="error" onClick={() => setEditingUser(null)}>
            Cancel
          </Button>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.roles}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleEditUser(user)} sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardLayout>
  );
}

export default ManageUsers;
