// client/src/services/uploadService.js
import api from './api';

export const uploadService = {
  // Upload image
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Delete image
  async deleteImage(publicId) {
    const response = await api.delete(`/upload/image/${publicId}`);
    return response.data;
  }
};