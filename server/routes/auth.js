// server/routes/auth.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar
});

router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

  const { name, email, password } = req.body;

   const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({ 
      name: name.trim(),
      email: email.toLowerCase(),
      password 
    });

    await user.save();

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .exists()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }

    // Generate token and set cookie
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Exchange a Google Identity Services credential for the application's JWT.
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ message: 'Google sign-in is not configured' });
    }

    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    if (!googleResponse.ok) {
      return res.status(401).json({ message: 'Invalid Google credential' });
    }

    const googleUser = await googleResponse.json();
    if (
      googleUser.aud !== process.env.GOOGLE_CLIENT_ID ||
      googleUser.email_verified !== 'true' ||
      !googleUser.sub ||
      !googleUser.email
    ) {
      return res.status(401).json({ message: 'Invalid Google credential' });
    }

    let user = await User.findOne({
      $or: [{ googleId: googleUser.sub }, { email: googleUser.email.toLowerCase() }]
    });

    if (user) {
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account has been deactivated' });
      }

      if (!user.googleId) {
        user.googleId = googleUser.sub;
        if (!user.avatar && googleUser.picture) user.avatar = googleUser.picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name: googleUser.name || googleUser.email.split('@')[0],
        email: googleUser.email.toLowerCase(),
        googleId: googleUser.sub,
        avatar: googleUser.picture || '',
        password: crypto.randomBytes(32).toString('hex')
      });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);
    return res.status(200).json({
      success: true,
      message: 'Google login successful',
      token,
      user: userResponse(user)
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ message: 'Server error during Google login' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none' 
  });
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist')
      .populate('cart.product');
    
    res.json({
      ...userResponse(user),
      wishlist: user.wishlist,
      cart: user.cart
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
