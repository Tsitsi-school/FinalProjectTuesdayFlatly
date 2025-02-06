import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ManageFlats from './pages/ManageFlats';
import ManageUsers from './pages/ManageUsers';
import ManageBookings from './pages/ManageBookings';
import ManageImages from './pages/ManageUsers';
import AddFlat from './pages/AddFlat';
import AddUser from './pages/AddUser';
import AddBooking from './pages/AddBooking';
import DashboardLayout from './components/Dashboard/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/manage-flats" element={<ManageFlats />} />
      <Route path="/admin/add-flat" element={<AddFlat />} />
      <Route path="/admin/manage-users" element={<ManageUsers />} />
      <Route path="/admin/add-user" element={<AddUser />} />
      <Route path="/admin/manage-bookings" element={<ManageBookings />} />
      <Route path="/admin/add-booking" element={<AddBooking />} />
      <Route path="/admin/manage-images" element={<ManageImages />} />
    </Routes>
  );
}

export default App;
