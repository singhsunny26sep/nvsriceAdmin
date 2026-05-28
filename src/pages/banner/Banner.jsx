import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, X, Eye } from 'lucide-react';
import { bannersAPI } from '../../components/api/api';

// Banner Preview Modal
const BannerPreviewModal = ({ banner, onClose }) => {
  if (!banner) return null;

  const imageUrl = banner.image?.url || banner.image || '';

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Eye size={24} />
            <h2 className="text-xl font-bold">Banner Preview</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="relative rounded-lg overflow-hidden mb-4">
            <img
              src={imageUrl}
              alt={banner.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Banner+Image';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{banner.name}</h3>
              <p className="text-white text-lg">{banner.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {banner.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-800">
                {new Date(banner.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

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

// Banner Form Component
const BannerForm = ({ banner, onSave, onCancel, title = "Edit Banner" }) => {
  const [formData, setFormData] = useState({
    name: banner?.name || '',
    description: banner?.description || '',
    isActive: banner?.isActive !== undefined ? banner.isActive : true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    banner?.image?.url || banner?.image || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Require image for new banners
    if (!banner && !image) {
      alert('Please select a banner image');
      return;
    }
    
    setIsSubmitting(true);
  
    try {
      const formDataObj = new FormData();
  
      // Backend expects 'name' field
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("isActive", formData.isActive.toString());
  
      if (image) {
        formDataObj.append("image", image);
      }
  
      console.log('Submitting form data:', {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        hasNewImage: !!image,
        bannerId: banner?._id
      });
  
      await onSave(formDataObj, banner?._id);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message || 'Failed to save banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Summer Sale Banner"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Up to 50% off on all items"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image {banner ? '' : '*'}
          </label>
          
          <div className="mt-2">
            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
              <div className="flex items-center gap-2 text-gray-600">
                <Image size={20} />
                <span className="text-sm font-medium">
                  {image ? image.name : banner ? 'Click to change image' : 'Click to upload image'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 text-green-600 focus:ring-green-500 rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
            Set as Active Banner
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : banner ? 'Update Banner' : 'Add Banner'}
          </button>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Table Component
const Table = ({ columns, data, actions, emptyMessage }) => {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row._id} className="hover:bg-green-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className={`px-6 py-4 ${column.className || ''}`}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => action.onClick(row)}
                        className={`p-2 rounded-lg transition-colors ${action.className}`}
                        title={action.title}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Banner Component
const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('view');
  const [editingBanner, setEditingBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannersAPI.getBanners();
      
      console.log('GET Banners - Full Response:', response);
      
      let bannersData = [];
      
      // Handle the specific API response structure
      // API returns: { data: { success: true, data: { data: [...] } } }
      if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
        bannersData = response.data.data.data;
        console.log('✅ Found banners in response.data.data.data');
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        bannersData = response.data.data;
        console.log('✅ Found banners in response.data.data (array)');
      } else if (response?.data?.banners && Array.isArray(response.data.banners)) {
        bannersData = response.data.banners;
        console.log('✅ Found banners in response.data.banners');
      } else if (response?.banners && Array.isArray(response.banners)) {
        bannersData = response.banners;
        console.log('✅ Found banners in response.banners');
      } else if (response?.data && Array.isArray(response.data)) {
        bannersData = response.data;
        console.log('✅ Found banners in response.data (array)');
      } else if (Array.isArray(response)) {
        bannersData = response;
        console.log('✅ Found banners in response (array)');
      } else {
        console.log('❌ Could not find banners array in response');
        console.log('Response structure:', response);
      }
      
      console.log('Extracted banners count:', bannersData.length);
      console.log('Extracted banners:', bannersData);
      
      setBanners(Array.isArray(bannersData) ? bannersData : []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
      alert('Failed to fetch banners: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      console.log('Creating banner...');
      const response = await bannersAPI.createBanner(formData);
      console.log('CREATE Response:', response);

      // Check for successful response - axios wraps response in data property
      const isSuccess = response?.data?.success === true || response?.status === 200 || response?.status === 201;

      if (isSuccess) {
        const newBanner = response?.data?.banner || response?.data?.data || response?.data;

        if (newBanner && typeof newBanner === 'object') {
          setBanners(prev => [...prev, newBanner]);
        } else {
          await fetchBanners();
        }
        setMode('view');
        alert(response?.data?.message || response?.data?.data?.message || 'Banner created successfully!');
      } else if (response?.data?.success === false) {
        throw new Error(response?.data?.message || response?.data?.data?.message || 'Failed to create banner');
      } else {
        // Assume success if we got a 2xx response without explicit success flag
        if (response?.status >= 200 && response?.status < 300) {
          const newBanner = response?.data?.banner || response?.data?.data || response?.data;
          if (newBanner && typeof newBanner === 'object') {
            setBanners(prev => [...prev, newBanner]);
          } else {
            await fetchBanners();
          }
          setMode('view');
          alert(response?.data?.message || response?.data?.data?.message || 'Banner created successfully!');
        } else {
          throw new Error('Unexpected response from server');
        }
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      alert(error.message || 'Failed to create banner. Please check console for details.');
    }
  };

  const handleUpdate = async (formData, bannerId) => {
    try {
      console.log('Updating banner ID:', bannerId);
      
      const response = await bannersAPI.updateBanner(bannerId, formData);
      console.log('UPDATE Response:', response);
      
      const isSuccess = response?.data?.success === true || response?.status === 200 || response?.status === 201;
      
      if (isSuccess || (response?.status >= 200 && response?.status < 300)) {
        const updatedBanner = response?.data?.banner || response?.data?.data || response?.data;
        
        if (updatedBanner && typeof updatedBanner === 'object' && (updatedBanner._id || updatedBanner.id)) {
          setBanners(prev => 
            prev.map(b => (b._id === bannerId || b.id === bannerId) ? updatedBanner : b)
          );
        } else {
          await fetchBanners();
        }
        
        setMode('view');
        setEditingBanner(null);
        alert(response?.data?.message || response?.data?.data?.message || 'Banner updated successfully!');
      } else if (response?.data?.success === false) {
        throw new Error(response?.data?.message || response?.data?.data?.message || 'Failed to update banner');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      alert(error.message || 'Failed to update banner. Please check console for details.');
    }
  };

  const handleDelete = async (banner) => {
    if (window.confirm(`Are you sure you want to delete "${banner.name}"?`)) {
      try {
        console.log('Deleting banner ID:', banner._id);
        const response = await bannersAPI.deleteBanner(banner._id);
        console.log('DELETE Response:', response);
        
        const isSuccess = response?.data?.success || response?.status === 200;
        
        if (isSuccess) {
          setBanners(prev => prev.filter(b => b._id !== banner._id));
          alert(response.data?.message || response.data?.data?.message || 'Banner deleted successfully!');
        } else {
          throw new Error(response?.data?.message || response?.data?.data?.message || 'Failed to delete banner');
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert(error.message || 'Failed to delete banner. Please check console for details.');
      }
    }
  };

  function handleEdit(banner) {
    console.log('Editing banner:', banner);
    setEditingBanner(banner);
    setMode('edit');
  }

  function handleCancel() {
    setMode('view');
    setEditingBanner(null);
  }

  const columns = [
    {
      key: '_id',
      header: 'ID',
      className: 'whitespace-nowrap font-medium text-green-600',
      render: (id) => `#${id.slice(-6)}`
    },
    {
      key: 'image',
      header: 'Image',
      className: 'whitespace-nowrap',
      render: (value) => {
        const imageUrl = value?.url || value || '';
        return (
          <img
            src={imageUrl || "https://via.placeholder.com/40x40"}
            alt="Banner"
            className="w-16 h-10 object-cover rounded-md border border-gray-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/40x40';
            }}
          />
        );
      }
    },
    {
      key: 'name',
      header: 'Name',
      className: 'whitespace-nowrap font-semibold'
    },
    {
      key: 'description',
      header: 'Description',
      className: 'text-gray-600 max-w-xs truncate'
    },
    {
      key: 'isActive',
      header: 'Status',
      className: 'whitespace-nowrap',
      render: (isActive) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      className: 'whitespace-nowrap text-sm text-gray-500',
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  const actions = [
    {
      icon: <Eye size={16} />,
      onClick: (banner) => setPreviewBanner(banner),
      className: 'text-green-600 hover:text-green-900 hover:bg-green-100',
      title: 'Preview Banner'
    },
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: 'text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100',
      title: 'Edit Banner'
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-900 hover:bg-red-100',
      title: 'Delete Banner'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Image className="text-green-600" size={36} />
            Banner Management
          </h1>
          <p className="text-gray-600">
            Create and manage promotional banners for your website
          </p>
        </div>

        {mode === 'add' && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <BannerForm
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Add New Banner"
              />
            </div>
          </div>
        )}

        {mode === 'edit' && editingBanner && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <BannerForm
                banner={editingBanner}
                onSave={handleUpdate}
                onCancel={handleCancel}
                title="Edit Banner"
              />
            </div>
          </div>
        )}

        {previewBanner && (
          <BannerPreviewModal
            banner={previewBanner}
            onClose={() => setPreviewBanner(null)}
          />
        )}

        {mode === 'view' && (
          <div className="mb-6">
            <button
              onClick={() => setMode('add')}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={18} />
              Add New Banner
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-green-100">
          <div className="px-6 py-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-lg font-semibold text-gray-800">
              All Banners ({banners.length})
            </h2>
          </div>
          <Table
            columns={columns}
            data={banners}
            actions={actions}
            emptyMessage="No banners found. Add your first banner to get started!"
          />
        </div>

        {banners.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600">Total Banners</p>
              <p className="text-2xl font-bold text-gray-800">{banners.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-4 hover:shadow-md transition-shadow">
              <p className="text-sm text-green-700">Active Banners</p>
              <p className="text-2xl font-bold text-green-600">
                {banners.filter(b => b.isActive).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600">Inactive Banners</p>
              <p className="text-2xl font-bold text-gray-600">
                {banners.filter(b => !b.isActive).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;