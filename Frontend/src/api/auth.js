import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api"; // Change this to match backend URL


export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export const register = async (email, password) => {
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
