// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    console.log("Cookies:", req.cookies);
    if (!token) {
      
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idToFind = decoded.userId || decoded.id || decoded._id;
    const user = await User.findById(idToFind).select('-password');
    
    if (!user) {
     
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Error name:', error.name);
    console.error('JWT Error message:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;