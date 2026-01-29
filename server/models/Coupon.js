// server/models/Coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Coupon code cannot be more than 20 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  discountType: {
    type: String,
    required: true,
    enum: {
      values: ['percentage', 'fixed'],
      message: 'Discount type must be either percentage or fixed'
    }
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maximumDiscountAmount: {
    type: Number,
    min: [0, 'Maximum discount amount cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional end date
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  usageLimit: {
    type: Number,
    min: [1, 'Usage limit must be at least 1'],
    default: null
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  onePerUser: {
    type: Boolean,
    default: false
  },
  categories: [{
    type: String,
    enum: ['clothing', 'gadgets', 'civil-engineering-tools']
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
couponSchema.index({ code: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });
couponSchema.index({ active: 1 });

// Virtual for checking if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  const now = new Date();
  return this.endDate && this.endDate < now;
});

// Virtual for checking if coupon is active (considering dates)
couponSchema.virtual('isActive').get(function() {
  const now = new Date();
  const isWithinDateRange = now >= this.startDate && 
    (!this.endDate || now <= this.endDate);
  
  return this.active && 
         isWithinDateRange && 
         (!this.usageLimit || this.usedCount < this.usageLimit);
});

// Virtual for remaining uses
couponSchema.virtual('remainingUses').get(function() {
  if (!this.usageLimit) return null;
  return Math.max(0, this.usageLimit - this.usedCount);
});

// Static method to validate and apply coupon
couponSchema.statics.validateCoupon = async function(code, userId, cartAmount = 0, productIds = []) {
  const coupon = await this.findOne({ 
    code: code.toUpperCase(),
    active: true
  }).populate('products', 'category').populate('excludedProducts');

  if (!coupon) {
    throw new Error('Coupon not found or inactive');
  }

  const now = new Date();
  
  // Check date validity
  if (now < coupon.startDate) {
    throw new Error('Coupon is not yet active');
  }

  if (coupon.endDate && now > coupon.endDate) {
    throw new Error('Coupon has expired');
  }

  // Check usage limits
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error('Coupon usage limit reached');
  }

  // Check if user has already used this coupon (for onePerUser coupons)
  if (coupon.onePerUser && userId) {
    const userUsedCoupon = coupon.usedBy.some(user => 
      user.toString() === userId.toString()
    );
    if (userUsedCoupon) {
      throw new Error('You have already used this coupon');
    }
  }

  // Check minimum order amount
  if (cartAmount < coupon.minimumOrderAmount) {
    throw new Error(`Minimum order amount of $${coupon.minimumOrderAmount} required`);
  }

  // Check category restrictions
  if (coupon.categories.length > 0 && productIds.length > 0) {
    const products = await mongoose.model('Product').find({
      _id: { $in: productIds },
      category: { $in: coupon.categories }
    });
    
    if (products.length === 0) {
      throw new Error('Coupon not applicable to any products in cart');
    }
  }

  // Check product restrictions
  if (coupon.products.length > 0 && productIds.length > 0) {
    const applicableProducts = productIds.some(productId =>
      coupon.products.some(couponProduct => 
        couponProduct._id.toString() === productId.toString()
      )
    );
    
    if (!applicableProducts) {
      throw new Error('Coupon not applicable to products in cart');
    }
  }

  // Check excluded products
  if (coupon.excludedProducts.length > 0 && productIds.length > 0) {
    const hasExcludedProducts = productIds.some(productId =>
      coupon.excludedProducts.some(excludedProduct => 
        excludedProduct._id.toString() === productId.toString()
      )
    );
    
    if (hasExcludedProducts) {
      throw new Error('Coupon cannot be applied to some products in cart');
    }
  }

  return coupon;
};

// Instance method to calculate discount amount
couponSchema.methods.calculateDiscount = function(subtotal) {
  let discountAmount = 0;

  if (this.discountType === 'percentage') {
    discountAmount = (subtotal * this.discountValue) / 100;
  } else {
    discountAmount = this.discountValue;
  }

  // Apply maximum discount limit if set
  if (this.maximumDiscountAmount && discountAmount > this.maximumDiscountAmount) {
    discountAmount = this.maximumDiscountAmount;
  }

  // Ensure discount doesn't exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  return Math.round(discountAmount * 100) / 100; // Round to 2 decimal places
};

// Instance method to mark coupon as used
couponSchema.methods.markAsUsed = async function(userId) {
  this.usedCount += 1;
  
  if (userId && !this.usedBy.includes(userId)) {
    this.usedBy.push(userId);
  }
  
  await this.save();
};

// Middleware to validate discount values based on type
couponSchema.pre('save', function(next) {
  if (this.discountType === 'percentage' && this.discountValue > 100) {
    next(new Error('Percentage discount cannot exceed 100%'));
  }
  
  if (this.maximumDiscountAmount && this.discountType === 'fixed') {
    if (this.maximumDiscountAmount < this.discountValue) {
      next(new Error('Maximum discount amount cannot be less than fixed discount value'));
    }
  }
  
  next();
});

// Method to check if coupon can be applied to a specific product
couponSchema.methods.canApplyToProduct = function(productId, productCategory) {
  // Check excluded products
  if (this.excludedProducts.some(product => 
    product._id.toString() === productId.toString()
  )) {
    return false;
  }

  // Check specific products
  if (this.products.length > 0) {
    const isIncluded = this.products.some(product => 
      product._id.toString() === productId.toString()
    );
    if (!isIncluded) return false;
  }

  // Check categories
  if (this.categories.length > 0) {
    const isInCategory = this.categories.includes(productCategory);
    if (!isInCategory) return false;
  }

  return true;
};

export default mongoose.model('Coupon', couponSchema);