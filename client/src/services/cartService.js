import api from './api';
export const cartService = {
  
async addItemToCart(productId, quantity) {
  const itemData = {
    productId,
    quantity
  };

  const response = await api.post('/cart/items', itemData);
  return response.data.items;
},
    
  async getCart() {  
    const response = await api.get('/cart/items');
    return response.data.items;
    },

  async updateCart(productId, quantity, attributes) {
    const response = await api.put(`/cart/items/${productId}`, { quantity, attributes });
    return response.data.items;
    }
};