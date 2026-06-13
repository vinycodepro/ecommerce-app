import { useEffect, useState } from "react";
import "@styles/components.css";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        totalItems: 0
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(
                "https://ecommerce-app-1-pxaw.onrender.com/api/products",
                { credentials: "include" }
            );
            const data = await response.json();

            setProducts(data.products);
            setPagination({
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                totalItems: data.totalItems
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-products">
            <div className="admin-header">
            <h1>Product Management</h1>

            <button className="add-product-btn"
            >+ Add Product</button>
            </div>

         <div className="stats-container">
              <div className="stat-card">
            <h3>Total Products</h3>
            <span>{products.length}</span>
            </div>
          </div>
     <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {Array.isArray(products) &&
                    products.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <img
                                    className="product-image"
                                    src={product.images?.[0]?.url || "/placeholder.png"}
                                    width="60"
                                    alt={product.name}
                                />
                            </td>

                            <td>{product.name}</td>

                            <td>${product.price}</td>

                            <td>{product.inventory?.stock}</td>

                            <td>{product.category}</td>

                            <td>
                                <button className="edit-btn">Edit</button>

                                <button
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default AdminProducts;