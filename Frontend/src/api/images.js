import axios from 'axios';
import { API_BASE_URL } from '../constants';


export const getFlatImages = async (flatId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/flats/${flatId}/images`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flats:', error);
    return [];
  }
};

export const uploadFlatImage = async (flatId, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await axios.post(`${API_BASE_URL}/flats/${flatId}/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
      console.error('Error fetching flat details:', error);
      return null;
    }
  };
  

export const deleteFlatImage = async (flatId, imageId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/flats/${flatId}/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flats:', error);
    return [];
  }
};
