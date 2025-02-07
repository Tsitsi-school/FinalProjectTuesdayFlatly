import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // Change this to match backend URL

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};