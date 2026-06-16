import { useEffect, useState } from "react";
import "@styles/components.css";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import AdminSidebar from "../../../components/Admin/AdminSidebar";
function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
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
            const response = await api.get("/products");
            const data = response.data;

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
            {/* Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="admin-header">
            <h1>Product Management</h1>

            <button onClick={() => navigate("/admin/addProduct")} className="add-product-btn"
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