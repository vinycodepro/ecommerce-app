// scripts/seed.js
import mongoose from 'mongoose';
//import bcrypt from 'bcrypt.js';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import dns from 'node:dns';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: __dirname + '/../.env' });

const categories = {
  clothing: ['T-Shirts', 'Jeans', 'Jackets', 'Activewear'],
  gadgets: ['Smartphones', 'Laptops', 'Headphones', 'Smartwatches'],
  'civil-engineering-tools': ['Measuring', 'Safety', 'Testing', 'Construction']
};

const sampleProducts = [
  {
    name: "Professional Steel Measuring Tape",
    description: "25ft retractable steel measuring tape with magnetic tip and durable casing.",
    price: 24.99,
    comparePrice: 29.99,
    category: "civil-engineering-tools",
    subcategory: "Measuring",
    brand: "ProMeasure",
    inventory: {
      stock: 150,
      sku: "PM-TAPE-25",
      trackQuantity: true
    },
    attributes: {
      color: ["Yellow", "Black"],
      material: "Steel & ABS Plastic",
      weight: 0.45
    },
    specifications: {
      "Length": "25 feet",
      "Accuracy": "±1/16 inch",
      "Blade Width": "1 inch",
      "Magnetic Tip": "Yes"
    },
    tags: ["measuring", "construction", "tools", "professional"],
    featured: true
  },
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 199.99,
    comparePrice: 249.99,
    category: "gadgets",
    subcategory: "Headphones",
    brand: "AudioPro",
    inventory: {
      stock: 75,
      sku: "AP-HP-NC1",
      trackQuantity: true
    },
    attributes: {
      color: ["Black", "Silver", "Space Gray"],
      material: "Aluminum & Memory Foam"
    },
    tags: ["headphones", "wireless", "bluetooth", "noise-cancelling"],
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Create regular user
    const regularUser = new User({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    await regularUser.save();

    // Create products
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();