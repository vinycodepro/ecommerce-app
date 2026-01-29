// client/src/components/Cart/CartItem.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
} from '@heroicons/react/24/solid';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CartItem = ({ item }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { updateCartItem, removeFromCart, moveToWishlist } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > 100) return;
    
    if (newQuantity > item.product.inventory.stock) {
      toast.error(`Only ${item.product.inventory.stock} items available in stock`);
      return;
    }

    setIsUpdating(true);
    try {
      await updateCartItem(item.product._id, newQuantity, item.attributes);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromCart(item.product._id, item.attributes);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleMoveToWishlist = async () => {
    try {
      await moveToWishlist(item.product._id);
      toast.success('Item moved to wishlist');
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      toast.error('Failed to move to wishlist');
    }
  };

  const calculateItemTotal = () => {
    return item.product.price * item.quantity;
  };

  const calculateDiscount = () => {
    if (!item.product.comparePrice || item.product.comparePrice <= item.product.price) {
      return 0;
    }
    return (item.product.comparePrice - item.product.price) * item.quantity;
  };

  const getStockStatus = () => {
    if (item.product.inventory.stock === 0) {
      return { status: 'out-of-stock', text: 'Out of stock', color: 'text-red-600' };
    }
    if (item.product.inventory.stock < 10) {
      return { status: 'low-stock', text: `Only ${item.product.inventory.stock} left`, color: 'text-orange-600' };
    }
    return { status: 'in-stock', text: 'In stock', color: 'text-green-600' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 ${
      isRemoving ? 'opacity-50' : ''
    }`}>
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link to={`/products/${item.product._id}`}>
            <img
              src={item.product.images[0]?.url || '/api/placeholder/200/200'}
              alt={item.product.name}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link 
                to={`/products/${item.product._id}`}
                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
              >
                {item.product.name}
              </Link>
              
              <p className="text-sm text-gray-500 mt-1">
                {item.product.brand}
              </p>

              {/* Attributes */}
              {(item.attributes?.size || item.attributes?.color) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.attributes.size && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Size: {item.attributes.size}
                    </span>
                  )}
                  {item.attributes.color && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      Color: {item.attributes.color}
                    </span>
                  )}
                </div>
              )}

              {/* Stock Status */}
              <div className={`text-sm font-medium mt-2 ${stockStatus.color}`}>
                {stockStatus.text}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex flex-col items-end space-y-2 ml-4">
              {/* Remove Button */}
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1 rounded disabled:opacity-50"
                title="Remove from cart"
              >
                <TrashIcon className="h-5 w-5" />
              </button>

              {/* Wishlist Button */}
              {isAuthenticated && (
                <button
                  onClick={handleMoveToWishlist}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded"
                  title="Move to wishlist"
                >
                  <HeartIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center justify-between mt-4 md:hidden">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1 rounded disabled:opacity-50"
                title="Remove from cart"
              >
                <TrashIcon className="h-5 w-5" />
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleMoveToWishlist}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded"
                  title="Move to wishlist"
                >
                  <HeartIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Qty:</span>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1 || stockStatus.status === 'out-of-stock'}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-l-lg"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                
                <span className="px-3 py-2 text-sm font-medium text-gray-900 min-w-12 text-center">
                  {isUpdating ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-4 rounded mx-auto"></div>
                  ) : (
                    item.quantity
                  )}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating || item.quantity >= item.product.inventory.stock || stockStatus.status === 'out-of-stock'}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-r-lg"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="text-right">
              {/* Discount Price */}
              {item.product.comparePrice && item.product.comparePrice > item.product.price && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 line-through">
                    ${(item.product.comparePrice * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Save ${calculateDiscount().toFixed(2)}
                  </span>
                </div>
              )}
              
              {/* Current Price */}
              <div className="text-lg font-semibold text-gray-900">
                ${calculateItemTotal().toFixed(2)}
              </div>
              
              {/* Unit Price */}
              <div className="text-sm text-gray-500">
                ${item.product.price.toFixed(2)} each
              </div>
            </div>
          </div>

          {/* Savings Breakdown */}
          {calculateDiscount() > 0 && (
            <div className="mt-2 p-2 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-800">You save:</span>
                <span className="font-semibold text-green-800">
                  ${calculateDiscount().toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Warning for low stock */}
          {stockStatus.status === 'low-stock' && (
            <div className="mt-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center text-sm text-orange-800">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Low stock - order soon!
              </div>
            </div>
          )}

          {/* Error for out of stock */}
          {stockStatus.status === 'out-of-stock' && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center text-sm text-red-800">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Currently unavailable
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;