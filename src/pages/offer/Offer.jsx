import { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Percent, TrendingUp, Users, Gift, Clock } from 'lucide-react';
import OfferForm from './OfferForm';

import Table from '../../components/models/Table';

const Offer = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: 'Diwali Special - Flat 20% Off',
      description: 'Celebrate Diwali with our special discount on all rice products',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 500,
      maxDiscountAmount: 200,
      offerCode: 'DIWALI20',
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      status: 'active',
      offerType: 'festive',
      usageCount: 245,
      image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400',
      termsConditions: 'Valid on orders above ₹500. Maximum discount ₹200.'
    },
    {
      id: 2,
      title: 'First Order Special',
      description: 'Get ₹100 off on your first rice purchase',
      discountType: 'fixed',
      discountValue: 100,
      minOrderAmount: 300,
      maxDiscountAmount: null,
      offerCode: 'FIRST100',
      startDate: '2025-09-01',
      endDate: '2025-12-31',
      status: 'active',
      offerType: 'first-order',
      usageCount: 89,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      termsConditions: 'Valid only for new customers. Minimum order ₹300.'
    },
    {
      id: 3,
      title: 'Bulk Order Discount',
      description: 'Save 15% on bulk orders of 25kg or more',
      discountType: 'percentage',
      discountValue: 15,
      minOrderAmount: 2000,
      maxDiscountAmount: 500,
      offerCode: 'BULK15',
      startDate: '2025-08-01',
      endDate: '2025-11-30',
      status: 'active',
      offerType: 'bulk-order',
      usageCount: 156,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      termsConditions: 'Valid on orders above ₹2000. Maximum discount ₹500.'
    },
    {
      id: 4,
      title: 'Summer Special - ₹50 Off',
      description: 'Beat the heat with our summer discount',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 250,
      maxDiscountAmount: null,
      offerCode: 'SUMMER50',
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      status: 'expired',
      offerType: 'seasonal',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      usageCount: 423,
      termsConditions: 'Valid on orders above ₹250.'
    },
    {
      id: 5,
      title: 'Weekend Mega Sale',
      description: 'Flat 10% off on all rice varieties this weekend',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscountAmount: 150,
      offerCode: 'WEEKEND10',
      startDate: '2025-10-05',
      endDate: '2025-10-06',
      status: 'inactive',
      offerType: 'general',
      usageCount: 0,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      termsConditions: 'No minimum order. Maximum discount ₹150.'
    }
  ]);

  const [mode, setMode] = useState('view');
  const [editingOffer, setEditingOffer] = useState(null);
  const [nextId, setNextId] = useState(6);
  const [filterStatus, setFilterStatus] = useState('All');

  const columns = [
    {
      key: 'id',
      header: 'ID',
      className: 'whitespace-nowrap font-medium text-green-600'
    },
    {
      key: 'image',
      header: 'Image',
      className: 'whitespace-nowrap',
      render: (image,Image) => (
        <img
          src={image || "/api/placeholder/40/40"}
          alt={Image}
          className="rounded-full w-10 h-10 object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/40/40';
          }}
        />
      )
    },
    {
      key: 'title',
      header: 'Offer Title',
      className: 'font-semibold'
    },
    {
      key: 'offerCode',
      header: 'Code',
      className: 'whitespace-nowrap font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded'
    },
    {
      key: 'discount',
      header: 'Discount',
      className: 'whitespace-nowrap'
    },
    {
      key: 'offerType',
      header: 'Type',
      className: 'whitespace-nowrap'
    },
    {
      key: 'usageCount',
      header: 'Usage',
      className: 'whitespace-nowrap text-center font-medium'
    },
    {
      key: 'endDate',
      header: 'Valid Till',
      className: 'whitespace-nowrap text-gray-600'
    },
    {
      key: 'status',
      header: 'Status',
      className: 'whitespace-nowrap'
    }
  ];

  const actions = [
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: 'text-green-600 hover:text-green-900 hover:bg-green-100',
      title: 'Edit Offer'
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-900 hover:bg-red-100',
      title: 'Delete Offer'
    }
  ];

  function handleAdd(offerData) {
    const newOffer = {
      id: nextId,
      ...offerData
    };
    setOffers([...offers, newOffer]);
    setNextId(nextId + 1);
    setMode('view');
  }

  function handleEdit(offer) {
    setEditingOffer(offer);
    setMode('edit');
  }

  function handleUpdate(updatedOffer) {
    setOffers(offers.map(off =>
      off.id === updatedOffer.id ? updatedOffer : off
    ));
    setMode('view');
    setEditingOffer(null);
  }

  function handleDelete(offer) {
    if (window.confirm(`Are you sure you want to delete "${offer.title}"?`)) {
      setOffers(offers.filter(off => off.id !== offer.id));
    }
  }

  function handleCancel() {
    setMode('view');
    setEditingOffer(null);
  }

  // Filter offers
  const filteredOffers = filterStatus === 'All'
    ? offers
    : offers.filter(off => off.status === filterStatus.toLowerCase());

  // Calculate stats
  const totalOffers = offers.length;
  const activeOffers = offers.filter(off => off.status === 'active').length;
  const totalUsage = offers.reduce((sum, off) => sum + off.usageCount, 0);
  const totalDiscount = offers
    .filter(off => off.discountType === 'fixed')
    .reduce((sum, off) => sum + (off.discountValue * off.usageCount), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Gift className="text-green-600" size={36} />
            🍚 Rice Deal - Offer Management
          </h1>
          <p className="text-gray-600">
            Create and manage promotional offers for your customers
          </p>
        </div>

        {/* Add Form Modal */}
        {mode === 'add' && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <OfferForm
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Create New Offer"
              />
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {mode === 'edit' && editingOffer && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <OfferForm
                offer={editingOffer}
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
                <p className="text-sm text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold text-gray-800">{totalOffers}</p>
              </div>
              <Gift className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Offers</p>
                <p className="text-2xl font-bold text-green-600">{activeOffers}</p>
              </div>
              <Tag className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsage}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Discounts Given</p>
                <p className="text-2xl font-bold text-purple-600">₹{totalDiscount.toFixed(0)}</p>
              </div>
              <Percent className="text-purple-600" size={32} />
            </div>
          </div>
        </div> */}

        {/* Filter Tabs */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'Active', 'Inactive', 'Expired'].map((status) => (
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

        {/* Add Button */}
        {mode === 'view' && (
          <div className="mb-6">
            <button
              onClick={() => setMode('add')}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={18} />
              Create New Offer
            </button>
          </div>
        )}

        {/* Offers Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <Table
            columns={columns}
            data={filteredOffers}
            actions={actions}
            noDataMessage="No offers found."
            renderRow={(offer) => ({
              id: offer.id,
              image: offer.image ? (
                <img

                  src={offer.image}
                  alt={offer.title}
                  className="w-16 h-10 object-cover rounded-md border border-gray-300"
                />
              ) : (
                <img
                  src="/api/placeholder/40/40"
                  alt="Placeholder"
                  className="w-16 h-10 object-cover rounded-md border border-gray-300"
                />
              ),
              title: offer.title,
              description: offer.description,
              discount: offer.discount,
              discountType: offer.discountType,
              startDate: offer.startDate,
              endDate: offer.endDate,
              status: offer.status,
            })}
          />
        </div>
      </div>
    </div>
  );
};
export default Offer;