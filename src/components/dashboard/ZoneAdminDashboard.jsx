import React, { useEffect, useState } from 'react';
import { MapPin, Users, TrendingUp, AlertCircle, Calendar, Target } from 'lucide-react';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';
import { dashboardAPI, adminAPI } from '../api/api';

const ZoneAdminDashboard = () => {
  const [zoneStats, setZoneStats] = useState({});
  const [zoneData, setZoneData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZoneAdminData();
  }, []);

  const fetchZoneAdminData = async () => {
    try {
      setLoading(true);
      const [statsResponse, zoneResponse] = await Promise.all([
        dashboardAPI.getStats(),
        adminAPI.getZones()
      ]);

      setZoneStats(statsResponse.data);
      setZoneData(zoneResponse.data);
    } catch (error) {
      console.error('Failed to fetch zone admin data:', error);
      // Mock data
      setZoneStats({
        zoneUsers: 8450,
        activeUsers: 7230,
        newUsers: 245,
        userGrowth: 8.5,
        zoneName: 'North Zone'
      });
      setZoneData({
        userActivity: [
          { day: 'Mon', users: 1200, active: 980 },
          { day: 'Tue', users: 1350, active: 1100 },
          { day: 'Wed', users: 1180, active: 950 },
          { day: 'Thu', users: 1420, active: 1180 },
          { day: 'Fri', users: 1380, active: 1150 },
          { day: 'Sat', users: 1100, active: 890 },
          { day: 'Sun', users: 980, active: 750 }
        ],
        userCategories: [
          { name: 'Premium', value: 3200 },
          { name: 'Standard', value: 4100 },
          { name: 'Basic', value: 1150 }
        ],
        monthlyGrowth: [
          { month: 'Jan', users: 7200, revenue: 45000 },
          { month: 'Feb', users: 7450, revenue: 47500 },
          { month: 'Mar', users: 7680, revenue: 49200 },
          { month: 'Apr', users: 7920, revenue: 51800 },
          { month: 'May', users: 8180, revenue: 53400 },
          { month: 'Jun', users: 8450, revenue: 55600 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const ZoneStatCard = ({ title, value, icon: Icon, change, changeType = 'positive' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? '+' : ''}{change}% this month
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Loading zone dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zone Admin Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <MapPin className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {zoneStats.zoneName || 'North Zone'} - Zone Dashboard
            </h1>
            <p className="text-blue-100">
              Manage and monitor your zone's performance and users.
            </p>
          </div>
        </div>
      </div>

      {/* Zone Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ZoneStatCard
          title="Zone Users"
          value={zoneStats.zoneUsers?.toLocaleString() || '8,450'}
          icon={Users}
          change={8.5}
        />
        <ZoneStatCard
          title="Active Users"
          value={zoneStats.activeUsers?.toLocaleString() || '7,230'}
          icon={Target}
          change={5.2}
        />
        <ZoneStatCard
          title="New Users"
          value={zoneStats.newUsers?.toLocaleString() || '245'}
          icon={TrendingUp}
          change={12.8}
        />
        <ZoneStatCard
          title="User Satisfaction"
          value="92%"
          icon={AlertCircle}
          change={3.1}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="card">
          <BarChart
            data={zoneData.userActivity}
            title="Weekly User Activity"
            xAxisKey="day"
            yAxisKey="users"
            height={300}
            color="#2563eb"
          />
        </div>

        {/* User Categories */}
        <div className="card">
          <PieChart
            data={zoneData.userCategories}
            title="User Categories"
            height={300}
            colors={["#2563eb", "#3b82f6", "#60a5fa"]}
          />
        </div>
      </div>

      {/* Monthly Growth Trend */}
      <div className="card">
        <LineChart
          data={zoneData.monthlyGrowth}
          title="Monthly Growth Trend"
          xAxisKey="month"
          lines={[
            { key: "users", color: "#2563eb", name: "Users" },
            { key: "revenue", color: "#1d4ed8", name: "Revenue ($)" }
          ]}
          height={350}
          showLegend={true}
        />
      </div>

      {/* Zone Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-sm text-gray-600">
              Manage users within your zone and handle user requests.
            </p>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Schedule Events</h3>
            <p className="text-sm text-gray-600">
              Plan and schedule zone events and maintenance activities.
            </p>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Zone Reports</h3>
            <p className="text-sm text-gray-600">
              Generate detailed reports for your zone's performance.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Zone Activities</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-700">245 new users registered this month</p>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-gray-700">Zone maintenance completed successfully</p>
            <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <p className="text-sm text-gray-700">Monthly report generated and sent</p>
            <span className="text-xs text-gray-500 ml-auto">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneAdminDashboard;