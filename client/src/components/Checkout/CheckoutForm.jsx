// client/src/components/Checkout/CheckoutForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  MapPinIcon,
  TruckIcon,
  ShieldCheckIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, getCartItemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    shippingAddress: null,
    billingAddress: null,
    paymentMethod: 'card',
    paymentDetails: null,
    shippingMethod: 'standard',
    useSameAddress: true,
    notes: '',
    couponCode: '',
  });

  const steps = [
    { id: 1, name: 'Shipping', icon: MapPinIcon },
    { id: 2, name: 'Payment', icon: CreditCardIcon },
    { id: 3, name: 'Review', icon: ShieldCheckIcon },
  ];

  useEffect(() => {
    // Redirect if cart is empty or user not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
  }, [cart, isAuthenticated, navigate]);

  const handleShippingAddressSubmit = (addressData) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: addressData,
      billingAddress: prev.useSameAddress ? addressData : prev.billingAddress
    }));
    setCurrentStep(2);
    toast.success('Shipping address saved');
  };

  const handleBillingAddressSubmit = (addressData) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: addressData,
      useSameAddress: false
    }));
  };

  const handlePaymentSubmit = (paymentData) => {
    setFormData(prev => ({
      ...prev,
      paymentDetails: paymentData
    }));
    setCurrentStep(3);
    toast.success('Payment method saved');
  };

  const handleShippingMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      shippingMethod: method
    }));
  };

  const handleUseSameAddressChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      useSameAddress: checked,
      billingAddress: checked ? prev.shippingAddress : prev.billingAddress
    }));
  };

  const handleNotesChange = (notes) => {
    setFormData(prev => ({
      ...prev,
      notes
    }));
  };

  const validateForm = () => {
    if (!formData.shippingAddress) {
      toast.error('Please provide a shipping address');
      setCurrentStep(1);
      return false;
    }

    if (!formData.billingAddress) {
      toast.error('Please provide a billing address');
      setCurrentStep(1);
      return false;
    }

    if (!formData.paymentDetails) {
      toast.error('Please provide payment details');
      setCurrentStep(2);
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          attributes: item.attributes
        })),
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress,
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        notes: formData.notes,
        couponCode: formData.couponCode || undefined,
      };

      const response = await orderService.createOrder(orderData);
      
      toast.success('Order placed successfully!');
      
      // Clear cart
      await clearCart();
      
      // Redirect to order confirmation
      navigate(`/orders/${response.order._id}`, { 
        state: { 
          order: response.order,
          success: true 
        } 
      });

    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 5.99,
      freeThreshold: 50,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 12.99,
      freeThreshold: 100,
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 24.99,
      freeThreshold: 200,
    },
  ];

  const getShippingCost = () => {
    const method = shippingMethods.find(m => m.id === formData.shippingMethod);
    const subtotal = getCartTotal();
    
    if (method && subtotal >= method.freeThreshold) {
      return 0;
    }
    
    return method ? method.price : 0;
  };

  const shippingCost = getShippingCost();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete your purchase in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  className={`relative flex-1 ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep >= step.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <step.icon
                        className={`w-5 h-5 ${
                          currentStep >= step.id ? 'text-white' : 'text-gray-500'
                        }`}
                      />
                    </div>
                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-10 -ml-px h-0.5 w-full ${
                          currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {/* Step 1: Shipping Address */}
              {currentStep >= 1 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Shipping Address
                    </h2>
                    {currentStep > 1 && (
                      <button
                        onClick={() => goToStep(1)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {!formData.shippingAddress ? (
                    <AddressForm
                      onAddressSubmit={handleShippingAddressSubmit}
                      mode="shipping"
                      showSaveOption={true}
                    />
                  ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {formData.shippingAddress.fullName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {formData.shippingAddress.street}
                            {formData.shippingAddress.apartment && `, ${formData.shippingAddress.apartment}`}
                            <br />
                            {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.zipCode}
                            <br />
                            {formData.shippingAddress.country}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {formData.shippingAddress.phone}
                          </p>
                        </div>
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, shippingAddress: null }))}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Payment & Billing */}
              {currentStep >= 2 && formData.shippingAddress && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Payment Method
                    </h2>
                    {currentStep > 2 && (
                      <button
                        onClick={() => goToStep(2)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <PaymentForm
                    onPaymentSubmit={handlePaymentSubmit}
                    initialData={formData.paymentDetails}
                  />

                  {/* Billing Address */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Billing Address
                    </h3>
                    
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.useSameAddress}
                          onChange={(e) => handleUseSameAddressChange(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          Same as shipping address
                        </span>
                      </label>
                    </div>

                    {!formData.useSameAddress && (
                      <AddressForm
                        onAddressSubmit={handleBillingAddressSubmit}
                        mode="billing"
                        showSaveOption={true}
                        initialAddress={formData.billingAddress}
                      />
                    )}

                    {formData.useSameAddress && formData.billingAddress && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {formData.billingAddress.fullName}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formData.billingAddress.street}
                              {formData.billingAddress.apartment && `, ${formData.billingAddress.apartment}`}
                              <br />
                              {formData.billingAddress.city}, {formData.billingAddress.state} {formData.billingAddress.zipCode}
                              <br />
                              {formData.billingAddress.country}
                            </p>
                          </div>
                          <button
                            onClick={() => handleUseSameAddressChange(false)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shipping Method */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Shipping Method
                    </h3>
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                            formData.shippingMethod === method.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping-method"
                            value={method.id}
                            checked={formData.shippingMethod === method.id}
                            onChange={(e) => handleShippingMethodChange(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <span className="font-medium text-gray-900">
                                  {method.name}
                                </span>
                                <p className="text-gray-500">
                                  {method.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {getCartTotal() >= method.freeThreshold ? (
                                <span className="text-green-600">FREE</span>
                              ) : (
                                `$${method.price.toFixed(2)}`
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="mt-8">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Special instructions for your order..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review & Place Order */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Review Your Order
                  </h2>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="space-y-6">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                          Order Items ({getCartItemCount()})
                        </h3>
                        <div className="space-y-3">
                          {cart.map((item) => (
                            <div key={`${item.product._id}-${JSON.stringify(item.attributes)}`} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <img
                                  src={item.product.images[0]?.url || '/api/placeholder/100/100'}
                                  alt={item.product.name}
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.product.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                    {item.attributes?.size && ` • Size: ${item.attributes.size}`}
                                    {item.attributes?.color && ` • Color: ${item.attributes.color}`}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Shipping Address
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formData.shippingAddress.fullName}<br />
                          {formData.shippingAddress.street}
                          {formData.shippingAddress.apartment && `, ${formData.shippingAddress.apartment}`}<br />
                          {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.zipCode}<br />
                          {formData.shippingAddress.country}<br />
                          {formData.shippingAddress.phone}
                        </p>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Payment Method
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formData.paymentDetails?.cardBrand} ending in {formData.paymentDetails?.last4}<br />
                          Expires {formData.paymentDetails?.expMonth}/{formData.paymentDetails?.expYear}
                        </p>
                      </div>

                      {/* Shipping Method */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Shipping Method
                        </h3>
                        <p className="text-sm text-gray-600">
                          {shippingMethods.find(m => m.id === formData.shippingMethod)?.name}
                        </p>
                      </div>

                      {/* Order Notes */}
                      {formData.notes && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">
                            Order Notes
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formData.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <OrderSummary
              shippingCost={shippingCost}
              showCheckoutButton={false}
              className="sticky top-4"
            />

            {/* Place Order Button */}
            {currentStep === 3 && (
              <div className="mt-6">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !formData.paymentDetails}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="h-5 w-5 mr-2" />
                      Place Order
                    </>
                  )}
                </button>
                
                {/* Security Badges */}
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1" />
                    256-bit SSL Secure
                  </div>
                  <div className="flex items-center">
                    <TruckIcon className="h-4 w-4 text-green-500 mr-1" />
                    Free Returns
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;