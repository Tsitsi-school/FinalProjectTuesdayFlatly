import axios from 'axios';

import { API_BASE_URL } from '../constants';
const  API_FLATS_BASE_URL = API_BASE_URL + "/flats"; // Change this to match backend URL


export const getFlats = async () => {
  try {
    const response = await axios.get(`${API_FLATS_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flats:', error);
    throw new Error("Could not fetch flats"); // ✅ Improved error handling
  }
};


export const getFlatDetails = async (id) => {
    try {
      const response = await axios.get(`${API_FLATS_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flat details:', error);
      return null;
    }
  };
  

export const deleteFlatImage = async (flatId, imageUrl) => {
  try {
    // Pass the imageUrl as a query parameter (encode it for safety)
    const response = await axios.delete(`${API_FLATS_BASE_URL}/${flatId}/images`, {
      params: { imageUrl: imageUrl }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting flat image:", error);
    throw error;
  }
};

export const addFlat = async (flatData, files) => {
  try {
    const formData = new FormData();

    // Convert flat data to JSON and append as Blob under the key "flat"
    formData.append("flat", new Blob([JSON.stringify(flatData)], { type: "application/json" }));

    // Append image files under the key "files"
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // Multiple images
      }
    }

    const response = await axios.post(`${API_FLATS_BASE_URL}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Flat created response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding flat:", error);
    throw error;
  }
};

export const updateFlat = async (id, flatData, files = []) => {
  try {
    const formData = new FormData();
    formData.append("flat", new Blob([JSON.stringify(flatData)], { type: "application/json" }));

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // ✅ Append multiple images
      }
    }

    const response = await axios.put(`${API_FLATS_BASE_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating flat:", error);
    return null;
  }
};


export const deleteFlat = async (id) => {
  try {
    await axios.delete(`${API_FLATS_BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error fetching flats:', error);
  }
};

export const uploadFlatImage = async (flatId, formData) => {
  try {
    await axios.post(`${API_FLATS_BASE_URL}/${flatId}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("Error uploading flat image:", error);
    throw error;
  }
};

export const getFlatImages = async (flatId) => {
  const response = await axios.get(`${API_FLATS_BASE_URL}/${flatId}/images`);
  return response.data;
};


export const filterFlats = async (filters) => {
  try {
      const response = await axios.get(`${API_FLATS_BASE_URL}/filter`, { params: filters });
      return response.data;
  } catch (error) {
      console.error("Error filtering flats:", error);
      throw error;
  }
};
