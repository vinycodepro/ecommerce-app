// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    attributes: {
      size: String,
      color: String
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  payment: {
    method: {
      type: String,
      enum: ['stripe', 'paypal'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentIntentId: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shipping: {
    method: String,
    trackingNumber: String,
    cost: Number,
    estimatedDelivery: Date
  },
  coupon: {
    code: String,
    discount: Number
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('validate', function(next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
  }

  next();
});

export default mongoose.model('Order', orderSchema);