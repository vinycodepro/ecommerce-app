// client/src/components/Checkout/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const PaymentForm = ({ onPaymentSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveCard: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardType, setCardType] = useState('');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCardIcon,
      description: 'Pay with Visa, Mastercard, American Express',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.5 14.25c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm15-5.25c0 5-4 9-9 9H8.4l-2.9 2.9c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l2.9-2.9H13.5c5 0 9-4 9-9s-4-9-9-9-9 4-9 9c0 1.3.3 2.6.8 3.8.1.3.1.6.1.9 0 .8-.3 1.6-.9 2.2-.6.6-1.4.9-2.2.9-.3 0-.6 0-.9-.1-1.2-.5-2.5-.8-3.8-.8-1.3 0-2.6.3-3.8.8-.3.1-.6.1-.9.1-.8 0-1.6-.3-2.2-.9-.6-.6-.9-1.4-.9-2.2 0-.3 0-.6.1-.9C.3 6.6 0 5.3 0 4c0-5 4-9 9-9s9 4 9 9z"/>
        </svg>
      ),
      description: 'Pay with your PayPal account',
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      icon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      description: 'Pay with Apple Pay',
    },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  // Detect card type based on card number
  useEffect(() => {
    const number = formData.cardNumber.replace(/\s/g, '');
    if (number.length < 4) {
      setCardType('');
      return;
    }

    // Card type detection patterns
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        setCardType(type);
        return;
      }
    }

    setCardType('');
  }, [formData.cardNumber]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }
    
    // Format CVV (numbers only, max 4)
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMethodChange = (methodId) => {
    setFormData(prev => ({
      ...prev,
      method: methodId
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.method === 'card') {
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      
      if (!cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardNumber.length < 13) {
        newErrors.cardNumber = 'Card number is too short';
      } else if (!luhnCheck(cardNumber)) {
        newErrors.cardNumber = 'Invalid card number';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!isValidExpiry(formData.expiryDate)) {
        newErrors.expiryDate = 'Invalid expiry date';
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (formData.cvv.length < 3) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }

      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Luhn algorithm for card validation
  const luhnCheck = (cardNumber) => {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const isValidExpiry = (expiry) => {
    const [month, year] = expiry.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payment data
      const paymentData = {
        method: formData.method,
        ...(formData.method === 'card' && {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardholderName: formData.cardholderName,
          cardType: cardType,
          last4: formData.cardNumber.slice(-4),
        }),
        saveCard: formData.saveCard,
      };

      if (onPaymentSubmit) {
        await onPaymentSubmit(paymentData);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardIcon = () => {
    if (!cardType) return <CreditCardIcon className="h-6 w-6" />;
    
    const icons = {
      visa: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1A1F71">
          <path d="M9.6 15.6h1.8l1.1-6.8H9.6l1.1 6.8zm4.5 0h1.8l1.2-6.8h-1.8l-1.2 6.8zm4.5 0h1.8l1.5-6.8h-1.8l-1.5 6.8zm-12.6 0h2.1l.9-6.8H6.9l-.9 6.8z"/>
        </svg>
      ),
      mastercard: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#EB001B">
          <path d="M15.3 8.3c-1.2 0-2.3.5-3.1 1.3.8.8 1.3 1.9 1.3 3.1s-.5 2.3-1.3 3.1c.8.8 1.9 1.3 3.1 1.3s2.3-.5 3.1-1.3c-.8-.8-1.3-1.9-1.3-3.1s.5-2.3 1.3-3.1c-.8-.8-1.9-1.3-3.1-1.3z"/>
          <path d="M12 12c0-1.2.5-2.3 1.3-3.1-1.6-1.6-4.1-1.6-5.7 0-.8.8-1.3 1.9-1.3 3.1s.5 2.3 1.3 3.1c1.6 1.6 4.1 1.6 5.7 0-.8-.8-1.3-1.9-1.3-3.1z" fill="#F79E1B"/>
        </svg>
      ),
      amex: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#2E77BC">
          <path d="M6.5 15.5h11v-1.5h-11v1.5zm0-3h11v-1.5h-11v1.5zm0-3h11v-1.5h-11v1.5z"/>
        </svg>
      ),
      discover: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#FF6000">
          <path d="M12 6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0-2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"/>
        </svg>
      ),
    };

    return icons[cardType] || <CreditCardIcon className="h-6 w-6" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <CreditCardIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Method
          </h2>
          <p className="text-sm text-gray-500">
            Choose how you want to pay
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Payment Method
        </label>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                formData.method === method.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={method.id}
                checked={formData.method === method.id}
                onChange={() => handleMethodChange(method.id)}
                className="sr-only"
              />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg border border-gray-300">
                    <method.icon />
                  </div>
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900">
                      {method.name}
                    </span>
                    <p className="text-xs text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </div>
                {formData.method === method.id && (
                  <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Card Payment Form */}
      {formData.method === 'card' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                required
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={`block w-full border rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200 ${
                  errors.cardNumber 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                maxLength={19}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {getCardIcon()}
              </div>
            </div>
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>

          {/* Cardholder Name */}
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              required
              value={formData.cardholderName}
              onChange={handleInputChange}
              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200 ${
                errors.cardholderName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="John Doe"
            />
            {errors.cardholderName && (
              <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200 ${
                  errors.expiryDate 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                maxLength={5}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  required
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200 ${
                    errors.cvv 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  maxLength={4}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      // Show CVV info tooltip
                      alert('The CVV is the 3-digit code on the back of your card (4 digits for American Express)');
                    }}
                  >
                    <InformationCircleIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Save Card Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCard"
              name="saveCard"
              checked={formData.saveCard}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-900">
              Save card for future purchases
            </label>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <LockClosedIcon className="h-5 w-5 text-blue-400 mr-2" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Your payment is secure</p>
                <p className="mt-1">We use 256-bit SSL encryption to protect your information</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Continue to Review'
              )}
            </button>
          </div>
        </form>
      )}

      {/* PayPal Payment */}
      {formData.method === 'paypal' && (
        <div className="text-center">
          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.5 14.25c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm15-5.25c0 5-4 9-9 9H8.4l-2.9 2.9c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l2.9-2.9H13.5c5 0 9-4 9-9s-4-9-9-9-9 4-9 9c0 1.3.3 2.6.8 3.8.1.3.1.6.1.9 0 .8-.3 1.6-.9 2.2-.6.6-1.4.9-2.2.9-.3 0-.6 0-.9-.1-1.2-.5-2.5-.8-3.8-.8-1.3 0-2.6.3-3.8.8-.3.1-.6.1-.9.1-.8 0-1.6-.3-2.2-.9-.6-.6-.9-1.4-.9-2.2 0-.3 0-.6.1-.9C.3 6.6 0 5.3 0 4c0-5 4-9 9-9s9 4 9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              PayPal Checkout
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You'll be redirected to PayPal to complete your payment securely
            </p>
            <button
              type="button"
              onClick={() => onPaymentSubmit({ method: 'paypal' })}
              className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
            >
              Continue with PayPal
            </button>
          </div>
        </div>
      )}

      {/* Apple Pay Payment */}
      {formData.method === 'apple-pay' && (
        <div className="text-center">
          <div className="bg-black rounded-lg p-6">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Apple Pay
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Pay securely with Apple Pay using your saved payment methods
            </p>
            <button
              type="button"
              onClick={() => onPaymentSubmit({ method: 'apple-pay' })}
              className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
            >
              Continue with Apple Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;