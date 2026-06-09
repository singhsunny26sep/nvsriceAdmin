import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Home, 
  Users, 
  Settings, 
  Shield, 
  MapPin, 
  Headphones, 
  FileText,
  X,
  Activity,
  MessageSquare
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector(state => state.auth);

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Customers', href: '/users', icon: Users },
      { name: 'Categories', href: '/category', icon: Settings },
    ];

    const roleBasedItems = {
      super_admin: [
        { name: 'Customers', href: '/users', icon: Users },
        { name: 'Administrators', href: '/administrators', icon: Shield },
        { name: 'Zones', href: '/zones', icon: MapPin },
        { name: 'System Health', href: '/system', icon: Activity },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
      ],
      zone_admin: [
        { name: 'Customers', href: '/users', icon: Users },
        { name: 'Zone Management', href: '/zone-management', icon: MapPin },
        { name: 'Reports', href: '/reports', icon: FileText },
      ],
      support_admin: [
        { name: 'Sub Categories', href: '/subcategories', icon: Headphones },
        { name: 'Products', href: '/products', icon: FileText },
        { name: 'Banner', href: '/banner', icon: FileText },
        { name: 'offers', href: '/offers', icon: FileText },
        { name: 'Locations', href: '/locations', icon: MapPin },
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Notifications', href: '/notifications', icon: FileText },
        { name: 'WhatsApp Bulk', href: '/whatsapp-bulk', icon: MessageSquare },
        { name: 'Order History', href: '/orderhistory', icon: FileText },
      ]
    };

    const userRole = user?.role || 'support_admin';
    return [...baseItems, ...(roleBasedItems[userRole] || roleBasedItems.support_admin)];

  };

  const menuItems = getMenuItems();

  const isActiveRoute = (href) => {
    return location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href));
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-green-600 to-green-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              NVS Rice Admin
            </h1>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-green-600 font-medium">
                {user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Administrator'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }
                  `}
                  onClick={() => {
                    // Close mobile sidebar when clicking a link
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 transition-colors duration-200
                    ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-green-600'}
                  `} />
                  {item.name}
                  
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Version 1.0.0</span>
            <span>© 2024 FixsetAdmin</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;