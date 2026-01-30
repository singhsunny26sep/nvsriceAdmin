// ====== FILE 1: OfferForm.jsx ======
import { useState } from 'react';
import { Save, X, Tag, Percent, Calendar, ChevronDown } from 'lucide-react';

const OfferForm = ({ 
  offer = null, 
  onSave, 
  onCancel,
  title = "Create New Offer"
}) => {
  const [formData, setFormData] = useState({
    title: offer?.title || '',
    description: offer?.description || '',
    discountType: offer?.discountType || 'percentage',
    discountValue: offer?.discountValue || '',
    minOrderAmount: offer?.minOrderAmount || '',
    maxDiscountAmount: offer?.maxDiscountAmount || '',
    offerCode: offer?.offerCode || '',
    startDate: offer?.startDate || '',
    endDate: offer?.endDate || '',
    status: offer?.status || 'active',
    offerType: offer?.offerType || 'general',
    termsConditions: offer?.termsConditions || '',
    image: offer?.image || ''
  });

  const [imagePreview, setImagePreview] = useState(offer?.image || '');

  const isEditing = !!offer;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateOfferCode = () => {
    const code = 'RICE' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({ ...formData, offerCode: code });
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.discountValue || !formData.offerCode.trim()) return;
    
    const offerData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
      maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
      offerCode: formData.offerCode.trim().toUpperCase(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      offerType: formData.offerType,
      termsConditions: formData.termsConditions.trim(),
      image: formData.image,
      usageCount: offer?.usageCount || 0
    };

    if (isEditing) {
      onSave({ ...offer, ...offerData });
    } else {
      onSave(offerData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Tag className="text-green-600" size={24} />
        {isEditing ? 'Edit Offer' : title}
      </h2>
      <div className="space-y-4">
        {/* Offer Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offer Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Diwali Special - Flat 20% Off"
            required
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
            placeholder="Enter offer description..."
          />
        </div>

        {/* Discount Type and Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type *
            </label>
            <div className="relative">
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value *
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={formData.discountType === 'percentage' ? '10' : '100'}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Min Order and Max Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Order Amount (₹)
            </label>
            <input
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="500"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Discount Amount (₹)
            </label>
            <input
              type="number"
              name="maxDiscountAmount"
              value={formData.maxDiscountAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="200"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Offer Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
            <span>Offer Code *</span>
            <button
              type="button"
              onClick={generateOfferCode}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              Generate Code
            </button>
          </label>
          <input
            type="text"
            name="offerCode"
            value={formData.offerCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
            placeholder="RICE20OFF"
            required
          />
        </div>

        {/* Offer Type and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Type
            </label>
            <div className="relative">
              <select
                name="offerType"
                value={formData.offerType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="general">General</option>
                <option value="first-order">First Order</option>
                <option value="festive">Festive Special</option>
                <option value="seasonal">Seasonal</option>
                <option value="bulk-order">Bulk Order</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Start and End Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Calendar size={14} />
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Calendar size={14} />
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Terms & Conditions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Terms & Conditions
          </label>
          <textarea
            name="termsConditions"
            value={formData.termsConditions}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="3"
            placeholder="Enter terms and conditions..."
          />
        </div>

        {/* Offer Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offer Banner Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {imagePreview && (
            <div className="mt-3">
              <img 
                src={imagePreview} 
                alt="Offer Preview" 
                className="w-full max-w-md h-40 object-cover rounded-md border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.discountValue || !formData.offerCode.trim()}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {isEditing ? 'Update Offer' : 'Create Offer'}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferForm;


// ====== FILE 2: Offer.jsx ======
// Import your existing Table component


