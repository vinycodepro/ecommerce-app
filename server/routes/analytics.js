import express from 'express';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router =  express.Router();

//get dashboard stats
router.get ('/dashboard', auth , admin, async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalOrders = await Order.countDocuments({ status: 'completed' });
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const totalProducts = await Product.countDocuments({ active: true });
        res.json({
            totalSales: totalSales[0] ? totalSales[0].total : 0,
            totalOrders,
            totalCustomers,
            totalProducts
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

//get sales report