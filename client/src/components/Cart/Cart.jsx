// client/src/pages/Cart/Cart.jsx
import React from 'react';
import CartSummary from '../../components/Cart/CartSummary';
import CartItem from '../../components/Cart/CartItem';
import { useCart } from '../../contexts/CartContext';
import Loading from '../Shared/Loading';

const Cart = () => {
  const { cart, loading } = useCart();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItem key={`${item.product._id}-${JSON.stringify(item.attributes)}`} item={item} />
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;