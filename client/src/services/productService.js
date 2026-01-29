// client/src/services/productService.js
import api from './api';

export const productService = {
  // Get all products
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  async getProduct(productId) {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Create product
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  async updateProduct(productId, productData) {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  // Delete product
  async deleteProduct(productId) {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  // Get categories
  async getCategories() {
    const response = await api.get('/products/categories/all');
    return response.data;
  }
};