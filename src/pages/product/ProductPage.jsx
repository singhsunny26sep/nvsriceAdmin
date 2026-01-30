import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, MapPin } from 'lucide-react';
import ProductForm from './ProductForm';
import Table from '../../components/models/Table';
import { categoriesAPI, subcategoriesAPI, productsAPI, locationsAPI } from '../../components/api/api';

const ProductManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [mode, setMode] = useState('view');
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [locationPrice, setLocationPrice] = useState('');
  const [locationStock, setLocationStock] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch categories
      const categoriesResponse = await categoriesAPI.getCategories();
      console.log('Categories API Response:', categoriesResponse);
    
      // Extract data from nested structure: response.data.data.data
      let categoriesData = categoriesResponse?.data?.data?.data || [];
      if (!Array.isArray(categoriesData)) {
        console.warn('Categories data is not an array:', categoriesData);
        categoriesData = [];
      }
      console.log('Processed Categories:', categoriesData);
      setCategories(categoriesData);

      // Fetch subcategories
      const subcategoriesResponse = await subcategoriesAPI.getSubcategories();
      console.log('Subcategories API Response:', subcategoriesResponse);
      
      // Extract data from nested structure: response.data.data.data
      let subcategoriesData = subcategoriesResponse?.data?.data?.data || [];
      if (!Array.isArray(subcategoriesData)) {
        console.warn('Subcategories data is not an array:', subcategoriesData);
        subcategoriesData = [];
      }
      console.log('Processed Subcategories:', subcategoriesData);
      setSubcategories(subcategoriesData);

      // Fetch products
      const productsResponse = await productsAPI.getProducts();
      console.log('Products API Response:', productsResponse);

      // Extract data from nested structure: response.data.data.data
      let productsData = productsResponse?.data?.data?.data || [];
      if (!Array.isArray(productsData)) {
        console.warn('Products data is not an array:', productsData);
        productsData = [];
      }
      console.log('Processed Products:', productsData);
      setProducts(productsData);

      // Fetch locations
      const locationsResponse = await locationsAPI.getAllLocations();
      console.log('Locations API Response:', locationsResponse);

      // Extract data from nested structure: response.data.data.data
      let locationsData = locationsResponse?.data?.data?.data || [];
      if (!Array.isArray(locationsData)) {
        console.warn('Locations data is not an array:', locationsData);
        locationsData = [];
      }
      console.log('Processed Locations:', locationsData);
      setLocations(locationsData);

    } catch (err) {
      console.error('Error fetching data:', err);
      console.error('Error details:', err.response?.data);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: '_id',
      header: 'ID',
      className: 'whitespace-nowrap font-medium text-green-600',
      render: (id) => id.slice(-6) // Show last 6 characters of ID
    },
    {
      key: 'image',
      header: 'Image',
      className: 'whitespace-nowrap',
      render: (image, row) => (
        <img
          src={image || "/api/placeholder/40/40"}
          alt={row.name}
          className="rounded-full w-10 h-10 object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/40/40';
          }}
        />
      )
    },
    {
      key: 'name',
      header: 'Product Name',
      className: 'whitespace-nowrap font-semibold'
    },
    {
      key: 'brand',
      header: 'Brand',
      className: 'whitespace-nowrap text-gray-700'
    },
    {
      key: 'weightInKg',
      header: 'Weight',
      className: 'whitespace-nowrap text-gray-600',
      render: (weight) => `${weight} kg`
    },
    {
      key: 'categoryId',
      header: 'Category',
      className: 'whitespace-nowrap text-blue-600',
      render: (categoryId) => {
        const category = categories.find(c => c._id === categoryId);
        return category?.name || '';
      
      }
    },
    {
      key: 'subCategoryId',
      header: 'Variety',
      className: 'whitespace-nowrap text-purple-600',
      render: (subCategoryId) => {
        const subcategory = subcategories.find(s => s._id === subCategoryId);
        return subcategory?.name || 'N/A';
      }
    },
    {
      key: 'generalPrice',
      header: 'Price',
      className: 'whitespace-nowrap font-semibold text-green-700',
      render: (price) => `₹${price}`
    },
    {
      key: 'stockQuantity',
      header: 'Stock',
      className: 'whitespace-nowrap',
      render: (stock) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          stock === 0 ? 'bg-red-100 text-red-700' :
          stock <= 10 ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {stock}
        </span>
      )
    }
  ];

  const actions = [
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: 'text-green-600 hover:text-green-900 hover:bg-green-100',
      title: 'Edit Product'
    },
    {
      icon: <MapPin size={16} />,
      onClick: handleLocation,
      className: 'text-blue-600 hover:text-blue-900 hover:bg-blue-100',
      title: 'Update Location'
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-900 hover:bg-red-100',
      title: 'Delete Product'
    }
  ];

  async function handleAdd(formData) {
    try {
      setLoading(true);
      const response = await productsAPI.createProduct(formData);
      console.log('Create Product Response:', response.data);
      
      // Refresh products list
      await fetchAllData();
      setCurrentPage(1);
      setMode('view');
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setMode('edit');
  }

  async function handleLocationUpdate() {
    if (!selectedProduct || !selectedLocationId) return;
    try {
      setLoading(true);
      const payload = {
        locations: [
          {
            locationId: selectedLocationId,
            price: parseFloat(locationPrice) || selectedProduct.generalPrice,
            stockQuantity: parseInt(locationStock) || selectedProduct.stockQuantity
          }
        ]
      };
      const response = await productsAPI.updateProductLocations(selectedProduct._id, payload);
      console.log('Update Product Locations Response:', response.data);
      // Refresh products list
      await fetchAllData();
      setMode('view');
      setSelectedProduct(null);
      setSelectedLocationId('');
      setLocationPrice('');
      setLocationStock('');
    } catch (err) {
      console.error('Error updating product locations:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update product locations');
    } finally {
      setLoading(false);
    }
  }

  function handleLocation(product) {
    setSelectedProduct(product);
    setSelectedLocationId(product.locationId || '');
    setLocationPrice(product.generalPrice || '');
    setLocationStock(product.stockQuantity || '');
    setMode('location');
  }

  async function handleUpdate(formData, productId) {
    try {
      setLoading(true);
      const response = await productsAPI.updateProduct(productId, formData);
      console.log('Update Product Response:', response.data);
      
      // Refresh products list
      await fetchAllData();
      setCurrentPage(1);
      setMode('view');
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(product) {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        setLoading(true);
        await productsAPI.deleteProduct(product._id);
        console.log('Product deleted successfully');
        
        // Refresh products list
        await fetchAllData();
        setCurrentPage(1);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err.message || 'Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  }

  function handleCancel() {
    setMode('view');
    setEditingProduct(null);
    setSelectedProduct(null);
    setSelectedLocationId('');
    setLocationPrice('');
    setLocationStock('');
  }

  // Calculate stats - ensure products is always an array
  const productsArray = Array.isArray(products) ? products : [];
  const totalPages = Math.ceil(productsArray.length / itemsPerPage);
  const paginatedProducts = productsArray.slice((currentPage - 2) * itemsPerPage, currentPage * itemsPerPage);
  const totalValue = productsArray.reduce((sum, prod) => sum + (prod.generalPrice * prod.stockQuantity), 0);
  const lowStockCount = productsArray.filter(prod => prod.stockQuantity <= 10 && prod.stockQuantity > 0).length;
  const outOfStockCount = productsArray.filter(prod => prod.stockQuantity === 0).length;

  // Loading state
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Package className="text-green-600" size={36} />
            🍚 Rice Deal - Product Management
          </h1>
          <p className="text-gray-600">
            Manage your rice products inventory with ease
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button
              onClick={fetchAllData}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Add Form Modal */}
        {mode === 'add' && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl">
              <ProductForm
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Add New Rice Product"
              />
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {mode === 'edit' && editingProduct && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl">
              <ProductForm
                product={editingProduct}
                onSave={handleUpdate}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* Location Form Modal */}
        {mode === 'location' && selectedProduct && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MapPin className="text-blue-600" size={24} />
                  Update Location for "{selectedProduct.name}"
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Location
                    </label>
                    <select
                      value={selectedLocationId}
                      onChange={(e) => setSelectedLocationId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a location...</option>
                      {locations.map((location) => (
                        <option key={location._id} value={location._id}>
                          {location.zipcode}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedLocationId && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={locationPrice}
                          onChange={(e) => setLocationPrice(e.target.value)}
                          placeholder="Enter price"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={locationStock}
                          onChange={(e) => setLocationStock(e.target.value)}
                          placeholder="Enter stock"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      ℹ️ Location update functionality is not yet implemented in the backend.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleLocationUpdate}
                      disabled={!selectedLocationId || loading}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Update Location'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{productsArray.length}</p>
              </div>
              <Package className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-green-600">₹{totalValue.toFixed(2)}</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
              </div>
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <span className="text-3xl">❌</span>
            </div>
          </div>
        </div>

        {/* Add Button */}
        {mode === 'view' && (
          <div className="mb-6">
            <button
              onClick={() => setMode('add')}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              Add New Rice Product
            </button>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Rice Products ({productsArray.length})
            </h2>
          </div>
          {loading && productsArray.length > 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p>Updating...</p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={paginatedProducts}
              actions={actions}
              emptyMessage="No rice products found. Add your first product to get started!"
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center mt-6 space-y-4">
            <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
            <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded ${currentPage === page ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;