// CheckoutForm.stories.jsx

import CheckoutForm from './CheckoutForm';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../contexts/CartContext';
import { AuthProvider } from '../../contexts/AuthContext';

export default {
  title: 'Checkout/CheckoutForm',
  component: CheckoutForm,

  decorators: [
    (Story) => (
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Story />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
};

export const Default = {};