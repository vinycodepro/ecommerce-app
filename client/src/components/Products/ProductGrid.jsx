// client/src/components/Products/ProductGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

const ProductGrid = ({ products, onAddToWishlist }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div key={product._id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
            <img
              src={product.images[0]?.url || '/api/placeholder/300/300'}
              alt={product.name}
              className="h-64 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
            />
            <button
              onClick={() => onAddToWishlist(product._id)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              {product.isInWishlist ? (
                <HeartIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartOutline className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900">
              <Link to={`/products/${product._id}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
            <div className="mt-2 flex items-center">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`h-4 w-4 ${
                      rating < product.rating.average
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-500">
                ({product.rating.count})
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">
                ${product.price}
                {product.comparePrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${product.comparePrice}
                  </span>
                )}
              </p>
              {product.inventory.stock > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;