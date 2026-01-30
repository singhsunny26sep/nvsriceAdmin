// ====== FILE 1: NotificationForm.jsx ======
import { useState } from 'react';
import { Save, X, Bell, Users, ChevronDown } from 'lucide-react';

const NotificationForm = ({ 
  notification = null, 
  onSave, 
  onCancel,
  title = "Send New Notification"
}) => {
  const [formData, setFormData] = useState({
    title: notification?.title || '',
    message: notification?.message || '',
    type: notification?.type || 'info',
    targetAudience: notification?.targetAudience || 'all',
    priority: notification?.priority || 'normal',
    link: notification?.link || '',
    sendImmediately: notification?.sendImmediately !== undefined ? notification.sendImmediately : true,
    scheduledDate: notification?.scheduledDate || '',
    scheduledTime: notification?.scheduledTime || ''
  });

  const isEditing = !!notification;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.message.trim()) return;
    
    const notificationData = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      type: formData.type,
      targetAudience: formData.targetAudience,
      priority: formData.priority,
      link: formData.link.trim(),
      sendImmediately: formData.sendImmediately,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      status: formData.sendImmediately ? 'sent' : 'scheduled',
      sentDate: formData.sendImmediately ? new Date().toISOString().split('T')[0] : null,
      sentTime: formData.sendImmediately ? new Date().toLocaleTimeString('en-IN', { hour12: false }) : null
    };

    if (isEditing) {
      onSave({ ...notification, ...notificationData });
    } else {
      onSave(notificationData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Bell className="text-green-600" size={24} />
        {isEditing ? 'Edit Notification' : title}
      </h2>
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., New Rice Varieties Available!"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="4"
            placeholder="Enter notification message..."
            required
          />
        </div>

        {/* Type and Priority */}
        {/* <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Type
            </label>
            <div className="relative">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
                <option value="promotion">Promotion</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="relative">
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div> */}

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Users size={16} />
            Target Audience
          </label>
          <div className="relative">
            <select
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10"
            >
              <option value="all">All Users</option>
              <option value="customers">Customers Only</option>
              <option value="new-users">New Users</option>
              <option value="active-users">Active Users</option>
              <option value="inactive-users">Inactive Users</option>
              <option value="premium-users">Premium Users</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Link URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Action Link (Optional)
          </label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="https://example.com/products"
          />
          <p className="text-xs text-gray-500 mt-1">Users can click to navigate to this link</p>
        </div>

        {/* Send Timing */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="sendImmediately"
              checked={formData.sendImmediately}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Send Immediately</span>
          </label>
        </div>

        {/* Schedule Date and Time */}
        {!formData.sendImmediately && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Date
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Time
              </label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.message.trim()}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {isEditing ? 'Update' : formData.sendImmediately ? 'Send Now' : 'Schedule'}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;


// ====== FILE 2: Notification.jsx ======
// Import your existing Table component

