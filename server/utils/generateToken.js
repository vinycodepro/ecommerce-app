import jwt from 'jsonwebtoken';

const generateToken = (res, user_id) => {
    const token= jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
res.cookie('jwt', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite:
    process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000,
});

};

export default generateToken;