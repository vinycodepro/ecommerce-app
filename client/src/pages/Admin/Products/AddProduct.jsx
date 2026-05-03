import { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: ""
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const submitProduct = async () => {
    await axios.post("https://ecommerce-app-1-pxaw.onrender.com/api/products",
    product,
    {
      withCredentials: true,
    }
  );
    alert("Product added!");
  };

  return (
<div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">
  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
    Add New Product
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      name="name"
      placeholder="Product Name"
      onChange={handleChange}
      className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      name="price"
      placeholder="Price"
      type="number"
      onChange={handleChange}
      className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      name="image"
      placeholder="Image URL"
      onChange={handleChange}
      className="border border-gray-300 rounded-lg p-3 col-span-1 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      name="category"
      placeholder="Category"
      onChange={handleChange}
      className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      name="stock"
      placeholder="Stock"
      type="number"
      onChange={handleChange}
      className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <textarea
    name="description"
    placeholder="Product Description"
    onChange={handleChange}
    rows="4"
    className="mt-4 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  ></textarea>

  <button
    onClick={submitProduct}
    className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
  >
    Add Product
  </button>
</div>
  );
}

export default AddProduct;
