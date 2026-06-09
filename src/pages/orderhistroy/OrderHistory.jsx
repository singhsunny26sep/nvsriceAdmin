// ====== FILE: OrderHistory.jsx ======
import Table from '../../components/models/Table';
import { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Package, TrendingUp, DollarSign, User, Phone, MapPin, Check, X, Clock, CheckCircle, Printer, Navigation, CreditCard, Calendar, Hash, Truck } from 'lucide-react';
import { ordersAPI } from '../../components/api/api';

// Order Details Modal Component - Enhanced to show all fields
const OrderDetailsModal = ({ order, onClose, onConfirm, onCancel, onComplete, onPending }) => {
  if (!order) return null;

  // Use original API data if available, otherwise use mapped order
  const apiOrder = order.originalData || order;
  
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

  const getPaymentStatusBadge = (status) => {
    switch(status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'NOT_REQUIRED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if order can be acted upon (only for Pending and Confirmed orders)
  const canTakeAction = apiOrder.status === 'PENDING' || apiOrder.status === 'CONFIRMED';

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

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} />
            <div>
              <h2 className="text-xl font-bold">Order Details</h2>
              <p className="text-sm text-green-100">Order #{apiOrder._id?.substring(0, 8).toUpperCase() || 'N/A'}</p>
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
          {/* Order Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${getStatusColor(apiOrder.status)}`}>
              <p className="text-xs font-medium mb-1">Order Status</p>
              <p className="text-lg font-bold">{apiOrder.status}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <Calendar size={12} /> Created At
              </p>
              <p className="text-sm font-semibold text-gray-800">{formatDate(apiOrder.createdAt)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <Clock size={12} /> Last Updated
              </p>
              <p className="text-sm font-semibold text-gray-800">{formatDate(apiOrder.updatedAt)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <Hash size={12} /> Cart ID
              </p>
              <p className="text-sm font-semibold text-gray-800 font-mono">{apiOrder.cartId?.substring(0, 12)}...</p>
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
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-medium text-gray-800 font-mono text-sm">{apiOrder.user?._id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone size={14} /> Mobile Number
                </p>
                <p className="font-medium text-gray-800">{apiOrder.user?.mobile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User Role</p>
                <p className="font-medium text-gray-800 capitalize">{apiOrder.user?.role || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Created</p>
                <p className="font-medium text-gray-800">{formatDate(apiOrder.user?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-green-600" size={20} />
              Delivery Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Full Address</p>
                <p className="font-medium text-gray-800">{apiOrder.deliveryLocation?.formattedAddress || apiOrder.deliveryLocation?.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-800">{apiOrder.deliveryLocation?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Shop/Building</p>
                <p className="font-medium text-gray-800">{apiOrder.deliveryLocation?.shopOrBuildingNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="font-medium text-gray-800">{apiOrder.deliveryLocation?.area || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="font-medium text-gray-800">{apiOrder.deliveryLocation?.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">District</p>
                <p className="font-medium text-gray-800">{apiOrder.deliveryLocation?.district || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">State</p>
                <p className="font-medium text-gray-800">{apiOrder.deliveryLocation?.state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Zipcode</p>
                <p className="font-medium text-gray-800">{apiOrder.deliveryLocation?.zipcode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Navigation size={14} /> Coordinates
                </p>
                <p className="font-medium text-gray-800 font-mono text-sm">
                  {apiOrder.deliveryLocation?.coordinates ? 
                    `${apiOrder.deliveryLocation.coordinates[0]}, ${apiOrder.deliveryLocation.coordinates[1]}` : 
                    'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Truck size={14} /> Distance from Store
                </p>
                <p className="font-medium text-gray-800">{apiOrder.distanceKm?.toFixed(2)} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Is Default Address</p>
                <p className="font-medium text-gray-800">{apiOrder.deliveryLocation?.isDefault ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address Created</p>
                <p className="font-medium text-gray-800">{formatDate(apiOrder.deliveryLocation?.createdAt)}</p>
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
              {apiOrder.items && apiOrder.items.length > 0 ? (
                apiOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      {item.product?.image && (
                        <img 
                          src={item.product.image} 
                          alt={item.product?.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-500">Brand: {item.product?.brand || 'N/A'}</p>
                        <p className="text-sm text-gray-500">SKU: {item.product?.SKU || 'N/A'}</p>
                        <p className="text-sm text-gray-500">Weight: {item.product?.weightInKg ? `${item.product.weightInKg} kg` : 'N/A'}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        {item.product?.isActive === false && (
                          <p className="text-xs text-red-500 mt-1">⚠️ Product Inactive</p>
                        )}
                        {item.product?.isDeleted === true && (
                          <p className="text-xs text-red-500">⚠️ Product Deleted</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(item.price * item.quantity)}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
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
                <span className="font-medium text-gray-800">{formatCurrency(apiOrder.subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-medium text-gray-800">{formatCurrency(apiOrder.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-800">{apiOrder.paymentMethod || 'COD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(apiOrder.paymentStatus)}`}>
                  {apiOrder.paymentStatus || 'NOT_REQUIRED'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Total Payable Amount</span>
                <span className="font-bold text-green-600 text-lg">{formatCurrency(apiOrder.payableAmount)}</span>
              </div>
            </div>
          </div>

          {/* Transactions (if any) */}
          {apiOrder.transactions && apiOrder.transactions.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="text-green-600" size={20} />
                Transaction History
              </h3>
              <div className="space-y-2">
                {apiOrder.transactions.map((txn, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="text-gray-600">Transaction ID:</span> {txn.transactionId || 'N/A'}</p>
                      <p><span className="text-gray-600">Amount:</span> {formatCurrency(txn.amount)}</p>
                      <p><span className="text-gray-600">Status:</span> {txn.status || 'N/A'}</p>
                      <p><span className="text-gray-600">Date:</span> {formatDate(txn.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between items-center sticky bottom-0">
          {canTakeAction ? (
            <div className="flex flex-wrap gap-3">
              {apiOrder.status === 'CONFIRMED' ? (
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
                    Cancel Order
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onComplete(order)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle size={18} />
                    Mark Delivered
                  </button>
                  <button
                    onClick={() => onPending(order)}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Clock size={18} />
                    Mark Pending
                  </button>
                  <button
                    onClick={() => onConfirm(order)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Check size={18} />
                    Confirm Order
                  </button>
                  <button
                    onClick={() => onCancel(order)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <X size={18} />
                    Cancel Order
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {apiOrder.status === 'DELIVERED' ? '✓ Order completed' : 
               apiOrder.status === 'CANCELLED' ? '✗ Order cancelled' : 
               'Order status cannot be changed'}
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10
      };
      if (filterStatus !== 'All') {
        params.status = filterStatus;
      }

      const response = await ordersAPI.getOrders(params);
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

      // Extract pagination info
      const ordersTotal = response?.data?.data?.total || ordersData.length;
      const ordersTotalPages = response?.data?.data?.totalPages || 1;

      setOrders(ordersData);
      setTotalOrders(ordersTotal);
      setTotalPages(ordersTotalPages);
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
  }, [currentPage, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

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
      distanceKm: apiOrder.distanceKm,
      cartId: apiOrder.cartId,
      locationId: apiOrder.locationId,
      user: apiOrder.user,
      deliveryLocation: apiOrder.deliveryLocation,
      transactions: apiOrder.transactions || [],
      createdAt: apiOrder.createdAt,
      updatedAt: apiOrder.updatedAt,
      originalData: apiOrder  // Store original for modal
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
      className: 'whitespace-nowrap font-bold text-green-700',
      render: (value) => `₹${(value || 0).toFixed(2)}`
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

  // Print/Generate Invoice with FULL LOCATION DETAILS
  function handlePrintInvoice(order) {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const apiOrder = order.originalData || order;
    const deliveryLoc = apiOrder.deliveryLocation || {};
    
    // Format coordinates
    const coordinates = deliveryLoc.coordinates 
      ? `${deliveryLoc.coordinates[0]}, ${deliveryLoc.coordinates[1]}`
      : 'N/A';
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 20px;
            margin: 0;
            background: white;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 30px;
          }
          .invoice-header {
            border-bottom: 3px solid #10b981;
            padding-bottom: 15px;
            margin-bottom: 25px;
            text-align: center;
          }
          .invoice-title {
            color: #10b981;
            font-size: 28px;
            font-weight: bold;
          }
          .invoice-subtitle {
            color: #6b7280;
            font-size: 14px;
            margin-top: 5px;
          }
          .section-title {
            font-weight: bold;
            font-size: 18px;
            margin-top: 25px;
            margin-bottom: 15px;
            color: #1f2937;
            border-left: 4px solid #10b981;
            padding-left: 12px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
          }
          .info-item {
            margin-bottom: 5px;
          }
          .label {
            color: #6b7280;
            font-size: 12px;
            font-weight: 500;
          }
          .value {
            color: #111827;
            font-weight: 500;
            font-size: 14px;
            word-break: break-word;
          }
          .address-block {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .items-table th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 10px;
            font-size: 13px;
            font-weight: 600;
            color: #374151;
            border: 1px solid #e5e7eb;
          }
          .items-table td {
            padding: 10px;
            border: 1px solid #e5e7eb;
            font-size: 13px;
          }
          .total-row {
            font-weight: bold;
            background-color: #fefce8;
          }
          .total-row td {
            border-top: 2px solid #10b981;
          }
          .text-right {
            text-align: right;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .print-btn {
            margin-top: 20px;
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          }
          @media print {
            .print-btn { display: none; }
            .invoice-container { box-shadow: none; padding: 0; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="invoice-title">🍚 RICE DEAL</div>
            <div class="invoice-subtitle">GSTIN: 29ABCDE1234F1Z5 | CIN: U12345KA2020PTC123456</div>
            <div class="invoice-subtitle">#123, MG Road, Davangere, Karnataka - 577001 | Ph: 080-12345678</div>
            <h3 style="margin: 10px 0 0 0;">TAX INVOICE</h3>
            <p>Order #${order.orderNumber} | Date: ${order.orderDate}</p>
          </div>
          
          <!-- Customer Section -->
          <div class="section-title">👤 CUSTOMER DETAILS</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Mobile Number</div>
              <div class="value">${order.customerName || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">User ID</div>
              <div class="value">${apiOrder.user?._id?.substring(0,12) || 'N/A'}...</div>
            </div>
          </div>
          
          <!-- Delivery Location - FULL DETAILS -->
          <div class="section-title">📍 DELIVERY LOCATION</div>
          <div class="address-block">
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Recipient Name</div>
                <div class="value">${deliveryLoc.name || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="label">Shop/Building No.</div>
                <div class="value">${deliveryLoc.shopOrBuildingNumber || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="label">Address Line</div>
                <div class="value">${deliveryLoc.address || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="label">Area / Locality</div>
                <div class="value">${deliveryLoc.area || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="label">City</div>
                <div class="value">${deliveryLoc.city || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="label">District</div>
                <div class="value">${deliveryLoc.district || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="label">State</div>
                <div class="value">${deliveryLoc.state || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="label">PIN Code (Zipcode)</div>
                <div class="value">${deliveryLoc.zipcode || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="label">Coordinates (Lat, Lon)</div>
                <div class="value">${coordinates}</div>
              </div>
              <div class="info-item">
                <div class="label">Distance from Store</div>
                <div class="value">${apiOrder.distanceKm ? apiOrder.distanceKm.toFixed(2) + ' km' : 'N/A'}</div>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <div class="label">Formatted Full Address</div>
              <div class="value">${deliveryLoc.formattedAddress || deliveryLoc.address || 'N/A'}</div>
            </div>
          </div>
          
          <!-- Order Items -->
          <div class="section-title">🛒 ORDER ITEMS</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name / Brand</th>
                <th>Weight</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items && order.items.length > 0 ? order.items.map((item, idx) => `
                <tr>
                  <td>${idx+1}</td>
                  <td>
                    ${item.product?.name || 'Unknown'}<br>
                    <small style="color:#6b7280">${item.product?.brand || ''}</small>
                    ${item.product?.SKU ? `<br><small>SKU: ${item.product.SKU}</small>` : ''}
                  </td>
                  <td>${item.product?.weightInKg ? item.product.weightInKg + ' kg' : '-'}</td>
                  <td>${item.quantity}</td>
                  <td>₹${(item.price || 0).toFixed(2)}</td>
                  <td class="text-right">₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              `).join('') : '<tr><td colspan="6" style="text-align:center">No items</td></tr>'}
            </tbody>
          </table>
          
          <!-- Totals -->
          <table style="width: 100%; margin-top: 20px;">
            <tr>
              <td style="text-align: right; padding: 5px;"><strong>Sub Total:</strong></td>
              <td style="text-align: right; padding: 5px; width: 120px;">₹${(order.subTotal || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="text-align: right; padding: 5px;"><strong>Delivery Charge:</strong></td>
              <td style="text-align: right; padding: 5px;">₹${(order.deliveryCharge || 0).toFixed(2)}</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="text-align: right; padding: 10px 5px;"><strong>GRAND TOTAL:</strong></td>
              <td style="text-align: right; padding: 10px 5px;"><strong style="color:#10b981; font-size:18px;">₹${(order.totalAmount || 0).toFixed(2)}</strong></td>
            </tr>
          </table>
          
          <!-- Payment Info -->
          <div class="section-title">💳 PAYMENT DETAILS</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Payment Method</div>
              <div class="value">${order.paymentMethod || 'COD'}</div>
            </div>
            <div class="info-item">
              <div class="label">Payment Status</div>
              <div class="value">${order.paymentStatus || 'NOT_REQUIRED'}</div>
            </div>
          </div>
          
          <!-- Order Metadata -->
          <div class="section-title">📋 ORDER METADATA</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Order ID (MongoDB)</div>
              <div class="value" style="font-size:11px;">${apiOrder._id || order.id || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">Cart ID</div>
              <div class="value" style="font-size:11px;">${apiOrder.cartId || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="label">Created At</div>
              <div class="value">${order.orderDate}</div>
            </div>
            <div class="info-item">
              <div class="label">Last Updated</div>
              <div class="value">${apiOrder.updatedAt ? new Date(apiOrder.updatedAt).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Rice Deal! This is a computer generated invoice.</p>
            <p>For any queries, contact support@ricedeal.com | +91 9876543210</p>
          </div>
          
          <button class="print-btn" onclick="window.print()">🖨️ Print Invoice</button>
        </div>
        <script>
          window.onload = function() { 
            // Auto-print after a short delay to allow rendering
            setTimeout(() => window.print(), 500);
          }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  }

  // Handle Confirm order
  async function handleConfirm(order) {
    try {
      const orderId = order.id || order._id;
      await ordersAPI.updateOrder(orderId, { status: 'CONFIRMED' });
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  }

  // Handle Cancel order
  async function handleCancel(order) {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const orderId = order.id || order._id;
      await ordersAPI.updateOrder(orderId, { status: 'CANCELLED' });
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  }

  // Handle Complete/Delivered order
  async function handleComplete(order) {
    try {
      const orderId = order.id || order._id;
      await ordersAPI.updateOrder(orderId, { status: 'DELIVERED' });
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  }

  // Handle Pending order
  async function handlePending(order) {
    try {
      const orderId = order.id || order._id;
      await ordersAPI.updateOrder(orderId, { status: 'PENDING' });
      await fetchOrders();
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
  const statsTotalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.payableAmount || 0), 0);
  const deliveredOrders = orders.filter(order => order.status === 'DELIVERED').length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const cancelledOrders = orders.filter(order => order.status === 'CANCELLED').length;

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : statsTotalOrders}</p>
              </div>
              <ShoppingBag className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{loading ? '...' : `₹${totalRevenue.toFixed(2)}`}</p>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{loading ? '...' : cancelledOrders}</p>
              </div>
              <X className="text-red-600" size={32} />
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
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Orders
            </h2>
            <span className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {totalOrders} orders
            </span>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages} • Total: {totalOrders} orders
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
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