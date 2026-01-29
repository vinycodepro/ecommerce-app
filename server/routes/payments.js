// server/routes/payments.js

import express from 'express';
import Stripe from 'stripe';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', auth, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('paymentMethodId')
    .optional()
    .isString()
    .withMessage('Valid payment method ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { orderId, paymentMethodId, savePaymentMethod = false } = req.body;

    // Find order
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to user
    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order is already paid
    if (order.payment.status === 'completed') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Check if order is cancelled
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is cancelled' });
    }

    // Create Stripe customer if not exists
    let customer;
    const user = await User.findById(req.user.id);
    
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create payment intent
    const paymentIntentData = {
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      customer: customer.id,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id,
        orderNumber: order.orderNumber
      },
      description: `Payment for order ${order.orderNumber}`,
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // If payment method is provided, attach it
    if (paymentMethodId) {
      paymentIntentData.payment_method = paymentMethodId;
      paymentIntentData.confirm = true;
      paymentIntentData.return_url = `${process.env.CLIENT_URL}/orders/${order._id}`;
    }

    // Setup future usage if user wants to save payment method
    if (savePaymentMethod) {
      paymentIntentData.setup_future_usage = 'on_session';
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    // Update order with payment intent ID
    order.payment.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      requiresAction: paymentIntent.status === 'requires_action',
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ 
      message: 'Error creating payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm and process payment
// @access  Private
router.post('/confirm-payment', auth, [
  body('paymentIntentId')
    .isString()
    .withMessage('Valid payment intent ID is required'),
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId, orderId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify payment intent matches order
    if (order.payment.paymentIntentId !== paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent mismatch' });
    }

    // Handle different payment intent statuses
    switch (paymentIntent.status) {
      case 'succeeded':
        // Payment completed successfully
        order.payment.status = 'completed';
        order.payment.transactionId = paymentIntent.id;
        order.status = 'confirmed'; // Move to next status
        
        await order.save();

        // Here you would typically:
        // 1. Send confirmation email to customer
        // 2. Update inventory (already done during order creation)
        // 3. Send notification to admin

        res.json({
          success: true,
          message: 'Payment completed successfully',
          order: await Order.findById(orderId).populate('items.product', 'name images')
        });
        break;

      case 'requires_action':
        // Payment requires additional action (3D Secure, etc.)
        res.json({
          requiresAction: true,
          clientSecret: paymentIntent.client_secret,
          status: paymentIntent.status
        });
        break;

      case 'requires_payment_method':
        // Payment failed, ask user to try another payment method
        order.payment.status = 'failed';
        await order.save();

        res.status(400).json({
          success: false,
          message: 'Payment failed. Please try another payment method.',
          status: paymentIntent.status
        });
        break;

      default:
        // Handle other statuses
        res.status(400).json({
          success: false,
          message: `Payment status: ${paymentIntent.status}`,
          status: paymentIntent.status
        });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ 
      message: 'Error confirming payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public (called by Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Webhook handler functions
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const order = await Order.findOne({ 
      'payment.paymentIntentId': paymentIntent.id 
    });

    if (order && order.payment.status !== 'completed') {
      order.payment.status = 'completed';
      order.payment.transactionId = paymentIntent.id;
      order.status = 'confirmed';
      
      await order.save();
      
      console.log(`Order ${order.orderNumber} payment confirmed via webhook`);
      
      // Here you would typically:
      // - Send confirmation email
      // - Update analytics
      // - Notify admin
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const order = await Order.findOne({ 
      'payment.paymentIntentId': paymentIntent.id 
    });

    if (order) {
      order.payment.status = 'failed';
      await order.save();
      
      console.log(`Order ${order.orderNumber} payment failed`);
      
      // Here you would typically notify the user
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
    throw error;
  }
}

async function handleChargeRefunded(charge) {
  try {
    const order = await Order.findOne({ 
      'payment.transactionId': charge.payment_intent 
    });

    if (order) {
      order.payment.status = 'refunded';
      await order.save();
      
      console.log(`Order ${order.orderNumber} refund processed`);
      
      // Here you would typically:
      // - Restore product stock
      // - Send refund confirmation email
      // - Update analytics
    }
  } catch (error) {
    console.error('Error handling charge refunded:', error);
    throw error;
  }
}

// @route   POST /api/payments/refund
// @desc    Process refund for an order
// @access  Private/Admin
router.post('/refund', auth, admin, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Refund amount must be positive'),
  body('reason')
    .optional()
    .isString()
    .withMessage('Valid reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, amount, reason = 'Customer request' } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.payment.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot refund unpaid order' });
    }

    if (!order.payment.transactionId) {
      return res.status(400).json({ message: 'No transaction ID found for order' });
    }

    // Create refund in Stripe
    const refundData = {
      payment_intent: order.payment.transactionId,
      reason: 'requested_by_customer',
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        adminId: req.user.id,
        reason: reason
      }
    };

    // Partial refund if amount specified
    if (amount && amount < order.totalAmount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundData);

    // Update order status
    order.payment.status = 'refunded';
    if (amount && amount < order.totalAmount) {
      order.refundAmount = amount;
    }
    
    await order.save();

    // Restore product stock for full refunds
    if (!amount || amount === order.totalAmount) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.inventory.stock += item.quantity;
          await product.save();
        }
      }
    }

    res.json({
      message: 'Refund processed successfully',
      refundId: refund.id,
      order
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ 
      message: 'Error processing refund',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/payments/methods
// @desc    Get user's saved payment methods
// @access  Private
router.get('/methods', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.stripeCustomerId) {
      return res.json({ paymentMethods: [] });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card'
    });

    res.json({
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        type: pm.type,
        card: {
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year
        }
      }))
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Error fetching payment methods' });
  }
});

// @route   DELETE /api/payments/methods/:paymentMethodId
// @desc    Delete a saved payment method
// @access  Private
router.delete('/methods/:paymentMethodId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.stripeCustomerId) {
      return res.status(404).json({ message: 'No saved payment methods found' });
    }

    // Verify the payment method belongs to the customer
    const paymentMethod = await stripe.paymentMethods.retrieve(
      req.params.paymentMethodId
    );

    if (paymentMethod.customer !== user.stripeCustomerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await stripe.paymentMethods.detach(req.params.paymentMethodId);

    res.json({ message: 'Payment method removed successfully' });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ message: 'Error removing payment method' });
  }
});

// @route   GET /api/payments/order/:orderId
// @desc    Get payment details for an order
// @access  Private
router.get('/order/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to user or user is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    let paymentIntent = null;
    if (order.payment.paymentIntentId) {
      try {
        paymentIntent = await stripe.paymentIntents.retrieve(
          order.payment.paymentIntentId
        );
      } catch (error) {
        console.error('Error retrieving payment intent:', error);
      }
    }

    res.json({
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        payment: order.payment
      },
      paymentIntent: paymentIntent ? {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        created: paymentIntent.created
      } : null
    });
  } catch (error) {
    console.error('Get order payment details error:', error);
    res.status(500).json({ message: 'Error fetching payment details' });
  }
});

export default router;