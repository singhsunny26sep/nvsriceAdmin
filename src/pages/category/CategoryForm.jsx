// ====== CATEGORY FORM COMPONENT (ADD/EDIT) ======
import React, { useState } from 'react';
import { Save, X, Upload, Image as ImageIcon } from 'lucide-react';

const CategoryForm = ({ 
  category = null, 
  onSave, 
  onCancel,
  title = "Add New Category",
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(category?.image || '');

  const isEditing = !!category;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    // Create FormData object
    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('description', formData.description.trim());
    
    // Add image file if selected
    if (imageFile) {
      submitData.append('image', imageFile);
    }
    
    // If editing, add the category ID
    if (isEditing && category?.id) {
      onSave(submitData, category.id);
    } else {
      onSave(submitData);
    }
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
        {isEditing ? 'Edit Category' : title}
      </h2>
      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter category name"
            disabled={loading}
          />
        </div>

        {/* Description Input */}
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
            placeholder="Enter category description"
            disabled={loading}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image
          </label>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                disabled={loading}
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {/* File Input */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors">
              <Upload size={16} />
              <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
            </label>
            {!imagePreview && (
              <div className="flex items-center text-gray-400">
                <ImageIcon size={20} className="mr-1" />
                <span className="text-sm">JPG, PNG (Max 5MB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim() || loading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;