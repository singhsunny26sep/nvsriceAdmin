import { useState, useEffect } from 'react';
import { Send, MessageSquare, Users, Search, ChevronDown, CheckCircle, XCircle, Loader2, Image, Video, X, Paperclip } from 'lucide-react';
import { usersAPI } from '../../components/api/api';
import { api } from '../../components/api/api';

const WhatsAppBulk = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [mediaType, setMediaType] = useState('none');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [sendResult, setSendResult] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers({ page: 1, limit: 1000 });
      let usersData = [];
      if (response.data.success) {
        if (response.data.data && response.data.data.data) {
          usersData = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          usersData = response.data.data;
        }
      }
      const mappedUsers = usersData
        .filter(user => user.mobile || user.phone)
        .map(user => ({
          id: user._id || user.id,
          name: user.name || 'N/A',
          phone: user.mobile || user.phone,
          email: user.email || 'N/A',
        }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
    setSelectAll(!selectAll);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }
    setMediaFile(file);
    setMediaType(isImage ? 'image' : 'video');
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (ev) => setMediaPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType('none');
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !mediaFile) {
      alert('Please enter a message or select a media file');
      return;
    }
    if (selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }

    try {
      setSending(true);
      setSendResult(null);

      const formData = new FormData();
      formData.append('userIds', JSON.stringify(selectedUsers));
      formData.append('message', message.trim());
      if (mediaFile) {
        formData.append('media', mediaFile);
        formData.append('mediaType', mediaType);
      }

      const response = await api.post('/whatsapp/send-bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSendResult({
        success: true,
        data: response.data,
        message: `Message sent successfully to ${selectedUsers.length} users!`,
      });
      setMessage('');
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType('none');
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      setSendResult({
        success: false,
        message: error.response?.data?.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUsersData = users.filter(u => selectedUsers.includes(u.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-green-600 to-green-400 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Bulk Message</h1>
            <p className="text-gray-600">Send WhatsApp messages to all users</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{selectedUsers.length} selected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="text-green-600" size={20} />
            Compose Message
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="6"
                placeholder="Enter your WhatsApp message here... You can use {{name}} to personalize the message."
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use {'{{name}}'} to insert user's name
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
                      mediaType === 'image'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Image size={16} />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
                      mediaType === 'video'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Video size={16} />
                    Video
                  </button>
                  {mediaFile && (
                    <button
                      type="button"
                      onClick={clearMedia}
                      className="flex items-center gap-2 px-3 py-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  )}
                </div>

                {mediaType !== 'none' && (
                  <div className="mt-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
                      <Paperclip size={18} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {mediaFile ? mediaFile.name : `Select ${mediaType} file`}
                      </span>
                      <input
                        type="file"
                        accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                        onChange={handleMediaChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {mediaPreview && (
                  <div className="mt-3">
                    {mediaType === 'image' ? (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="max-h-40 rounded-md border border-gray-200"
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        controls
                        className="max-h-40 rounded-md border border-gray-200"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={sending || !message.trim() || selectedUsers.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send to {selectedUsers.length} Users
                </>
              )}
            </button>

            {sendResult && (
              <div className={`p-4 rounded-md flex items-start gap-3 ${
                sendResult.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {sendResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm font-medium ${
                    sendResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {sendResult.success ? 'Success!' : 'Error'}
                  </p>
                  <p className={`text-sm ${
                    sendResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {sendResult.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="text-green-600" size={20} />
              Select Recipients
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
              />
              <span className="text-sm text-gray-700">Select All</span>
            </label>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <label
                    key={user.id}
                    className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                      selectedUsers.includes(user.id) ? 'bg-green-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 rounded mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.phone} • {user.email}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users with phone numbers
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBulk;
