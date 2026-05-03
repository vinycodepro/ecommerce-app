// client/src/services/adminService.js
import api from './api';

export const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get analytics data
  async getAnalytics(params = {}) {
    try {
      const response = await api.get('/analytics', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  },

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get sales report
  async getSalesReport(params = {}) {
    try {
      const response = await api.get('/analytics/sales', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw error;
    }
  },

  // Get customer analytics
  async getCustomerAnalytics(params = {}) {
    try {
      const response = await api.get('/analytics/customers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  },

  // Get product performance
  async getProductPerformance(params = {}) {
    try {
      const response = await api.get('/analytics/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching product performance data:', error);
      throw error;
    }
  },
  // Get recent orders
  async getRecentOrders() {
    try {
      const response = await api.get('/admin/orders?limit=5');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  },

  // Get all products
  async getProducts(params = {}) {
    try {
      const response = await api.get('/admin/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Create product
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(productId, productData) {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get all orders
  async getOrders(params = {}) {
    try {
      const response = await api.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, statusData) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Get all users
  async getUsers(params = {}) {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Update user role
  async updateUserRole(userId, roleData) {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, roleData);
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Toggle user status
  async toggleUserStatus(userId) {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Get all coupons
  async getCoupons(params = {}) {
    try {
      const response = await api.get('/coupons', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  // Create coupon
  async createCoupon(couponData) {
    try {
      const response = await api.post('/coupons', couponData);
      return response.data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  },

  // Update coupon
  async updateCoupon(couponId, couponData) {
    try {
      const response = await api.put(`/coupons/${couponId}`, couponData);
      return response.data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  },

  // Delete coupon
  async deleteCoupon(couponId) {
    try {
      const response = await api.delete(`/coupons/${couponId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  },

  // Toggle coupon active status
  async toggleCouponActive(couponId) {
    try {
      const response = await api.patch(`/coupons/${couponId}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling coupon active status:', error);
      throw error;
    }
  }
};