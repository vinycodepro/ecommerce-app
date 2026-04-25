// client/src/pages/Admin/Orders/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import OrderList from '../../../components/Admin/OrderList';
import { Bars3Icon, PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../../services/adminService';
import Loading from '../../Shared/Loading';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.limit]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOrders({
        page: pagination.page,
        limit: pagination.limit
      });
      
      setOrders(response.orders);
      setPagination(prev => ({
        ...prev,
        total: response.totalOrders,
        totalPages: response.totalPages
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = (orderId, updatedOrder) => {
    setOrders(prev => 
      prev.map(order => 
        order._id === orderId ? updatedOrder : order
      )
    );
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="ml-2 lg:ml-0 flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-gray-400 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Order Management
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh
              </button>
              
              <Link
                to="/admin/analytics"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total Orders</div>
              <div className="text-2xl font-semibold text-gray-900">{pagination.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Pending</div>
              <div className="text-2xl font-semibold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Processing</div>
              <div className="text-2xl font-semibold text-blue-600">
                {orders.filter(o => o.status === 'processing').length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Completed</div>
              <div className="text-2xl font-semibold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
            </div>
          </div>

          {/* Orders List */}
          <OrderList
            orders={orders}
            loading={loading}
            onOrderUpdate={handleOrderUpdate}
            onRefresh={handleRefresh}
          />

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;