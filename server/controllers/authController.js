import User from '../models/User.js';
import bcrypt from 'bcrypt.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const token =jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }

      );
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        
      });
    }
  } catch (error) {
    // This catch block prevents the 500 error from crashing your whole app
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};