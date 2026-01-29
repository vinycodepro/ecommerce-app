import api from './api';
export const cartService = {
  // Add item to cart
  async addItemToCart(itemData) {
    const response = await api.post('/cart/items', itemData);
    return response.data;
  },
    // Get cart items
    async getCartItems() {  
    const response = await api.get('/cart/items');
    return response.data;
    }
};
