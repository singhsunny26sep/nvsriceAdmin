import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Dashboard from '../components/dashboard/Dashboard';
import SuperAdminDashboard from '../components/dashboard/SuperAdminDashboard';
import ZoneAdminDashboard from '../components/dashboard/ZoneAdminDashboard';
import SupportAdminDashboard from '../components/dashboard/SupportAdminDashboard';

const DashboardPage = () => {
  const { user, isSuper, isZoneAdmin, isSupportAdmin } = useAuth();

  const renderDashboard = () => {
    if (isSuper) {
      return <SuperAdminDashboard />;
    }
    
    if (isZoneAdmin) {
      return <ZoneAdminDashboard />;
    }
    
    if (isSupportAdmin) {
      return <SupportAdminDashboard />;
    }

    // Default dashboard for any other role
    return <Dashboard />;
  };

  return (
    <div className="animate-fade-in">
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;