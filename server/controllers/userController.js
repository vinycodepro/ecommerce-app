import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const authUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user && (await user.matchPassword(req.body.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      token: generateToken(user._id), 
    });
  }
    else {
      res.status(401).json({ message: 'Invalid email or password' });
  }
};