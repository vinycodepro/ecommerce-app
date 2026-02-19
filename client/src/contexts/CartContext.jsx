// client/src/contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      loadLocalCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCart(cartData || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocalCart = (cartItems) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const updateCartItem = async (productId, quantity, attributes = {}) => {
    try {
      let updatedCart;
      
      if (isAuthenticated) {
        const response = await cartService.updateCart([{ product: productId, quantity, attributes }]);
        updatedCart = response.cart;
      } else {
        updatedCart = cart.map(item =>
          item.product._id === productId && JSON.stringify(item.attributes) === JSON.stringify(attributes)
            ? { ...item, quantity }
            : item
        );
        saveLocalCart(updatedCart);
      }
      
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId, attributes = {}) => {
    try {
      let updatedCart;
      
      if (isAuthenticated) {
        // For authenticated users, we need to update the entire cart
        const newCart = cart.filter(item =>
          !(item.product._id === productId && JSON.stringify(item.attributes) === JSON.stringify(attributes))
        );
        const response = await cartService.updateCart(newCart);
        updatedCart = response.cart;
      } else {
        updatedCart = cart.filter(item =>
          !(item.product._id === productId && JSON.stringify(item.attributes) === JSON.stringify(attributes))
        );
        saveLocalCart(updatedCart);
      }
      
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const moveToWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        await cartService.moveToWishlist(productId);
        // Remove from cart after moving to wishlist
        await removeFromCart(productId);
      } else {
        toast.error('Please login to use wishlist');
      }
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      throw error;
    }
  };

  const getCartItemCount = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartDiscount = () => {
    return cart.reduce((total, item) => {
      if (item.product.comparePrice && item.product.comparePrice > item.product.price) {
        return total + ((item.product.comparePrice - item.product.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartService.updateCart([]);
      } else {
        localStorage.removeItem('cart');
      }
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const value = {
    cart,
    loading,
    updateCartItem,
    removeFromCart,
    moveToWishlist,
    getCartItemCount,
    getCartTotal,
    getCartDiscount,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };