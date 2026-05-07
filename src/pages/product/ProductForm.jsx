import { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { subcategoriesAPI } from '../../components/api/api';

const ProductForm = ({ 
  product = null, 
  onSave, 
  onCancel,
  title = "Add New Product"
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    generalPrice: product?.generalPrice || '',
    stockQuantity: product?.stockQuantity || '',
    categoryId: product?.categoryId || '',
    subcategoryId: product?.subCategoryId || product?.subcategoryId || '',
    weightInKg: product?.weightInKg || '',
    brand: product?.brand || ''
  });

  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [imageFile, setImageFile] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const isEditing = !!product;

  // Fetch subcategories on component mount
  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await subcategoriesAPI.getSubcategories();
      
      let subcategoriesData = [];
      if (response.data.data?.data && Array.isArray(response.data.data.data)) {
        subcategoriesData = response.data.data.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        subcategoriesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        subcategoriesData = response.data;
      }
      
      console.log('Fetched subcategories:', subcategoriesData);
      setSubcategories(subcategoriesData);
      
      // Extract unique categories from subcategories
      extractUniqueCategories(subcategoriesData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setLoading(false);
    }
  };

  // Extract unique categories from subcategories
  const extractUniqueCategories = (subcategoriesData) => {
    const categoryMap = new Map();
    
    subcategoriesData.forEach(sub => {
      let catId, catName;
      
      if (sub.category && typeof sub.category === 'object') {
        catId = sub.category._id || sub.category.id;
        catName = sub.category.name;
      } else if (sub.categoryId) {
        catId = sub.categoryId;
        catName = sub.categoryName || `Category ${catId}`;
      }
      
      if (catId && !categoryMap.has(catId)) {
        categoryMap.set(catId, { id: catId, name: catName });
      }
    });
    
    const categories = Array.from(categoryMap.values());
    console.log('Extracted unique categories:', categories);
    setUniqueCategories(categories);
  };

  // Filter subcategories when category changes
  useEffect(() => {
    console.log('Filtering subcategories for categoryId:', formData.categoryId);
    
    if (Array.isArray(subcategories) && formData.categoryId) {
      const filtered = subcategories.filter(sub => {
        const match = 
          sub.categoryId === formData.categoryId || 
          sub.categoryId === parseInt(formData.categoryId) ||
          sub.category === formData.categoryId ||
          sub.category?._id === formData.categoryId ||
          sub.category?.id === formData.categoryId;
        
        return match;
      });
      
      console.log('Filtered subcategories:', filtered);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [subcategories, formData.categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categoryId') {
      setFormData({ 
        ...formData, 
        categoryId: value,
        subcategoryId: '' // Reset subcategory when category changes
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.subcategoryId || !formData.generalPrice) {
      alert('Please fill all required fields');
      return;
    }
    
    const formDataToSend = new FormData();
    
    formDataToSend.append('subCategoryId', formData.subcategoryId);
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('brand', formData.brand.trim());
    formDataToSend.append('weightInKg', formData.weightInKg.toString());
    formDataToSend.append('generalPrice', formData.generalPrice.toString());
    formDataToSend.append('stockQuantity', formData.stockQuantity.toString());
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    console.log('FormData contents:');
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    onSave(formDataToSend, isEditing ? product.id : null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? 'Edit Product' : title}
      </h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., My choice"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Shri krishna"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category * (Found: {uniqueCategories.length})
            </label>
            <div className="relative">
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10"
                required
              >
                <option value="">Select a category</option>
                {uniqueCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name || 'Unnamed Category'}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
            {uniqueCategories.length === 0 && (
              <p className="text-xs text-red-500 mt-1">No categories loaded. Check console.</p>
            )}
          </div>

          {/* SubCategory Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SubCategory * (Found: {filteredSubcategories.length})
            </label>
            <div className="relative">
              <select
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleChange}
                disabled={!formData.categoryId || filteredSubcategories.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {!formData.categoryId 
                    ? 'Select a category first' 
                    : filteredSubcategories.length === 0
                    ? 'No subcategories available for this category'
                    : 'Select a subcategory'}
                </option>
                {filteredSubcategories.map((subcategory) => {
                  const id = subcategory.id || subcategory._id;
                  return (
                    <option key={id} value={id}>
                      {subcategory.name || 'Unnamed Subcategory'}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
            {formData.subcategoryId && (
              <p className="text-xs text-gray-500 mt-1">
                Selected ID: {formData.subcategoryId}
              </p>
            )}
          </div>

          {/* Price, Weight and Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                General Price * (₹)
              </label>
              <input
                type="number"
                name="generalPrice"
                value={formData.generalPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1200"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight in Kg *
              </label>
              <input
                type="number"
                name="weightInKg"
                value={formData.weightInKg}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="12"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="115"
                min="0"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="3"
              placeholder="Good rice mumma's made"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image (File)
            </label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {imageFile && (
              <p className="text-xs text-green-600 mt-1">
                Selected: {imageFile.name}
              </p>
            )}
            {imagePreview && (
              <div className="mt-3">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || !formData.subcategoryId || !formData.generalPrice || !formData.weightInKg || !formData.stockQuantity || !formData.description.trim() || !formData.brand.trim()}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={16} />
              {isEditing ? 'Update Product' : 'Create Product'}
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;