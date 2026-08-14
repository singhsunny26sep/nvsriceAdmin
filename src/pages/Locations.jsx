import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, Search, Filter, X } from "lucide-react";
import { locationsAPI } from "../components/api/api";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProduct, setFilterProduct] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    shopOrBuildingNumber: "",
    address: "",
    city: "",
    district: "",
    zipcode: "",
    state: "",
    area: "",
    country: "India",
    isProductAddress: false,
    coordinates: ["", ""],
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationsAPI.getAllLocations();
      let data =
        response?.data?.data?.data ||
        response?.data?.data ||
        response?.data ||
        [];
      if (!Array.isArray(data)) data = [];
      setLocations(data);
    } catch (err) {
      setError(err.message || "Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoordinateChange = (index, value) => {
    const newCoords = [...formData.coordinates];
    newCoords[index] = value;
    setFormData((prev) => ({ ...prev, coordinates: newCoords }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      shopOrBuildingNumber: "",
      address: "",
      city: "",
      district: "",
      zipcode: "",
      state: "",
      area: "",
      country: "India",
      isProductAddress: false,
      coordinates: ["", ""],
    });
    setEditingLocation(null);
    setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);

    const { name, address, city, state, zipcode } = formData;
    if (!name || !address || !city || !state || !zipcode) {
      alert("Please fill in all required fields");
      return;
    }

    const lat = formData.coordinates[0];
    const lng = formData.coordinates[1];
    if (!lat || !lng) {
      alert("Please enter both latitude and longitude");
      return;
    }

    const payload = {
      ...formData,
      coordinates: [parseFloat(lat), parseFloat(lng)],
    };

    try {
      setLoading(true);
      await locationsAPI.createLocation(payload);
      resetForm();
      await fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create location");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    const { name, address, city, state, zipcode } = formData;
    if (!name || !address || !city || !state || !zipcode) {
      alert("Please fill in all required fields");
      return;
    }

    const lat = formData.coordinates[0];
    const lng = formData.coordinates[1];
    if (!lat || !lng) {
      alert("Please enter both latitude and longitude");
      return;
    }

    const payload = {
      ...formData,
      coordinates: [parseFloat(lat), parseFloat(lng)],
    };

    try {
      setLoading(true);
      await locationsAPI.updateLocation(editingLocation._id, payload);
      resetForm();
      await fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (location) => {
    if (!window.confirm(`Delete "${location.name}"?`)) return;
    try {
      setLoading(true);
      await locationsAPI.deleteLocation(location._id);
      await fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete location");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location) => {
    setFormData({
      name: location.name || "",
      shopOrBuildingNumber: location.shopOrBuildingNumber || "",
      address: location.address || "",
      city: location.city || "",
      district: location.district || "",
      zipcode: location.zipcode || "",
      state: location.state || "",
      area: location.area || "",
      country: location.country || "India",
      isProductAddress: location.isProductAddress || false,
      coordinates:
        location.coordinates && location.coordinates.length === 2
          ? [location.coordinates[0].toString(), location.coordinates[1].toString()]
          : ["", ""],
    });
    setEditingLocation(location);
    setShowForm(true);
  };

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.state?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterProduct === "all" ||
      loc.isProductAddress === (filterProduct === "true");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <MapPin className="text-green-600" size={32} />
            Locations
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your business locations
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Locations</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {locations.length}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-green-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Product Addresses</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {locations.filter((l) => l.isProductAddress).length}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm w-full sm:w-64"
              />
            </div>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
            >
              <option value="all">All Locations</option>
              <option value="true">Product Addresses</option>
              <option value="false">Non-Product</option>
            </select>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 shadow-md transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            Add Location
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingLocation ? "Edit Location" : "Add New Location"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form
                onSubmit={editingLocation ? handleUpdate : handleCreate}
                className="p-6 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Location Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Main Shop, Warehouse etc."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Shop/Building No.
                    </label>
                    <input
                      type="text"
                      name="shopOrBuildingNumber"
                      value={formData.shopOrBuildingNumber}
                      onChange={handleInputChange}
                      placeholder="12A"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Area
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="davanagere taluku"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Near Market Road"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Davanagere"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Karnataka"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                      placeholder="577007"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Davanagere"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isProductAddress"
                    checked={formData.isProductAddress}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label className="text-sm text-gray-700">
                    This is a product address
                  </label>
                </div>

                {/* Coordinates */}
                <div className="border border-green-200 rounded-xl p-4 bg-green-50">
                  <h3 className="font-semibold text-green-800 mb-3">
                    Coordinates
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        min="-90"
                        max="90"
                        name="coordinates"
                        value={formData.coordinates[0]}
                        onChange={(e) => handleCoordinateChange(0, e.target.value)}
                        placeholder="75.90"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        min="-180"
                        max="180"
                        value={formData.coordinates[1]}
                        onChange={(e) => handleCoordinateChange(1, e.target.value)}
                        placeholder="22.45"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingLocation
                      ? "Update Location"
                      : "Add Location"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Locations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && locations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
              <p className="text-gray-500">Loading locations...</p>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <MapPin size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No locations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLocations.map((loc) => (
                    <tr
                      key={loc._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {loc.name}
                        </div>
                        {loc.shopOrBuildingNumber && (
                          <div className="text-xs text-gray-500">
                            {loc.shopOrBuildingNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {loc.address}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                        {loc.city}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {loc.state}
                      </td>
                      <td className="px-6 py-4">
                        {loc.isProductAddress ? (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(loc)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(loc)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Locations;
