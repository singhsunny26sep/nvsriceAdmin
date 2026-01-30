import React, { useEffect, useState } from 'react';
import { Shield, Users, MapPin, Activity, Server, Database, Globe } from 'lucide-react';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';
import { dashboardAPI, adminAPI } from '../api/api';

const SuperAdminDashboard = () => {
  const [systemStats, setSystemStats] = useState({});
  const [adminData, setAdminData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true);
      const [systemResponse, adminResponse] = await Promise.all([
        dashboardAPI.getSystemHealth(),
        adminAPI.getAdmins()
      ]);

      setSystemStats(systemResponse.data);
      setAdminData(adminResponse.data);
    } catch (error) {
      console.error('Failed to fetch super admin data:', error);
      // Mock data
      setSystemStats({
        totalZones: 25,
        totalAdmins: 45,
        systemUptime: 99.98,
        serverLoad: 65,
        databaseSize: '2.4TB',
        activeConnections: 1247
      });
      setAdminData({
        zoneDistribution: [
          { name: 'North Zone', admins: 12, users: 5420 },
          { name: 'South Zone', admins: 15, users: 6830 },
          { name: 'East Zone', admins: 8, users: 3210 },
          { name: 'West Zone', admins: 10, users: 4560 }
        ],
        adminRoles: [
          { name: 'Zone Admin', value: 25 },
          { name: 'Support Admin', value: 15 },
          { name: 'System Admin', value: 5 }
        ],
        systemMetrics: [
          { time: '00:00', cpu: 45, memory: 62, network: 34 },
          { time: '04:00', cpu: 38, memory: 58, network: 28 },
          { time: '08:00', cpu: 72, memory: 75, network: 65 },
          { time: '12:00', cpu: 85, memory: 82, network: 78 },
          { time: '16:00', cpu: 68, memory: 70, network: 55 },
          { time: '20:00', cpu: 52, memory: 65, network: 42 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const SystemMetricCard = ({ title, value, icon: Icon, status = 'good', unit = '' }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'excellent': return 'bg-green-500';
        case 'good': return 'bg-green-400';
        case 'warning': return 'bg-yellow-500';
        case 'critical': return 'bg-red-500';
        default: return 'bg-gray-400';
      }
    };

    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}{unit}</p>
            <div className="flex items-center mt-2">
              <div className={`h-2 w-2 rounded-full ${getStatusColor()} mr-2`}></div>
              <span className="text-xs text-gray-500 capitalize">{status}</span>
            </div>
          </div>
          <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-400 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Loading super admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Super Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-400 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Super Admin Dashboard</h1>
            <p className="text-red-100">
              Complete system overview and administrative controls.
            </p>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SystemMetricCard
          title="Total Zones"
          value={systemStats.totalZones || 25}
          icon={MapPin}
          status="excellent"
        />
        <SystemMetricCard
          title="Total Admins"
          value={systemStats.totalAdmins || 45}
          icon={Users}
          status="good"
        />
        <SystemMetricCard
          title="System Uptime"
          value={systemStats.systemUptime || 99.98}
          icon={Server}
          status="excellent"
          unit="%"
        />
        <SystemMetricCard
          title="Active Connections"
          value={systemStats.activeConnections || 1247}
          icon={Globe}
          status="good"
        />
      </div>

      {/* System Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <LineChart
            data={adminData.systemMetrics}
            title="System Performance (24h)"
            xAxisKey="time"
            lines={[
              { key: "cpu", color: "#dc2626", name: "CPU Usage %" },
              { key: "memory", color: "#2563eb", name: "Memory Usage %" },
              { key: "network", color: "#16a34a", name: "Network Usage %" }
            ]}
            height={300}
            showLegend={true}
            dot={false}
          />
        </div>

        <div className="card">
          <PieChart
            data={adminData.adminRoles}
            title="Admin Role Distribution"
            height={300}
            colors={["#dc2626", "#ea580c", "#d97706"]}
          />
        </div>
      </div>

      {/* Zone Management Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone Management Overview</h3>
        <BarChart
          data={adminData.zoneDistribution}
          title=""
          xAxisKey="name"
          yAxisKey="admins"
          height={300}
          color="#dc2626"
        />
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Admins</h3>
            <p className="text-sm text-gray-600">
              Create, update, and manage administrator accounts.
            </p>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Zone Management</h3>
            <p className="text-sm text-gray-600">
              Configure zones and assign administrators.
            </p>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Server className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-sm text-gray-600">
              Configure global system settings and preferences.
            </p>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">System Reports</h3>
            <p className="text-sm text-gray-600">
              Generate comprehensive system reports and analytics.
            </p>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="card bg-yellow-50 border-l-4 border-yellow-400">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">System Alerts</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Server maintenance scheduled for this weekend</li>
                <li>Database backup completed successfully</li>
                <li>3 new zone admin requests pending approval</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;