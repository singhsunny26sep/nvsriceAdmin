
import { useState } from 'react';
import { Plus, Edit, Trash2, Bell, Send, Clock, CheckCircle, AlertCircle, TrendingUp, Users } from 'lucide-react';
import NotificationForm from './NotificationForm';

import Table from '../../components/models/Table';

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '🎉 New Basmati Rice Arrivals!',
      message: 'Premium aged basmati rice now available. Order now and get 10% off on bulk orders!',
      type: 'promotion',
      targetAudience: 'all',
      priority: 'high',
      status: 'sent',
      sentDate: '2025-10-04',
      sentTime: '10:30 AM',
      link: '/products/basmati',
      recipients: 1250
    },
    {
      id: 2,
      title: '⚠️ Order Delivery Update',
      message: 'Your order #ORD-2025-045 will be delivered by 6 PM today.',
      type: 'alert',
      targetAudience: 'customers',
      priority: 'urgent',
      status: 'sent',
      sentDate: '2025-10-04',
      sentTime: '09:15 AM',
      link: '/orders/ORD-2025-045',
      recipients: 1
    },
    {
      id: 3,
      title: '💚 Organic Rice Collection',
      message: 'Explore our new range of certified organic rice varieties. Healthy choice for your family!',
      type: 'info',
      targetAudience: 'active-users',
      priority: 'normal',
      status: 'sent',
      sentDate: '2025-10-03',
      sentTime: '02:00 PM',
      link: '/products/organic',
      recipients: 856
    },
    {
      id: 4,
      title: '📦 Special Festive Offers Coming Soon!',
      message: 'Diwali special - Flat 20% off on all rice products. Stay tuned!',
      type: 'promotion',
      targetAudience: 'all',
      priority: 'high',
      status: 'scheduled',
      scheduledDate: '2025-10-10',
      scheduledTime: '08:00 AM',
      link: '/offers/diwali',
      recipients: null
    },
    {
      id: 5,
      title: '✅ Payment Successful',
      message: 'Your payment of ₹1,499 has been received. Order is being processed.',
      type: 'success',
      targetAudience: 'customers',
      priority: 'normal',
      status: 'sent',
      sentDate: '2025-10-02',
      sentTime: '11:45 AM',
      link: '/orders',
      recipients: 1
    }
  ]);

  const [mode, setMode] = useState('view');
  const [editingNotification, setEditingNotification] = useState(null);
  const [nextId, setNextId] = useState(6);
  const [filterStatus, setFilterStatus] = useState('All');

  const columns = [
    {
      key: 'id',
      header: 'ID',
      className: 'whitespace-nowrap font-medium text-green-600'
    },
    {
      key: 'title',
      header: 'Title',
      className: 'font-semibold max-w-xs'
    },
    {
      key: 'message',
      header: 'Message',
      className: 'text-gray-600 max-w-md truncate'
    },
    {
      key: 'type',
      header: 'Type',
      className: 'whitespace-nowrap'
    },
    {
      key: 'targetAudience',
      header: 'Audience',
      className: 'whitespace-nowrap text-gray-700'
    },
    {
      key: 'priority',
      header: 'Priority',
      className: 'whitespace-nowrap'
    },
    {
      key: 'status',
      header: 'Status',
      className: 'whitespace-nowrap'
    },
    {
      key: 'sentDate',
      header: 'Date',
      className: 'whitespace-nowrap text-gray-600'
    }
  ];

  const actions = [
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: 'text-green-600 hover:text-green-900 hover:bg-green-100',
      title: 'Edit Notification'
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-900 hover:bg-red-100',
      title: 'Delete Notification'
    }
  ];

  function handleAdd(notificationData) {
    const newNotification = {
      id: nextId,
      ...notificationData,
      recipients: notificationData.status === 'sent' ? 1250 : null
    };
    setNotifications([...notifications, newNotification]);
    setNextId(nextId + 1);
    setMode('view');
  }

  function handleEdit(notification) {
    setEditingNotification(notification);
    setMode('edit');
  }

  function handleUpdate(updatedNotification) {
    setNotifications(notifications.map(notif =>
      notif.id === updatedNotification.id ? updatedNotification : notif
    ));
    setMode('view');
    setEditingNotification(null);
  }

  function handleDelete(notification) {
    if (window.confirm(`Are you sure you want to delete "${notification.title}"?`)) {
      setNotifications(notifications.filter(notif => notif.id !== notification.id));
    }
  }

  function handleCancel() {
    setMode('view');
    setEditingNotification(null);
  }

  // Filter notifications
  const filteredNotifications = filterStatus === 'All'
    ? notifications
    : notifications.filter(notif => notif.status === filterStatus.toLowerCase());

  // Calculate stats
  const totalNotifications = notifications.length;
  const sentCount = notifications.filter(n => n.status === 'sent').length;
  const scheduledCount = notifications.filter(n => n.status === 'scheduled').length;
  const totalRecipients = notifications
    .filter(n => n.recipients)
    .reduce((sum, n) => sum + n.recipients, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Bell className="text-green-600" size={36} />
            🍚 Rice Deal - Notification Management
          </h1>
          <p className="text-gray-600">
            Send and manage notifications to your customers
          </p>
        </div>

        {/* Add Form Modal */}
        {mode === 'add' && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <NotificationForm
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Send New Notification"
              />
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {mode === 'edit' && editingNotification && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <NotificationForm
                notification={editingNotification}
                onSave={handleUpdate}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-800">{totalNotifications}</p>
              </div>
              <Bell className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-green-600">{sentCount}</p>
              </div>
              <Send className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{scheduledCount}</p>
              </div>
              <Clock className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold text-purple-600">{totalRecipients.toLocaleString()}</p>
              </div>
              <Users className="text-purple-600" size={32} />
            </div>
          </div>
        </div> */}

        {/* Filter Tabs */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'Sent', 'Scheduled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div> */}

        {/* Send Button */}
        {mode === 'view' && (
          <div className="mb-6">
            <button
              onClick={() => setMode('add')}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={18} />
              Send New Notification
            </button>
          </div>
        )}

        {/* Notifications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Notifications ({filteredNotifications.length})
            </h2>
          </div>
          <Table
            columns={columns}
            data={filteredNotifications}
            actions={actions}
            emptyMessage="No notifications found. Send your first notification to get started!"
          />
        </div>

        {/* Stats Summary */}
        {notifications.length > 0 && (
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-green-800">
              <span className="font-medium">
                Total Notifications: {totalNotifications}
              </span>
              <span className="text-sm">
                Sent: {sentCount} | Scheduled: {scheduledCount} | Total Reach: {totalRecipients.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;