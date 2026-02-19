import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import ProductCard from "../../components/Products/ProductCard"; 



function Products() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const { updateCartItem } = useContext(CartContext);
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        console.log(res.data);
        setProducts(res.data.products);
      })
      .catch(err => console.error(err));
  }, []);

  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))} 
    </div>

  );
};

export default Products;

