// client/src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { 
  ShoppingBagIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import Loading from '../Shared/Loading';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentOrders()
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.orders || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const statCards = [
    {
      name: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      href: '/admin/analytics'
    },
    {
      name: 'Total Orders',
      value: stats?.totalOrders?.toLocaleString() || '0',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      href: '/admin/orders'
    },
    {
      name: 'Total Products',
      value: stats?.totalProducts?.toLocaleString() || '0',
      icon: ShoppingBagIcon,
      color: 'bg-purple-500',
      href: '/admin/products'
    },
    {
      name: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      icon: UsersIcon,
      color: 'bg-orange-500',
      href: '/admin/users'
    },
  ];

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
              <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome back, Admin
              </span>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((card) => (
              <Link
                key={card.name}
                to={card.href}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${card.color} rounded-md p-3`}>
                        <card.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {card.name}
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {card.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Orders
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Latest orders from your store
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {recentOrders.length > 0 ? (
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {recentOrders.slice(0, 5).map((order) => (
                        <li key={order._id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Order #{order.orderNumber}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                ${order.totalAmount} • {order.items.length} items
                              </p>
                            </div>
                            <div>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === 'delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first product.
                    </p>
                  </div>
                )}
                <div className="mt-6">
                  <Link
                    to="/admin/orders"
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View all orders
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quick Actions
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your store quickly
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Link
                    to="/admin/products/add"
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <ShoppingBagIcon className="h-8 w-8 text-gray-400 group-hover:text-gray-500" />
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        Add Product
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/admin/coupons"
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <TicketIcon className="h-8 w-8 text-gray-400 group-hover:text-gray-500" />
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        Create Coupon
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/admin/analytics"
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <ChartBarIcon className="h-8 w-8 text-gray-400 group-hover:text-gray-500" />
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        View Analytics
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/admin/users"
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <UsersIcon className="h-8 w-8 text-gray-400 group-hover:text-gray-500" />
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        Manage Users
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;