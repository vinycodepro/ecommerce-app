// server/routes/reviews.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { productId, rating, title, comment } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.active) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      status: 'delivered',
      'items.product': productId
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'You can only review products you have purchased' 
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this product' 
      });
    }

    // Create review
    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      title: title?.trim(),
      comment: comment?.trim()
    });

    await review.save();

    // Populate user info for response
    await review.populate('user', 'name avatar');

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error creating review' });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      rating,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Check if product exists
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const filter = { product: req.params.productId };
    
    // Filter by rating if provided
    if (rating) {
      filter.rating = parseInt(rating);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const reviews = await Review.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name avatar')
      .select('-product');

    const total = await Review.countDocuments(filter);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Calculate average rating (could use product.rating but this is more accurate)
    const ratingStats = await Review.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalReviews: total,
      ratingDistribution,
      averageRating: ratingStats[0]?.average || 0,
      totalRatings: ratingStats[0]?.count || 0
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// @route   GET /api/reviews/user
// @desc    Get current user's reviews
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10 
    } = req.query;

    const reviews = await Review.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('product', 'name images price')
      .select('-user');

    const total = await Review.countDocuments({ user: req.user.id });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalReviews: total
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error fetching user reviews' });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('product', 'name images');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Get review error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).json({ message: 'Server error fetching review' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, title, comment } = req.body;

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title.trim();
    if (comment !== undefined) review.comment = comment.trim();
    
    review.editedAt = new Date();

    await review.save();
    await review.populate('user', 'name avatar');

    // Update product rating if rating changed
    if (rating !== undefined) {
      await updateProductRating(review.product);
    }

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error updating review' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const productId = review.product;
    
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
});

// @route   GET /api/reviews
// @desc    Get all reviews (Admin only)
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      productId,
      userId,
      rating,
      reported,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter = {};
    
    if (productId) filter.product = productId;
    if (userId) filter.user = userId;
    if (rating) filter.rating = parseInt(rating);
    if (reported === 'true') filter.reported = true;

    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const reviews = await Review.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email avatar')
      .populate('product', 'name images');

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalReviews: total
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// @route   POST /api/reviews/:id/report
// @desc    Report a review
// @access  Private
router.post('/:id/report', auth, [
  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user has already reported this review
    const alreadyReported = review.reports.some(
      report => report.user.toString() === req.user.id
    );

    if (alreadyReported) {
      return res.status(400).json({ 
        message: 'You have already reported this review' 
      });
    }

    // Add report
    review.reports.push({
      user: req.user.id,
      reason: reason.trim(),
      reportedAt: new Date()
    });

    review.reported = review.reports.length > 0;

    await review.save();

    res.json({ 
      message: 'Review reported successfully',
      reportCount: review.reports.length
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({ message: 'Server error reporting review' });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user has already marked this review as helpful
    const alreadyHelpful = review.helpfulVotes.some(
      vote => vote.user.toString() === req.user.id
    );

    if (alreadyHelpful) {
      // Remove helpful vote
      review.helpfulVotes = review.helpfulVotes.filter(
        vote => vote.user.toString() !== req.user.id
      );
    } else {
      // Add helpful vote
      review.helpfulVotes.push({
        user: req.user.id,
        votedAt: new Date()
      });
    }

    await review.save();

    res.json({
      message: alreadyHelpful ? 'Removed helpful vote' : 'Marked as helpful',
      helpfulCount: review.helpfulVotes.length,
      userVoted: !alreadyHelpful
    });
  } catch (error) {
    console.error('Helpful vote error:', error);
    res.status(500).json({ message: 'Server error updating helpful vote' });
  }
});

// @route   PATCH /api/reviews/:id/approve
// @desc    Approve a reported review (Admin only)
// @access  Private/Admin
router.patch('/:id/approve', auth, admin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.reported = false;
    review.reports = []; // Clear all reports
    await review.save();

    res.json({ 
      message: 'Review approved and reports cleared',
      review
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ message: 'Server error approving review' });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const ratingStats = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    const product = await Product.findById(productId);
    if (product) {
      product.rating.average = ratingStats[0]?.average || 0;
      product.rating.count = ratingStats[0]?.count || 0;
      await product.save();
    }
  } catch (error) {
    console.error('Update product rating error:', error);
    throw error;
  }
}

export default router;