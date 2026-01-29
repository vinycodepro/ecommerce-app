// client/src/services/adminService.js
import api from './api';

export const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  // Get analytics data
  async getAnalytics(params = {}) {
    const response = await api.get('/analytics', { params });
    return response.data;
  },

  // Get dashboard statistics
  async getDashboardStats() {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  // Get sales report
  async getSalesReport(params = {}) {
    const response = await api.get('/analytics/sales', { params });
    return response.data;
  },

  // Get customer analytics
  async getCustomerAnalytics(params = {}) {
    const response = await api.get('/analytics/customers', { params });
    return response.data;
  },

  // Get product performance
  async getProductPerformance(params = {}) {
    const response = await api.get('/analytics/products', { params });
    return response.data;
  },

  // Get recent orders
  async getRecentOrders() {
    const response = await api.get('/admin/orders?limit=5');
    return response.data;
  },

  // Get all products
  async getProducts(params = {}) {
    const response = await api.get('/admin/products', { params });
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

  // Get all orders
  async getOrders(params = {}) {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Update order status
  async updateOrderStatus(orderId, statusData) {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  },

  // Get all users
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Update user role
  async updateUserRole(userId, roleData) {
    const response = await api.put(`/admin/users/${userId}/role`, roleData);
    return response.data;
  },

  // Toggle user status
  async toggleUserStatus(userId) {
    const response = await api.patch(`/admin/users/${userId}/status`);
    return response.data;
  },

  // Get all coupons
  async getCoupons(params = {}) {
    const response = await api.get('/coupons', { params });
    return response.data;
  },

  // Create coupon
  async createCoupon(couponData) {
    const response = await api.post('/coupons', couponData);
    return response.data;
  },

  // Update coupon
  async updateCoupon(couponId, couponData) {
    const response = await api.put(`/coupons/${couponId}`, couponData);
    return response.data;
  },

  // Delete coupon
  async deleteCoupon(couponId) {
    const response = await api.delete(`/coupons/${couponId}`);
    return response.data;
  },

  // Toggle coupon active status
  async toggleCouponActive(couponId) {
    const response = await api.patch(`/coupons/${couponId}/toggle`);
    return response.data;
  }
};