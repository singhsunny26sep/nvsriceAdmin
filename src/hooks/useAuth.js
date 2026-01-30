import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { logout, setUser } from '../redux/slices/authSlice';
import { authAPI } from '../components/api/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(state => state.auth);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user]);

  // Get user permissions based on role
  const getPermissions = useCallback(() => {
    const rolePermissions = {
      super_admin: [
        'manage_admins',
        'manage_zones',
        'view_system_health',
        'manage_settings',
        'view_all_reports',
        'manage_users'
      ],
      zone_admin: [
        'manage_zone_users',
        'view_zone_reports',
        'manage_zone_events'
      ],
      support_admin: [
        'manage_tickets',
        'view_user_details',
        'create_support_reports'
      ]
    };

    return rolePermissions[user?.role] || [];
  }, [user]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    const permissions = getPermissions();
    return permissions.includes(permission);
  }, [getPermissions]);

  // Logout function
  const logoutUser = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  // Refresh user profile
  const refreshProfile = useCallback(async () => {
    try {
      if (token) {
        const response = await authAPI.getProfile();
        dispatch(setUser(response.data.user));
        return response.data.user;
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      if (error.response?.status === 401) {
        logoutUser();
      }
      throw error;
    }
  }, [token, dispatch, logoutUser]);

  // Optional: Auto-refresh token before expiry (only if you have a refresh endpoint)
  useEffect(() => {
    if (!token || !isAuthenticated || !authAPI.refreshToken) return;

    const refreshInterval = setInterval(async () => {
      try {
        await authAPI.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        logoutUser();
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [token, isAuthenticated, logoutUser]);

  return {
    // User data
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Role checking
    hasRole,
    hasAnyRole,
    hasPermission,
    getPermissions,

    // Actions
    logout: logoutUser,
    refreshProfile,

    // Helper functions
    isSuper: hasRole('super_admin'),
    isZoneAdmin: hasRole('zone_admin'),
    isSupportAdmin: hasRole('support_admin'),
    
    // Role display name
    getRoleDisplayName: () => {
      const roleNames = {
        super_admin: 'Super Administrator',
        zone_admin: 'Zone Administrator',
        support_admin: 'Support Administrator'
      };
      return roleNames[user?.role] || 'Administrator';
    }
  };
};