// client/src/services/orderService.js
import api from './api';

export const orderService = {
  // Create a new order
  async createOrder(orderData) {
    console.log('Creating order with data:', orderData);
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  async getOrders(params = {}) {
    console.log('Fetching orders with params:', params);
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  async getOrder(orderId) {
    console.log('Fetching order with ID:', orderId);
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel order
  async cancelOrder(orderId) {
    console.log('Canceling order with ID:', orderId);
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Track order
  async trackOrder(orderNumber) {
    console.log('Tracking order with number:', orderNumber);
    const response = await api.get(`/orders/tracking/${orderNumber}`);
    return response.data;
  }
};