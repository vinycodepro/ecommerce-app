// client/src/components/Admin/AnalyticsCards.jsx
import React from 'react';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const AnalyticsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-300 rounded-md"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      name: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      previousValue: `$${stats?.previousPeriodRevenue?.toLocaleString() || '0'}`,
      change: stats?.revenueChange || 0,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      description: 'All time revenue',
    },
    {
      name: 'Total Orders',
      value: stats?.totalOrders?.toLocaleString() || '0',
      previousValue: stats?.previousPeriodOrders?.toLocaleString() || '0',
      change: stats?.ordersChange || 0,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      description: 'Total orders placed',
    },
    {
      name: 'Total Products',
      value: stats?.totalProducts?.toLocaleString() || '0',
      previousValue: stats?.previousPeriodProducts?.toLocaleString() || '0',
      change: stats?.productsChange || 0,
      icon: ShoppingBagIcon,
      color: 'bg-purple-500',
      description: 'Active products',
    },
    {
      name: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      previousValue: stats?.previousPeriodUsers?.toLocaleString() || '0',
      change: stats?.usersChange || 0,
      icon: UsersIcon,
      color: 'bg-orange-500',
      description: 'Registered users',
    },
    {
      name: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue?.toLocaleString() || '0'}`,
      previousValue: `$${stats?.previousMonthRevenue?.toLocaleString() || '0'}`,
      change: stats?.monthlyRevenueChange || 0,
      icon: ChartBarIcon,
      color: 'bg-indigo-500',
      description: 'Current month revenue',
    },
    {
      name: 'Avg. Order Value',
      value: `$${stats?.averageOrderValue?.toFixed(2) || '0'}`,
      previousValue: `$${stats?.previousAvgOrderValue?.toFixed(2) || '0'}`,
      change: stats?.avgOrderValueChange || 0,
      icon: CurrencyDollarIcon,
      color: 'bg-pink-500',
      description: 'Average order value',
    },
    {
      name: 'Conversion Rate',
      value: `${stats?.conversionRate?.toFixed(1) || '0'}%`,
      previousValue: `${stats?.previousConversionRate?.toFixed(1) || '0'}%`,
      change: stats?.conversionRateChange || 0,
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
      description: 'Order conversion rate',
    },
    {
      name: 'Refund Rate',
      value: `${stats?.refundRate?.toFixed(1) || '0'}%`,
      previousValue: `${stats?.previousRefundRate?.toFixed(1) || '0'}%`,
      change: stats?.refundRateChange || 0,
      icon: ArrowDownIcon,
      color: 'bg-red-500',
      description: 'Order refund rate',
    },
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <ArrowUpIcon className="h-4 w-4" />;
    if (change < 0) return <ArrowDownIcon className="h-4 w-4" />;
    return null;
  };

  const getChangeText = (change) => {
    if (change > 0) return `+${change}%`;
    if (change < 0) return `${change}%`;
    return '0%';
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={card.name}
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
                  <dd className="text-xs text-gray-500 mt-1">
                    {card.description}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Previous period</span>
                <span className="text-gray-900 font-medium">
                  {card.previousValue}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-500">Change</span>
                <span
                  className={`inline-flex items-center text-sm font-medium ${getChangeColor(
                    card.change
                  )}`}
                >
                  {getChangeIcon(card.change)}
                  {getChangeText(card.change)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Compact version for smaller spaces
export const CompactAnalyticsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  const compactCards = [
    {
      name: 'Revenue',
      value: `$${stats?.totalRevenue ? (stats.totalRevenue / 1000).toFixed(1) + 'K' : '0'}`,
      change: stats?.revenueChange || 0,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
    },
    {
      name: 'Orders',
      value: stats?.totalOrders?.toLocaleString() || '0',
      change: stats?.ordersChange || 0,
      icon: DocumentTextIcon,
      color: 'text-blue-600',
    },
    {
      name: 'Products',
      value: stats?.totalProducts?.toLocaleString() || '0',
      change: stats?.productsChange || 0,
      icon: ShoppingBagIcon,
      color: 'text-purple-600',
    },
    {
      name: 'Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      change: stats?.usersChange || 0,
      icon: UsersIcon,
      color: 'text-orange-600',
    },
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {compactCards.map((card) => (
        <div
          key={card.name}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.name}</p>
              <p className="text-xl font-semibold text-gray-900">{card.value}</p>
            </div>
            <div className="text-right">
              <card.icon className={`h-6 w-6 ${card.color}`} />
              <p
                className={`text-xs font-medium ${getChangeColor(card.change)}`}
              >
                {card.change > 0 ? '+' : ''}{card.change}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Single metric card for specific use cases
export const MetricCard = ({ title, value, change, icon: Icon, description, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-md"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600 bg-green-50';
    if (change < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <ArrowUpIcon className="h-4 w-4" />;
    if (change < 0) return <ArrowDownIcon className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="bg-blue-100 rounded-md p-3">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeColor(
              change
            )}`}
          >
            {getChangeIcon(change)}
            {change > 0 ? '+' : ''}{change}% from previous period
          </span>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCards;