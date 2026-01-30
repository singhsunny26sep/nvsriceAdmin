// ====== MAIN CATEGORY MANAGEMENT COMPONENT ======

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CategoryForm from './CategoryForm';
import Table from '../../components/models/Table';
import { categoriesAPI } from '../../components/api/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [mode, setMode] = useState('view'); // 'view', 'add', 'edit'
  const [editingCategory, setEditingCategory] = useState(null);
  const categoriesLoaded = useRef(false);

  // Table configuration
  const columns = [
    {
      key: '_id',
      header: 'ID',
      className: 'whitespace-nowrap font-medium text-green-600',
      render: (id) => id.slice(-8) // Show last 8 characters of MongoDB ID
    },
    {
      key: 'image',
      header: 'Image',
      className: 'whitespace-nowrap',
      render: (image, row) => (
        <img
          src={image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHN2Zy8+"}
          alt={row.name}
          className="rounded-full w-10 h-10 object-cover"
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHN2Zy8+";
            e.target.onError = null; // Prevent further error handling
          }}
        />
      )
    },
    {
      key: 'name',
      header: 'Name',
      className: 'whitespace-nowrap font-semibold uppercase'
    },
    {
      key: 'description',
      header: 'Description',
      className: 'text-gray-600'
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (isActive) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const actions = [
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: 'text-green-600 hover:text-green-900 hover:bg-green-100',
      title: 'Edit Category'
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-900 hover:bg-red-100',
      title: 'Delete Category'
    }
  ];

  // Fetch categories from API (GET)
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getCategories();
      
      console.log('API Response:', response.data);
      
      // Handle nested data structure: response.data.data.data
      const categoriesData = response.data?.data?.data || 
                            response.data?.data || 
                            response.data || 
                            [];
      
      console.log('Extracted categories:', categoriesData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      alert('Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle add category (POST)
  async function handleAdd(categoryData) {
    try {
      setFormLoading(true);
      const response = await categoriesAPI.createCategory(categoryData);
      
      // Add new category to state
      const newCategory = response.data?.data || response.data;
      setCategories([...categories, newCategory]);
      
      setMode('view');
      alert('Category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      alert(errorMessage);
    } finally {
      setFormLoading(false);
    }
  }

  // Handle edit category
  function handleEdit(category) {
    setEditingCategory(category);
    setMode('edit');
  }

  // Handle update category (PUT)
  async function handleUpdate(updatedCategory) {
    try {
      setFormLoading(true);
      const response = await categoriesAPI.updateCategory(
        updatedCategory._id || updatedCategory.id, 
        {
          name: updatedCategory.name,
          description: updatedCategory.description,
          image: updatedCategory.image
        }
      );
      
      // Update category in state
      const updated = response.data?.data || response.data;
      setCategories(categories.map(cat => 
        (cat._id || cat.id) === (updatedCategory._id || updatedCategory.id) ? updated : cat
      ));
      
      setMode('view');
      setEditingCategory(null);
      alert('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      alert(errorMessage);
    } finally {
      setFormLoading(false);
    }
  }

  // Handle delete category (DELETE)
  async function handleDelete(category) {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      await categoriesAPI.deleteCategory(category._id || category.id);
      
      // Remove category from state
      setCategories(categories.filter(cat => 
        (cat._id || cat.id) !== (category._id || category.id)
      ));
      alert('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      alert(errorMessage);
    }
  }

  // Handle cancel
  function handleCancel() {
    setMode('view');
    setEditingCategory(null);
  }

  // Handle refresh
  const handleRefresh = () => {
    categoriesLoaded.current = false;
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Category Management
              </h1>
              <p className="text-gray-600">
                Manage your categories with ease using our modern interface
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Add Form Modal */}
        {mode === 'add' && (
          <div className='fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-md'>
              <CategoryForm
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Add New Category"
                loading={formLoading}
              />
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {mode === 'edit' && editingCategory && (
          <div className='fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-md'>
              <CategoryForm
                category={editingCategory}
                onSave={handleUpdate}
                onCancel={handleCancel}
                title="Edit Category"
                loading={formLoading}
              />
            </div>
          </div>
        )}

        {/* Add Button */}
        {mode === 'view' && (
          <div className="mb-6">
            <button
              onClick={() => setMode('add')}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={18} />
              Add New Category
            </button>
          </div>
        )}

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Categories {!loading && `(${categories.length})`}
            </h2>
          </div>
          <Table
            columns={columns}
            data={categories}
            actions={actions}
            loading={loading}
            emptyMessage="No categories found. Add your first category to get started!"
          />
        </div>

        {/* Stats */}
        {!loading && categories.length > 0 && (
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-green-800">
              <span className="font-medium">
                Total Categories: {categories.length}
              </span>
              <span className="text-sm">
                API Connected ✓
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;