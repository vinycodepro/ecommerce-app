import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu as Bars3Icon, Package as PackageIcon } from "lucide-react";

import api from "../../../services/api";
import AdminSidebar from "../../../components/Admin/AdminSidebar";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalItems: 0,
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
        totalItems: data.totalItems,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            
            <div className="flex items-center">
              {/* Mobile sidebar button */}
              <button
                type="button"
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-3"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              <div className="flex items-center">
                <PackageIcon className="h-6 w-6 text-gray-400 mr-2" />

                <h1 className="text-xl font-semibold text-gray-900">
                  Product Management
                </h1>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/addProduct")}
              className="
                w-full sm:w-auto
                px-4 py-2
                bg-blue-600
                text-white
                rounded-md
                hover:bg-blue-700
                transition
              "
            >
              + Add Product
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Products
              </h3>

              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {products.length}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Items
              </h3>

              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {pagination.totalItems}
              </p>
            </div>

          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">

            <div className="overflow-x-auto">

              <table className="min-w-187.5 w-full">

                <thead className="bg-gray-50 border-b">

                  <tr className="text-left text-sm text-gray-600">

                    <th className="px-6 py-4 font-medium">
                      Image
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Name
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Price
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Stock
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Category
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200">

                  {Array.isArray(products) &&
                    products.map((product) => (

                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-4">

                          <img
                            className="w-14 h-14 rounded-lg object-cover border"
                            src={
                              product.images?.[0]?.url ||
                              "/placeholder.png"
                            }
                            alt={product.name}
                          />

                        </td>

                        <td className="px-6 py-4 font-medium text-gray-900">
                          {product.name}
                        </td>

                        <td className="px-6 py-4 text-gray-700">
                          ${product.price}
                        </td>

                        <td className="px-6 py-4 text-gray-700">
                          {product.inventory?.stock ?? 0}
                        </td>

                        <td className="px-6 py-4 text-gray-700">
                          {product.category}
                        </td>

                        <td className="px-6 py-4">

                          <div className="flex gap-2">

                            <button
                              className="
                                px-3 py-1.5
                                text-sm
                                rounded-md
                                bg-blue-100
                                text-blue-700
                                hover:bg-blue-200
                              "
                            >
                              Edit
                            </button>

                            <button
                              className="
                                px-3 py-1.5
                                text-sm
                                rounded-md
                                bg-red-100
                                text-red-700
                                hover:bg-red-200
                              "
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default AdminProducts;