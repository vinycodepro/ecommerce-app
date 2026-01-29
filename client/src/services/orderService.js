// client/src/services/orderService.js
import api from './api';

export const orderService = {
  // Create a new order
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  async getOrders(params = {}) {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  async getOrder(orderId) {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel order
  async cancelOrder(orderId) {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Track order
  async trackOrder(orderNumber) {
    const response = await api.get(`/orders/tracking/${orderNumber}`);
    return response.data;
  }
};