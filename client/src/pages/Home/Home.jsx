// client/src/pages/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductGrid from '../../components/Products/ProductGrid';
//import Loading from '../Shared/Loading';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);//i must change this

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await productService.getProducts({ featured: true, limit: 8 });
        setFeaturedProducts(data.products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Our Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover amazing products at great prices
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard
              title="Clothing"
              description="Trendy and comfortable clothing for everyone"
              image="/api/placeholder/400/300"
              link="/products?category=clothing"
              bgColor="bg-gradient-to-br from-pink-500 to-rose-500"
            />
            <CategoryCard
              title="Gadgets"
              description="Latest tech gadgets and accessories"
              image="/api/placeholder/400/300"
              link="/products?category=gadgets"
              bgColor="bg-gradient-to-br from-blue-500 to-cyan-500"
            />
            <CategoryCard
              title="Engineering Tools"
              description="Professional tools for civil engineering"
              image="/api/placeholder/400/300"
              link="/products?category=civil-engineering-tools"
              bgColor="bg-gradient-to-br from-green-500 to-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Products →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🚚"
              title="Free Shipping"
              description="Free shipping on orders over $50"
            />
            <FeatureCard
              icon="🔒"
              title="Secure Payment"
              description="Your payment information is safe with us"
            />
            <FeatureCard
              icon="↩️"
              title="Easy Returns"
              description="30-day return policy for all items"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const CategoryCard = ({ title, description, image, link, bgColor }) => (
  <Link
    to={link}
    className={`${bgColor} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2`}
  >
    <div className="p-8 text-white">
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="opacity-90 mb-4">{description}</p>
      <span className="font-semibold">Explore →</span>
    </div>
  </Link>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center p-6">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;