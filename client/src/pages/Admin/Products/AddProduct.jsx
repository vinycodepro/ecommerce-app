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
    await axios.post("http://localhost:5000/api/products", product);
    alert("Product added!");
  };

  return (
    <div>
      <input name="name" placeholder="Name" onChange={handleChange}/>
      <input name="price" placeholder="Price" onChange={handleChange}/>
      <input name="image" placeholder="Image URL" onChange={handleChange}/>
      <input name="category" placeholder="Category" onChange={handleChange}/>
      <input name="stock" placeholder="Stock" onChange={handleChange}/>
      <textarea name="description" onChange={handleChange}></textarea>
      <button onClick={submitProduct}>Add Product</button>
    </div>
  );
}

export default AddProduct;
