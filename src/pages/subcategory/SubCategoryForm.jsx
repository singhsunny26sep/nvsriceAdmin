import { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';

// ====== SUBCATEGORY FORM COMPONENT ======
export const SubCategoryForm = ({ 
  subcategory = null, 
  categories = [],
  onSave, 
  onCancel,
  title = "Add New SubCategory",
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: subcategory?.name || '',
    description: subcategory?.description || '',
    categoryId: subcategory?.categoryId || subcategory?.category_id || ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(subcategory?.image || '');
  const [uploadError, setUploadError] = useState('');

  const isEditing = !!subcategory;
  const safeCategories = Array.isArray(categories) ? categories : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categoryId') {
      const selectedCategory = safeCategories.find(cat => 
        (cat._id && cat._id === value) || 
        (cat.id && cat.id === parseInt(value))
      );
      
      setFormData({ 
        ...formData, 
        categoryId: value,
        categoryName: selectedCategory?.name || ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUploadError('');
    
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      
      // Store the actual file
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter subcategory name');
      return;
    }
    
    if (!formData.categoryId) {
      alert('Please select a category');
      return;
    }
    
    // Create FormData object (same as Postman)
    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('description', formData.description.trim());
    
    // Add image file if selected
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    console.log('Submitting FormData with categoryId:', formData.categoryId);
    console.log('FormData entries:');
    for (let pair of submitData.entries()) {
      console.log(pair[0], pair[1]);
    }

    onSave(submitData, formData.categoryId, isEditing ? (subcategory.id || subcategory._id) : null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? 'Edit SubCategory' : title}
      </h2>
      <div className="space-y-4">
        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="relative">
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10"
              required
              disabled={loading}
            >
              <option value="">Select a category</option>
              {safeCategories.map(category => (
                <option key={category._id || category.id} value={category._id || category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
          {safeCategories.length === 0 && (
            <p className="text-xs text-red-500 mt-1">No categories available. Please add categories first.</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SubCategory Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter subcategory name"
            required
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="3"
            placeholder="Enter subcategory description"
            disabled={loading}
          />
        </div>

        {/* Image Upload - File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image * (Max 5MB)
          </label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          />
          {uploadError && (
            <p className="text-xs text-red-500 mt-1">{uploadError}</p>
          )}
          {imagePreview && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-2">Preview:</p>
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
            disabled={!formData.name.trim() || !formData.categoryId || loading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};