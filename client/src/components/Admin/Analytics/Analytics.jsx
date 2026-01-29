// client/src/pages/Admin/Analytics/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import AnalyticsCards, { CompactAnalyticsCards, MetricCard } from '../../../components/Admin/AnalyticsCards';
import { Bars3Icon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../../services/adminService';
import Loading from '../../Shared/Loading';

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const analyticsData = await adminService.getAnalytics({ range: timeRange });
        setStats(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
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
              <div className="ml-2 lg:ml-0 flex items-center">
                <ChartBarIcon className="h-6 w-6 text-gray-400 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Analytics Dashboard
                </h1>
              </div>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <Loading />
          ) : (
            <>
              {/* Overview Cards */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Overview
                </h2>
                <AnalyticsCards stats={stats} loading={loading} />
              </div>

              {/* Additional Metrics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Key Performance Indicators */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Performance Indicators
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                      title="Customer Lifetime Value"
                      value={`$${stats?.customerLifetimeValue?.toFixed(2) || '0'}`}
                      change={stats?.clvChange}
                      icon={CurrencyDollarIcon}
                      description="Average customer value"
                      loading={loading}
                    />
                    <MetricCard
                      title="Repeat Customer Rate"
                      value={`${stats?.repeatCustomerRate?.toFixed(1) || '0'}%`}
                      change={stats?.repeatRateChange}
                      icon={UsersIcon}
                      description="Returning customers"
                      loading={loading}
                    />
                    <MetricCard
                      title="Inventory Turnover"
                      value={stats?.inventoryTurnover?.toFixed(1) || '0'}
                      change={stats?.inventoryTurnoverChange}
                      icon={ShoppingBagIcon}
                      description="Inventory efficiency"
                      loading={loading}
                    />
                    <MetricCard
                      title="Cart Abandonment Rate"
                      value={`${stats?.cartAbandonmentRate?.toFixed(1) || '0'}%`}
                      change={stats?.abandonmentRateChange}
                      icon={ChartBarIcon}
                      description="Abandoned carts"
                      loading={loading}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Stats
                  </h3>
                  <CompactAnalyticsCards stats={stats} loading={loading} />
                  
                  {/* Additional quick metrics */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats?.pendingOrders || 0}
                      </p>
                      <p className="text-sm text-gray-500">Pending Orders</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats?.lowStockProducts || 0}
                      </p>
                      <p className="text-sm text-gray-500">Low Stock Items</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights & Recommendations */}
              {stats?.insights && stats.insights.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Insights & Recommendations
                  </h3>
                  <div className="space-y-3">
                    {stats.insights.map((insight, index) => (
                      <div
                        key={index}
                        className="flex items-start p-3 bg-blue-50 rounded-lg"
                      >
                        <ChartBarIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            {insight.title}
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            {insight.description}
                          </p>
                          {insight.action && (
                            <Link
                              to={insight.action.url}
                              className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {insight.action.text} →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;