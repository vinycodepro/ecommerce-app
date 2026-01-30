const generateToken = require('../utils/generateToken');

const authUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user && (await user.matchPassword(req.body.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      token: generateToken(user._id), 
    });
  }
};