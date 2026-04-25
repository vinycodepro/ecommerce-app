import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';

const getProductFromResponse = (payload) => {
  if (!payload) return null;
  if (payload.product) return payload.product;
  if (payload.data?.product) return payload.data.product;
  return payload;
};

function ProductDetail() {
  const { id } = useParams();
  const { addItemToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await productService.getProduct(id);
        const nextProduct = getProductFromResponse(response);

        if (!nextProduct) {
          throw new Error('Product not found');
        }

        if (isMounted) {
          setProduct(nextProduct);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load product.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product?._id) return;

    try {
      await addItemToCart(product._id, 1, {}, product);
      toast.success(`Added ${product.name} to cart`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="animate-pulse rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-96 rounded-2xl bg-gray-200" />
            <div className="space-y-4">
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="h-10 w-3/4 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded bg-gray-200" />
              <div className="h-28 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-lg font-semibold text-red-700">Unable to load this product.</p>
          <p className="mt-2 text-sm text-red-600">{error || 'The product could not be found.'}</p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Back to products
          </Link>
        </div>
      </section>
    );
  }

  const imageUrl = product.images?.[0]?.url || '/api/placeholder/700/700';
  const stock = product.inventory?.stock ?? product.stock ?? 0;
  const rating = product.rating?.average ?? 0;
  const reviewCount = product.rating?.count ?? 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/products" className="text-sm font-medium text-blue-600 hover:text-blue-700">
        &larr; Back to products
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="grid gap-8 p-6 lg:grid-cols-2 lg:p-10">
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full max-h-[540px] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              {product.category && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {product.category}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {stock > 0 ? `${stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">{product.name}</h1>

            {product.brand && <p className="mt-2 text-base text-gray-500">Brand: {product.brand}</p>}

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <p className="text-3xl font-bold text-slate-900">${product.price}</p>
              {product.comparePrice && product.comparePrice > product.price && (
                <p className="text-lg text-gray-400 line-through">${product.comparePrice}</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="font-semibold text-amber-500">{rating.toFixed(1)} / 5</span>
              <span>{reviewCount} reviews</span>
            </div>

            <p className="mt-6 text-base leading-7 text-gray-600">
              {product.description || 'No description is available for this product yet.'}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {stock > 0 ? 'Add to cart' : 'Unavailable'}
              </button>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
              >
                View cart
              </Link>
            </div>

            <div className="mt-8 grid gap-4 border-t border-gray-100 pt-6 text-sm text-gray-600 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-semibold text-slate-900">SKU</p>
                <p className="mt-1">{product.sku || 'Not specified'}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="font-semibold text-slate-900">Shipping</p>
                <p className="mt-1">Standard delivery available at checkout.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
