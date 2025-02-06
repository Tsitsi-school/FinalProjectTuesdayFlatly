import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import './styles.css';


function ManageImages() {
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFlats() {
      try {
        const response = await axiosInstance.get('/flats');
        setFlats(response.data);
      } catch (err) {
        console.error('Error fetching flats:', err);
        setError('Failed to fetch flats');
      }
    }
    fetchFlats();
  }, []);

  const handleFlatSelect = async (flat) => {
    setSelectedFlat(flat);
    try {
      const response = await axiosInstance.get(`/flats/${flat.id}/images`);
      setImages(response.data);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to fetch images');
    }
  };

  const handleImageUpload = async (event) => {
    if (!selectedFlat) {
      alert('Please select a flat first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', event.target.files[0]);

    try {
      await axiosInstance.post(`/flats/${selectedFlat.id}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Image uploaded successfully');
      handleFlatSelect(selectedFlat);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    }
    setUploading(false);
  };

  return (
    <div>
      <h1>Manage Flat Images</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <select onChange={(e) => handleFlatSelect(flats.find(f => f.id === parseInt(e.target.value)))}>
        <option value="">Select a flat</option>
        {flats.map(flat => (
          <option key={flat.id} value={flat.id}>{flat.name}</option>
        ))}
      </select>
      {selectedFlat && (
        <div>
          <h2>{selectedFlat.name}</h2>
          <input type="file" onChange={handleImageUpload} disabled={uploading} />
          <h3>Images</h3>
          {images.length > 0 ? (
            <ul>
              {images.map((img, index) => (
                <li key={index}><img src={img.url} alt={`Flat ${selectedFlat.name}`} width="200" /></li>
              ))}
            </ul>
          ) : <p>No images uploaded</p>}
        </div>
      )}
    </div>
  );
}

export default ManageImages;
