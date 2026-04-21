import React from 'react';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, }) => {
  
  const { addItemToCart } = useCart();
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      
      {/* Product image */}
      <div className="relative">
        <img
          src={product.images[0].url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Badge for New / Sale */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-white font-bold text-xs px-2 py-1 rounded">
            NEW
          </span>
        )}
        {product.isOnSale && (
          <span className="absolute top-2 right-2 bg-red-500 text-white font-bold text-xs px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col">
        <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
        <p className="text-blue-500 font-semibold text-md">${product.price}</p>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>

        <button
        onClick={() => {
          addItemToCart(product._id, 1, {}, product);
          toast.success(`Added ${product.name} to cart!`)
        } 
        } 

        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
