// ====== FILE: OrderHistory.jsx ======
// Import your existing Table component

import Table from '../../components/models/Table';
import { useState } from 'react';
import { ShoppingBag, Eye, Package, TrendingUp,  DollarSign, User, Phone, MapPin, Check, X, Clock } from 'lucide-react';



// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'text-green-600 bg-green-50';
      case 'Shipped': return 'text-blue-600 bg-blue-50';
      case 'Processing': return 'text-yellow-600 bg-yellow-50';
      case 'Pending': return 'text-orange-600 bg-orange-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} />
            <div>
              <h2 className="text-xl font-bold">Order Details</h2>
              <p className="text-sm text-green-100">Order #{order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status and Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${getStatusColor(order.status)}`}>
              <p className="text-xs font-medium mb-1">Order Status</p>
              <p className="text-lg font-bold">{order.status}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Order Date</p>
              <p className="text-lg font-semibold text-gray-800">{order.orderDate}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total Amount</p>
              <p className="text-lg font-bold text-green-600">₹{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="text-green-600" size={20} />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-medium text-gray-800">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone size={14} /> Phone Number
                </p>
                <p className="font-medium text-gray-800">{order.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} /> Delivery Address
                </p>
                <p className="font-medium text-gray-800">{order.address}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-green-600" size={20} />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.weight}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">₹{(item.price / item.quantity).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="text-green-600" size={20} />
              Payment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-800">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Total Amount</span>
                <span className="font-bold text-green-600 text-lg">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderHistory = () => {
  const [orders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-2025-001',
      customerName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      address: '123, MG Road, Sector 15, Ghaziabad, UP - 201001',
      orderDate: '2025-10-01',
      totalAmount: 1499.00,
      status: 'Delivered',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      items: [
        { name: 'India Gate Premium Basmati Rice', weight: '5kg', quantity: 2, price: 1198.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
        { name: 'Organic Brown Rice', weight: '1kg', quantity: 1, price: 301.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
      ]
    },
    {
      id: 2,
      orderNumber: 'ORD-2025-002',
      customerName: 'Priya Sharma',
      phone: '+91 98765 43211',
      address: '456, Nehru Place, Delhi - 110019',
      orderDate: '2025-10-02',
      totalAmount: 2450.00,
      status: 'Shipped',
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      items: [
        { name: 'Premium Basmati Rice', weight: '10kg', quantity: 1, price: 1200.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
        { name: 'Black Rice', weight: '1kg', quantity: 2, price: 1250.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
      ]
    },
    {
      id: 3,
      orderNumber: 'ORD-2025-003',
      customerName: 'Amit Patel',
      phone: '+91 98765 43212',
      address: '789, Park Street, Kolkata - 700016',
      orderDate: '2025-10-03',
      totalAmount: 850.00,
      status: 'Processing',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      items: [
        { name: 'Sona Masoori Rice', weight: '5kg', quantity: 1, price: 850.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
      ]
    },
    {
      id: 4,
      orderNumber: 'ORD-2025-004',
      customerName: 'Sneha Reddy',
      phone: '+91 98765 43213',
      address: '321, Banjara Hills, Hyderabad - 500034',
      orderDate: '2025-10-04',
      totalAmount: 599.00,
      status: 'Pending',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      items: [
        { name: 'Organic Brown Basmati Rice', weight: '1kg', quantity: 1, price: 599.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
      ]
    },
    {
      id: 5,
      orderNumber: 'ORD-2025-005',
      customerName: 'Vikram Singh',
      phone: '+91 98765 43214',
      address: '654, Civil Lines, Jaipur - 302006',
      orderDate: '2025-09-28',
      totalAmount: 3200.00,
      status: 'Delivered',
      paymentMethod: 'Net Banking',
      paymentStatus: 'Paid',
      items: [
        { name: 'India Gate Premium Basmati Rice', weight: '5kg', quantity: 4, price: 2400.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
        { name: 'Jasmine Rice', weight: '2kg', quantity: 1, price: 800.00, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order ID',
      className: 'whitespace-nowrap font-medium text-green-600'
    },
    {
      key: 'customerName',
      header: 'Customer Name',
      className: 'whitespace-nowrap font-semibold'
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      className: 'whitespace-nowrap text-gray-600'
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      className: 'whitespace-nowrap font-bold text-green-700'
    },
    {
      key: 'paymentMethod',
      header: 'Payment',
      className: 'whitespace-nowrap text-gray-700'
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      className: 'whitespace-nowrap'
    },
    {
      key: 'status',
      header: 'Order Status',
      className: 'whitespace-nowrap'
    }
  ];

  const actions = [
    {
      icon: <Eye size={16} />,
      onClick: handleViewDetails,
      className: 'text-blue-600 hover:text-blue-900 hover:bg-blue-100',
      title: 'View Details'
    }
  ];

  function handleViewDetails(order) {
    setSelectedOrder(order);
  }

  function handleCloseModal() {
    setSelectedOrder(null);
  }

  // Filter orders
  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;
  const pendingOrders = orders.filter(order => order.status === 'Pending' || order.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <ShoppingBag className="text-green-600" size={36} />
            🍚 Rice Deal - Order History
          </h1>
          <p className="text-gray-600">
            Track and manage all customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
              </div>
              <ShoppingBag className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
              </div>
              <Check className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
              </div>
              <Clock className="text-orange-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
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
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Orders ({filteredOrders.length})
            </h2>
          </div>
          <Table
            columns={columns}
            data={filteredOrders}
            actions={actions}
            emptyMessage="No orders found."
          />
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default OrderHistory;