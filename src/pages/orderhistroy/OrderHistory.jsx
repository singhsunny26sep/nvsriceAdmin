// ====== FILE: OrderHistory.jsx ======
// Import your existing Table component

import Table from '../../components/models/Table';
import { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Package, TrendingUp, DollarSign, User, Phone, MapPin, Check, X, Clock, CheckCircle, Printer } from 'lucide-react';
import { ordersAPI } from '../../components/api/api';

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, onConfirm, onCancel, onComplete, onPending }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return 'text-green-600 bg-green-50';
      case 'CONFIRMED': return 'text-blue-600 bg-blue-50';
      case 'PENDING': return 'text-orange-600 bg-orange-50';
      case 'INITIATED': return 'text-yellow-600 bg-yellow-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Check if order can be acted upon (only for Pending and Confirmed orders)
  const canTakeAction = order.status === 'PENDING' || order.status === 'CONFIRMED';

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <p className="text-lg font-bold text-green-600">₹{(order.totalAmount || 0).toFixed(2)}</p>
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
                <p className="font-medium text-gray-800">{order.customerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone size={14} /> Phone Number
                </p>
                <p className="font-medium text-gray-800">{order.phone || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} /> Delivery Address
                </p>
                <p className="font-medium text-gray-800">{order.address || 'N/A'}</p>
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
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.product?.image && (
                        <img 
                          src={item.product.image} 
                          alt={item.product?.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-600">{item.product?.weightInKg ? `${item.product.weightInKg}kg` : ''}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{(item.price || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">₹{item.price || 0} each</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items found</p>
              )}
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
                <span className="text-gray-600">Sub Total</span>
                <span className="font-medium text-gray-800">₹{order.subTotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-medium text-gray-800">₹{order.deliveryCharge?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-800">{order.paymentMethod || 'COD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'NOT_REQUIRED' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Total Amount</span>
                <span className="font-bold text-green-600 text-lg">₹{(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between items-center">
          {canTakeAction ? (
            <div className="flex gap-3">
              {order.status === 'CONFIRMED' ? (
                <>
                  <button
                    onClick={() => onComplete(order)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <Package size={18} />
                    Out for Delivery
                  </button>
                  <button
                    onClick={() => onCancel(order)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onComplete(order)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle size={18} />
                    Complete
                  </button>
                  <button
                    onClick={() => onPending(order)}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Clock size={18} />
                    Pending
                  </button>
                  <button
                    onClick={() => onConfirm(order)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Check size={18} />
                    Confirm
                  </button>
                  <button
                    onClick={() => onCancel(order)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Order status cannot be changed
            </div>
          )}
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getOrders({ limit: 1000 });
      console.log('Orders API Response:', response);
      
      let ordersData = [];
      // Handle various API response structures
      if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
        ordersData = response.data.data.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (Array.isArray(response?.data)) {
        ordersData = response.data;
      } else if (Array.isArray(response)) {
        ordersData = response;
      }
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Map API response to component format
  const mapOrderData = (apiOrder) => {
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return {
      id: apiOrder._id,
      orderNumber: apiOrder._id?.substring(0, 8).toUpperCase() || 'N/A',
      customerName: apiOrder.user?.mobile || 'Unknown',
      phone: apiOrder.user?.mobile || 'N/A',
      address: apiOrder.deliveryLocation?.formattedAddress || apiOrder.deliveryLocation?.address || 'N/A',
      orderDate: formatDate(apiOrder.createdAt),
      totalAmount: apiOrder.payableAmount || 0,
      status: apiOrder.status || 'PENDING',
      paymentMethod: apiOrder.paymentMethod || 'COD',
      paymentStatus: apiOrder.paymentStatus || 'NOT_REQUIRED',
      subTotal: apiOrder.subTotal || 0,
      deliveryCharge: apiOrder.deliveryCharge || 0,
      items: apiOrder.items || [],
      originalData: apiOrder
    };
  };

  const mappedOrders = orders.map(mapOrderData);

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order ID',
      className: 'whitespace-nowrap font-medium text-green-600'
    },
    {
      key: 'customerName',
      header: 'Customer',
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
      className: 'whitespace-nowrap',
      render: (value) => {
        const getPaymentBadgeColor = (status) => {
          switch(status) {
            case 'SUCCESS': return 'bg-green-100 text-green-800';
            case 'NOT_REQUIRED': return 'bg-blue-100 text-blue-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'FAILED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadgeColor(value)}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (value) => {
        const getBadgeColor = (status) => {
          switch(status) {
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
            case 'PENDING': return 'bg-orange-100 text-orange-800';
            case 'INITIATED': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(value)}`}>
            {value}
          </span>
        );
      }
    }
  ];

  const actions = [
    {
      icon: <Eye size={16} />,
      onClick: handleViewDetails,
      className: 'text-blue-600 hover:text-blue-900 hover:bg-blue-100',
      title: 'View Details'
    },
    {
      icon: <Printer size={16} />,
      onClick: handlePrintInvoice,
      className: 'text-green-600 hover:text-green-900 hover:bg-green-100',
      title: 'Print Invoice'
    }
  ];

  function handleViewDetails(order) {
    setSelectedOrder(order);
  }

  function handleCloseModal() {
    setSelectedOrder(null);
  }

  // Print/Generate Invoice
  function handlePrintInvoice(order) {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .invoice-header { border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px; }
          .invoice-title { color: #10b981; font-size: 24px; font-weight: bold; }
          .section-title { font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #374151; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .info-item { margin-bottom: 8px; }
          .label { color: #6b7280; font-size: 12px; }
          .value { color: #111827; font-weight: 500; }
          .items-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .items-table th, .items-table td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          .items-table th { background-color: #f3f4f6; }
          .total-row { font-weight: bold; border-top: 2px solid #10b981; }
          .print-btn { margin-top: 20px; background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="invoice-title">🍚 RICE DEAL - INVOICE</div>
          <p>Order #${order.orderNumber} | ${order.orderDate}</p>
        </div>
        
        <div class="section-title">Customer Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="label">Name</div>
            <div class="value">${order.customerName || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="label">Phone</div>
            <div class="value">${order.phone || 'N/A'}</div>
          </div>
        </div>
        <div class="info-item">
          <div class="label">Address</div>
          <div class="value">${order.address || 'N/A'}</div>
        </div>
        
        <div class="section-title">Order Items</div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items && order.items.length > 0 ? order.items.map(item => `
              <tr>
                <td>${item.product?.name || 'Unknown'}</td>
                <td>${item.quantity}</td>
                <td>₹${(item.price || 0).toFixed(2)}</td>
                <td>₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            `).join('') : '<tr><td colspan="4">No items</td></tr>'}
            <tr class="total-row">
              <td colspan="3">Total Amount</td>
              <td>₹${(order.totalAmount || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="section-title">Payment Details</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="label">Payment Method</div>
            <div class="value">${order.paymentMethod || 'COD'}</div>
          </div>
          <div class="info-item">
            <div class="label">Payment Status</div>
            <div class="value">${order.paymentStatus || 'N/A'}</div>
          </div>
        </div>
        
        <button class="print-btn" onclick="window.print()">Print Invoice</button>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  }

  // Handle Confirm order
  async function handleConfirm(order) {
    try {
      await ordersAPI.updateOrder(order.id || order._id, { status: 'CONFIRMED' });
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  }

  // Handle Cancel order
  async function handleCancel(order) {
    try {
      await ordersAPI.updateOrder(order.id || order._id, { status: 'CANCELLED' });
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  }

  // Handle Complete order
  async function handleComplete(order) {
    try {
      await ordersAPI.updateOrder(order.id || order._id, { status: 'DELIVERED' });
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  }

  // Handle Pending order
  async function handlePending(order) {
    try {
      await ordersAPI.updateOrder(order.id || order._id, { status: 'PENDING' });
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  }

  // Filter orders based on status
  const filteredOrders = filterStatus === 'All' 
    ? mappedOrders 
    : mappedOrders.filter(order => order.status === filterStatus);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.payableAmount || 0), 0);
  const deliveredOrders = orders.filter(order => order.status === 'DELIVERED').length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;

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
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : totalOrders}</p>
              </div>
              <ShoppingBag className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{loading ? '...' : totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{loading ? '...' : deliveredOrders}</p>
              </div>
              <Check className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{loading ? '...' : pendingOrders}</p>
              </div>
              <Clock className="text-orange-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'INITIATED', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((status) => (
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
              Orders ({loading ? '...' : filteredOrders.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders found.</div>
          ) : (
            <>
<Table
                columns={columns}
                data={filteredOrders}
                actions={actions}
                emptyMessage="No orders found."
              />
              </>
            )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={handleCloseModal}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onComplete={handleComplete}
            onPending={handlePending}
          />
        )}
      </div>
    </div>
  );
};

export default OrderHistory;