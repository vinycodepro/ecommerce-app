// client/src/components/Checkout/OrderSummary.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TagIcon,
  TruckIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const OrderSummary = ({ 
  shippingCost = 0, 
  taxRate = 0.085, 
  showCheckoutButton = true,
  className = '',
  onCheckout,
  compact = false 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);

  const { 
    cart, 
    getCartTotal, 
    getCartDiscount, 
    getCartItemCount,
    clearCart 
  } = useCart();
  const { isAuthenticated } = useAuth();

  // Calculate totals
  const subtotal = getCartTotal();
  const itemDiscount = getCartDiscount();
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const tax = (subtotal - itemDiscount - couponDiscount) * taxRate;
  const finalTotal = Math.max(0, subtotal + shippingCost + tax - itemDiscount - couponDiscount);

  // Apply coupon code
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      // Simulate API call to validate coupon
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock coupon validation
      const mockCoupons = {
        'WELCOME10': { discount: 10, type: 'percentage', minOrder: 0, description: '10% off your order' },
        'SAVE20': { discount: 20, type: 'fixed', minOrder: 50, description: '$20 off orders over $50' },
        'FREESHIP': { discount: shippingCost, type: 'shipping', minOrder: 0, description: 'Free shipping' },
        'SUMMER25': { discount: 25, type: 'percentage', minOrder: 75, description: '25% off summer sale' }
      };

      const coupon = mockCoupons[couponCode.toUpperCase()];
      
      if (coupon) {
        if (subtotal < coupon.minOrder) {
          toast.error(`Minimum order of $${coupon.minOrder} required for this coupon`);
          return;
        }

        let discountAmount = 0;
        if (coupon.type === 'percentage') {
          discountAmount = (subtotal * coupon.discount) / 100;
        } else if (coupon.type === 'fixed') {
          discountAmount = coupon.discount;
        } else if (coupon.type === 'shipping') {
          discountAmount = coupon.discount;
        }

        // Ensure discount doesn't exceed subtotal
        discountAmount = Math.min(discountAmount, subtotal);

        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discountAmount,
          type: coupon.type,
          description: coupon.description
        });
        
        toast.success(`Coupon applied! ${coupon.description}`);
        setCouponCode('');
        setShowCouponForm(false);
      } else {
        toast.error('Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      return;
    }

    if (onCheckout) {
      onCheckout();
    }
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (cart.length === 0) return;

    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    clearCart();
    toast.success('Cart cleared');
  };

  if (cart.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto">
            <TruckIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-2 text-sm text-gray-500">
            Start adding some products to your cart
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Order Total</h3>
          <span className="text-lg font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}
        </p>
        {showCheckoutButton && (
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Checkout
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        <p className="text-sm text-gray-500 mt-1">
          {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'} in cart
        </p>
      </div>

      {/* Order Items Preview */}
      <div className="p-6 border-b border-gray-200">
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {cart.map((item, index) => (
            <div key={`${item.product._id}-${JSON.stringify(item.attributes)}`} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={item.product.images[0]?.url || '/api/placeholder/100/100'}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity}
                  {item.attributes?.size && ` • Size: ${item.attributes.size}`}
                  {item.attributes?.color && ` • Color: ${item.attributes.color}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                {item.product.comparePrice && item.product.comparePrice > item.product.price && (
                  <p className="text-xs text-green-600">
                    Save ${((item.product.comparePrice - item.product.price) * item.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="p-6 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        {/* Item Discount */}
        {itemDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Items Discount</span>
            <span className="font-medium text-green-600">-${itemDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {shippingCost === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
        </div>

        {/* Coupon Discount */}
        {appliedCoupon && (
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <span className="text-green-600">Coupon ({appliedCoupon.code})</span>
              <button
                onClick={handleRemoveCoupon}
                className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                title="Remove coupon"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
            <span className="font-medium text-green-600">-${couponDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* Free Shipping Progress */}
        {subtotal < 50 && shippingCost > 0 && (
          <div className="pt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Add ${(50 - subtotal).toFixed(2)} for free shipping</span>
              <span>{Math.min((subtotal / 50) * 100, 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {tax > 0 ? `Including $${tax.toFixed(2)} in taxes` : 'Tax included'}
          </p>
        </div>

        {/* Estimated Savings */}
        {(itemDiscount > 0 || couponDiscount > 0) && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm text-green-800">
              <span>You save:</span>
              <span className="font-semibold">
                ${(itemDiscount + couponDiscount).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Coupon Section */}
        <div className="pt-4">
          {!appliedCoupon ? (
            <>
              {!showCouponForm ? (
                <button
                  onClick={() => setShowCouponForm(true)}
                  className="w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 py-2"
                >
                  <TagIcon className="h-4 w-4 mr-1" />
                  Have a coupon code?
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowCouponForm(false)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">
                    {appliedCoupon.description}
                  </span>
                </div>
                <span className="text-sm font-medium text-blue-800">
                  -${appliedCoupon.discountAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Button */}
        {showCheckoutButton && (
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mt-4"
          >
            Proceed to Checkout
          </button>
        )}

        {/* Security & Trust Badges */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              Secure checkout
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              SSL encrypted
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 rounded-lg p-3 mt-4">
          <div className="flex items-start">
            <InformationCircleIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <p>Free returns within 30 days</p>
              <p className="mt-1">Shipping calculated at checkout</p>
            </div>
          </div>
        </div>

        {/* Clear Cart */}
        <div className="text-center pt-2">
          <button
            onClick={handleClearCart}
            className="text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            Clear shopping cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;