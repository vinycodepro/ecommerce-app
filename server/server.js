// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import dns from 'node:dns';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

connectDB();

const app = express();

// Security middleware
const allowedOrigins = [
  "https://ecommerce-app-vert-six.vercel.app/",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin"}
}));

app.use(cookieParser());
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payments.js';
import reviewRoutes from './routes/reviews.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});