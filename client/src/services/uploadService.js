// client/src/services/uploadService.js
import api from './api';

export const uploadService = {
  // Upload image to server's uploads endpoint and normalize response
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/uploads/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Server may return { url, public_id } for Cloudinary or { url, local: true, filename }
    const data = response.data;
    return {
      url: data.url,
      publicId: data.public_id || data.filename || data.publicId || null,
      local: data.local || false
    };
  },

  // Delete image by public id (server should expose corresponding endpoint)
  async deleteImage(publicId) {
    const response = await api.delete(`/uploads/image/${publicId}`);
    return response.data;
  }
};