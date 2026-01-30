import React, { useEffect, useState } from 'react';
import { Headphones, MessageSquare, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';
import { supportAPI, dashboardAPI } from '../api/api';

const SupportAdminDashboard = () => {
  const [supportStats, setSupportStats] = useState({});
  const [supportData, setSupportData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupportAdminData();
  }, []);

  const fetchSupportAdminData = async () => {
    try {
      setLoading(true);
      const [ticketsResponse, statsResponse] = await Promise.all([
        supportAPI.getTickets({ limit: 10, status: 'all' }),
        dashboardAPI.getStats()
      ]);

      setSupportStats(statsResponse.data);
      setSupportData(ticketsResponse.data);
    } catch (error) {
      console.error('Failed to fetch support admin data:', error);
      // Mock data
      setSupportStats({
        totalTickets: 1284,
        openTickets: 156,
        resolvedToday: 45,
        avgResponseTime: '2.4h'
      });
      setSupportData({
        ticketsByStatus: [
          { name: 'Open', value: 156 },
          { name: 'In Progress', value: 89 },
          { name: 'Resolved', value: 945 },
          { name: 'Closed', value: 94 }
        ],
        ticketsByPriority: [
          { name: 'High', value: 45 },
          { name: 'Medium', value: 89 },
          { name: 'Low', value: 156 }
        ],
        dailyTickets: [
          { day: 'Mon', created: 25, resolved: 32 },
          { day: 'Tue', created: 32, resolved: 28 },
          { day: 'Wed', created: 18, resolved: 35 },
          { day: 'Thu', created: 28, resolved: 25 },
          { day: 'Fri', created: 35, resolved: 40 },
          { day: 'Sat', created: 12, resolved: 18 },
          { day: 'Sun', created: 8, resolved: 15 }
        ],
        monthlyPerformance: [
          { month: 'Jan', tickets: 245, satisfaction: 4.2 },
          { month: 'Feb', tickets: 320, satisfaction: 4.4 },
          { month: 'Mar', tickets: 280, satisfaction: 4.3 },
          { month: 'Apr', tickets: 310, satisfaction: 4.5 },
          { month: 'May', tickets: 290, satisfaction: 4.6 },
          { month: 'Jun', tickets: 340, satisfaction: 4.4 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const SupportStatCard = ({ title, value, icon: Icon, change, changeType = 'positive', color = 'green' }) => {
    const getColorClasses = () => {
      const colors = {
        green: 'from-green-600 to-green-400',
        blue: 'from-blue-600 to-blue-400',
        yellow: 'from-yellow-600 to-yellow-400',
        red: 'from-red-600 to-red-400'
      };
      return colors[color] || colors.green;
    };

    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {changeType === 'positive' ? '+' : ''}{change} from yesterday
              </p>
            )}
          </div>
          <div className={`h-12 w-12 bg-gradient-to-br ${getColorClasses()} rounded-lg flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const TicketItem = ({ ticket, priority }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'high': return 'text-red-600 bg-red-100';
        case 'medium': return 'text-yellow-600 bg-yellow-100';
        case 'low': return 'text-green-600 bg-green-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    return (
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{ticket || 'User login issue'}</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(priority || 'medium')}`}>
          {priority || 'Medium'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Loading support dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Support Admin Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <Headphones className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Support Admin Dashboard</h1>
            <p className="text-green-100">
              Manage customer support and resolve user issues efficiently.
            </p>
          </div>
        </div>
      </div>

      {/* Support Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SupportStatCard
          title="Total Tickets"
          value={supportStats.totalTickets?.toLocaleString() || '1,284'}
          icon={MessageSquare}
          change="+12"
          color="blue"
        />
        <SupportStatCard
          title="Open Tickets"
          value={supportStats.openTickets?.toLocaleString() || '156'}
          icon={AlertTriangle}
          change="-8"
          changeType="positive"
          color="yellow"
        />
        <SupportStatCard
          title="Resolved Today"
          value={supportStats.resolvedToday?.toLocaleString() || '45'}
          icon={CheckCircle}
          change="+15"
          color="green"
        />
        <SupportStatCard
          title="Avg Response Time"
          value={supportStats.avgResponseTime || '2.4h'}
          icon={Clock}
          change="-0.3h"
          changeType="positive"
          color="green"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Status Distribution */}
        <div className="card">
          <PieChart
            data={supportData.ticketsByStatus}
            title="Tickets by Status"
            height={300}
            colors={["#f59e0b", "#3b82f6", "#10b981", "#6b7280"]}
          />
        </div>

        {/* Daily Ticket Activity */}
        <div className="card">
          <BarChart
            data={supportData.dailyTickets}
            title="Daily Ticket Activity"
            xAxisKey="day"
            yAxisKey="created"
            height={300}
            color="#16a34a"
          />
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="card">
        <LineChart
          data={supportData.monthlyPerformance}
          title="Monthly Support Performance"
          xAxisKey="month"
          lines={[
            { key: "tickets", color: "#16a34a", name: "Tickets Handled" },
            { key: "satisfaction", color: "#059669", name: "Satisfaction Score" }
          ]}
          height={350}
          showLegend={true}
        />
      </div>

      {/* Recent Tickets and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h3>
          <div className="space-y-2">
            <TicketItem ticket="Password reset request" priority="low" />
            <TicketItem ticket="Payment issue" priority="high" />
            <TicketItem ticket="Feature request" priority="medium" />
            <TicketItem ticket="Account verification" priority="medium" />
            <TicketItem ticket="Bug report" priority="high" />
          </div>
        </div>

        {/* Support Actions */}
        <div className="space-y-4">
          <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create New Ticket</h3>
                <p className="text-sm text-gray-600">Start a new support ticket for a user</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">User Support</h3>
                <p className="text-sm text-gray-600">Access user accounts and provide support</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Response Time</h3>
                <p className="text-sm text-gray-600">Monitor and improve response times</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportAdminDashboard;