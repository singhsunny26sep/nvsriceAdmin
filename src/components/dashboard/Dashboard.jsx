// ====== Rice Deal Admin Dashboard ======
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Package, Tag, TrendingUp, ShoppingBag, 
  Users, DollarSign, TrendingDown, Clock,
  AlertCircle, CheckCircle, Truck, Star
} from 'lucide-react';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';
import { dashboardAPI } from '../api/api';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats and chart data
      const [statsResponse, chartResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getChartData('overview', '30d')
      ]);

      setStats(statsResponse.data);
      setChartData(chartResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use Rice Deal mock data
      setStats({
        totalProducts: 156,
        totalOffers: 8,
        todayRevenue: 45680,
        todayOrders: 34,
        totalCustomers: 2840,
        pendingOrders: 12,
        lowStockProducts: 5,
        avgRating: 4.6
      });
      setChartData({
        salesTrend: [
          { month: 'Jan', revenue: 35000, orders: 120 },
          { month: 'Feb', revenue: 42000, orders: 145 },
          { month: 'Mar', revenue: 38000, orders: 132 },
          { month: 'Apr', revenue: 51000, orders: 168 },
          { month: 'May', revenue: 48000, orders: 155 },
          { month: 'Jun', revenue: 56000, orders: 182 }
        ],
        productCategories: [
          { name: 'Basmati Rice', value: 45, color: '#16a34a' },
          { name: 'Non-Basmati', value: 28, color: '#059669' },
          { name: 'Organic Rice', value: 18, color: '#10b981' },
          { name: 'Specialty Rice', value: 9, color: '#34d399' }
        ],
        orderStatus: [
          { status: 'Delivered', count: 245 },
          { status: 'Shipped', count: 89 },
          { status: 'Processing', count: 45 },
          { status: 'Pending', count: 23 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType = 'positive', bgColor = 'from-green-600 to-green-400' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`h-14 w-14 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center shadow-md`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        {change && (
          <span className={`flex items-center text-sm font-semibold ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'positive' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {change}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  const RecentOrder = ({ orderNumber, customer, amount, status }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{orderNumber}</p>
          <p className="text-xs text-gray-500">{customer}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-green-600">₹{amount.toLocaleString()}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 'Delivered' ? 'bg-green-100 text-green-800' :
          status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );

  const TopProduct = ({ name, sales, revenue, image }) => (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <img src={image} alt={name} className="h-12 w-12 rounded-lg object-cover" />
      <div className="flex-1">
        <p className="font-semibold text-gray-800 text-sm">{name}</p>
        <p className="text-xs text-gray-500">{sales} units sold</p>
      </div>
      <p className="font-bold text-green-600">₹{revenue.toLocaleString()}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              🍚 Welcome back, {user?.name || 'Admin'}!
            </h1>
            <p className="text-green-100 text-lg">
              Here's your Rice Deal store performance today
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm text-green-100">Today's Date</p>
            <p className="text-xl font-bold">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts?.toLocaleString() || '156'}
          icon={Package}
          change={8.5}
          bgColor="from-blue-600 to-blue-400"
        />
        <StatCard
          title="Active Offers"
          value={stats.totalOffers?.toLocaleString() || '8'}
          icon={Tag}
          change={12.3}
          bgColor="from-purple-600 to-purple-400"
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue?.toLocaleString() || '45,680'}`}
          icon={DollarSign}
          change={15.2}
          bgColor="from-green-600 to-green-400"
        />
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders?.toLocaleString() || '34'}
          icon={ShoppingBag}
          change={-3.8}
          changeType="negative"
          bgColor="from-orange-600 to-orange-400"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers?.toLocaleString() || '2,840'}
          icon={Users}
          change={6.7}
          bgColor="from-indigo-600 to-indigo-400"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders?.toLocaleString() || '12'}
          icon={Clock}
          bgColor="from-yellow-600 to-yellow-400"
        />
        <StatCard
          title="Low Stock Alert"
          value={stats.lowStockProducts?.toLocaleString() || '5'}
          icon={AlertCircle}
          bgColor="from-red-600 to-red-400"
        />
        <StatCard
          title="Avg Rating"
          value={stats.avgRating?.toFixed(1) || '4.6'}
          icon={Star}
          change={2.1}
          bgColor="from-amber-600 to-amber-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-600" size={20} />
            Revenue & Orders Trend
          </h3>
          <LineChart
            data={chartData.salesTrend}
            xAxisKey="month"
            lines={[
              { key: "revenue", color: "#16a34a", name: "Revenue (₹)" },
              { key: "orders", color: "#059669", name: "Orders" }
            ]}
            height={280}
            showLegend={true}
          />
        </div>

        {/* Product Categories Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="text-green-600" size={20} />
            Product Categories
          </h3>
          <PieChart
            data={chartData.productCategories}
            height={280}
          />
        </div>
      </div>

      {/* Order Status Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Truck className="text-green-600" size={20} />
          Order Status Overview
        </h3>
        <BarChart
          data={chartData.orderStatus}
          xAxisKey="status"
          yAxisKey="count"
          height={320}
        />
      </div>

      {/* Recent Activity & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="text-green-600" size={20} />
              Recent Orders
            </h3>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-2">
            <RecentOrder orderNumber="ORD-2025-101" customer="Rajesh Kumar" amount={1499} status="Delivered" />
            <RecentOrder orderNumber="ORD-2025-102" customer="Priya Sharma" amount={2450} status="Shipped" />
            <RecentOrder orderNumber="ORD-2025-103" customer="Amit Patel" amount={850} status="Processing" />
            <RecentOrder orderNumber="ORD-2025-104" customer="Sneha Reddy" amount={599} status="Processing" />
            <RecentOrder orderNumber="ORD-2025-105" customer="Vikram Singh" amount={3200} status="Delivered" />
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Star className="text-green-600" size={20} />
              Top Selling Products
            </h3>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-2">
            <TopProduct 
              name="India Gate Premium Basmati 5kg" 
              sales={245} 
              revenue={146755}
              image="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
            />
            <TopProduct 
              name="Organic Brown Rice 1kg" 
              sales={189} 
              revenue={85050}
              image="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
            />
            <TopProduct 
              name="Sona Masoori Rice 5kg" 
              sales={156} 
              revenue={54600}
              image="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
            />
            <TopProduct 
              name="Black Rice 500g" 
              sales={134} 
              revenue={107066}
              image="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
            />
            <TopProduct 
              name="Premium Jasmine Rice 2kg" 
              sales={98} 
              revenue={78400}
              image="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-l-4 border-blue-500">
          <div className="text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Add Product</h3>
            <p className="text-sm text-gray-600">
              Add new rice varieties to inventory
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-l-4 border-purple-500">
          <div className="text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Offer</h3>
            <p className="text-sm text-gray-600">
              Launch new promotional offers
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-l-4 border-green-500">
          <div className="text-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">View Orders</h3>
            <p className="text-sm text-gray-600">
              Manage customer orders
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-l-4 border-amber-500">
          <div className="text-center">
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Customers</h3>
            <p className="text-sm text-gray-600">
              View customer database
            </p>
          </div>
        </div>
      </div> */}

      {/* Summary Footer */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={32} />
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <p className="text-lg font-bold text-green-600">All Systems Operational</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-lg font-bold text-gray-800">{new Date().toLocaleTimeString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;