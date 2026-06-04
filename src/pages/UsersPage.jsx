import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Eye, Edit, Trash2, Users as UsersIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usersAPI } from '../components/api/api';

const UsersPage = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const response = await usersAPI.getUsers(params);

      let usersData = [];
      let total = 0;
      let pages = 1;

      if (response.data.success) {
        if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
          usersData = response.data.data.data;
          total = response.data.data.total || 0;
          pages = response.data.data.totalPages || 1;
        } else if (Array.isArray(response.data.data)) {
          usersData = response.data.data;
          total = usersData.length;
          pages = 1;
        } else if (response.data.data && response.data.data._id) {
          usersData = [response.data.data];
          total = 1;
          pages = 1;
        } else if (response.data.users) {
          usersData = response.data.users;
          total = usersData.length;
          pages = 1;
        } else if (Array.isArray(response.data)) {
          usersData = response.data;
          total = usersData.length;
          pages = 1;
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }

      const mappedUsers = usersData.map(user => ({
        id: user._id || user.id,
        name: user.name || 'N/A',
        email: user.email || 'N/A',
        phone: user.mobile || user.phone || 'N/A',
        status: user.isActive ? 'active' : user.isDeleted ? 'deleted' : 'inactive',
        role: user.role || 'user',
        createdAt: user.createdAt,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
        isOnline: user.isOnline,
        loginType: user.loginType,
        lastActivity: user.lastActivity
      }));

      setUsers(mappedUsers);
      setTotalPages(pages);
      setTotalUsers(total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to load users. Please try again.');
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await usersAPI.updateUser(userId, {
        isActive: newStatus === 'active',
        isDeleted: newStatus === 'deleted'
      });
      alert('User status updated successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.deleteUser(userId);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      deleted: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.inactive;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800',
      premium: 'bg-yellow-100 text-yellow-800',
      moderator: 'bg-indigo-100 text-indigo-800'
    };
    return colors[role] || colors.user;
  };

  const UserTableRow = ({ user }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.phone}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
            {user.status}
          </span>
          {user.isOnline && (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Online
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'N/A'}
        </div>
        <div className="text-xs text-gray-500">
          {user.createdAt ? new Date(user.createdAt).toLocaleTimeString('en-GB') : ''}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          {user.isEmailVerified && (
            <span className="text-xs text-green-600">✓ Email</span>
          )}
          {user.isMobileVerified && (
            <span className="text-xs text-green-600">✓ Mobile</span>
          )}
          {!user.isEmailVerified && !user.isMobileVerified && (
            <span className="text-xs text-gray-400">Not verified</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {hasPermission('manage_users') && (
            <>
              <button
                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                title="Edit User"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                title="Delete User"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
            title="More Options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-green-600 to-green-400 rounded-lg flex items-center justify-center">
            <UsersIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers Management</h1>
            <p className="text-gray-600">Manage and monitor Customers accounts</p>
          </div>
        </div>
        {hasPermission('manage_users') && (
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="form-input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Showing {users.length} of {totalUsers} user{totalUsers !== 1 ? 's' : ''} total
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <UserTableRow key={user.id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} • Total: {totalUsers} users
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;