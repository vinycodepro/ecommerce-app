import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import ProductGrid from "../../../components/Products/ProductGrid";
import Loading from "../../Shared/Loading";

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts({ featured: true, limit: 8 });
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-blue-600 font-semibold hover:text-blue-700">
            View All Products →
          </Link>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
