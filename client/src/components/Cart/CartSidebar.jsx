// client/src/components/Cart/CartSummary.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TruckIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  TagIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CartSummary = ({ onCheckout, showCheckoutButton = true, className = '' }) => {
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
  const navigate = useNavigate();

  // Calculate shipping (free over $50)
  const calculateShipping = () => {
    const subtotal = getCartTotal();
    return subtotal >= 50 ? 0 : 5.99;
  };

  // Calculate tax (8.5%)
  const calculateTax = () => {
    return getCartTotal() * 0.085;
  };

  // Calculate final total
  const calculateFinalTotal = () => {
    const subtotal = getCartTotal();
    const shipping = calculateShipping();
    const tax = calculateTax();
    const couponDiscount = appliedCoupon?.discountAmount || 0;
    
    return Math.max(0, subtotal + shipping + tax - couponDiscount);
  };

  // Apply coupon code
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      // Simulate API call to validate coupon
      // In a real app, you would call your coupon service here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock coupon validation
      const mockCoupons = {
        'WELCOME10': { discount: 10, type: 'percentage', minOrder: 0 },
        'SAVE20': { discount: 20, type: 'fixed', minOrder: 50 },
        'FREESHIP': { discount: calculateShipping(), type: 'shipping', minOrder: 0 }
      };

      const coupon = mockCoupons[couponCode.toUpperCase()];
      
      if (coupon) {
        if (getCartTotal() < coupon.minOrder) {
          toast.error(`Minimum order of $${coupon.minOrder} required for this coupon`);
          return;
        }

        let discountAmount = 0;
        if (coupon.type === 'percentage') {
          discountAmount = (getCartTotal() * coupon.discount) / 100;
        } else if (coupon.type === 'fixed') {
          discountAmount = coupon.discount;
        } else if (coupon.type === 'shipping') {
          discountAmount = coupon.discount;
        }

        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discountAmount,
          type: coupon.type
        });
        
        toast.success(`Coupon applied! ${coupon.type === 'shipping' ? 'Free shipping!' : `Saved $${discountAmount.toFixed(2)}`}`);
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
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
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
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
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

  const subtotal = getCartTotal();
  const shipping = calculateShipping();
  const tax = calculateTax();
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const finalTotal = calculateFinalTotal();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        <p className="text-sm text-gray-500 mt-1">
          {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'} in cart
        </p>
      </div>

      {/* Order Details */}
      <div className="p-6 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        {/* Cart Discount */}
        {getCartDiscount() > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Items Discount</span>
            <span className="font-medium text-green-600">-${getCartDiscount().toFixed(2)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
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
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            <span className="font-medium text-green-600">-${couponDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* Free Shipping Progress */}
        {subtotal < 50 && (
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
            Including ${tax.toFixed(2)} in taxes
          </p>
        </div>

        {/* Coupon Section */}
        <div className="pt-4">
          {!appliedCoupon ? (
            <>
              {!showCouponForm ? (
                <button
                  onClick={() => setShowCouponForm(true)}
                  className="w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
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
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
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
          ) : null}
        </div>

        {/* Checkout Button */}
        {showCheckoutButton && (
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        )}

        {/* Security & Trust Badges */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <LockClosedIcon className="h-4 w-4 text-green-500 mr-1" />
              Secure checkout
            </div>
            <div className="flex items-center">
              <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1" />
              Payment protected
            </div>
            <div className="flex items-center">
              <TruckIcon className="h-4 w-4 text-green-500 mr-1" />
              Free shipping
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Free returns within 30 days</p>
              <p className="mt-1">Not satisfied? Return your order for free.</p>
            </div>
          </div>
        </div>

        {/* Clear Cart */}
        <div className="text-center">
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

// Add these imports at the top if not already present

export default CartSummary;