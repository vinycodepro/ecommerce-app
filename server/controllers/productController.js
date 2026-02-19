import Product from '../models/Product.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // fetch all products
    res.json({
      products,          // this is what your frontend expects
      totalProducts: products.length,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
