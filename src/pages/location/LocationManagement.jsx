import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, Navigation } from "lucide-react";
import { locationsAPI } from "../../components/api/api";

// Location Form Component
const LocationForm = ({
  location,
  onSave,
  onCancel,
  title = "Add New Location",
}) => {
  const [formData, setFormData] = useState({
    name: location?.name || "",
    shopOrBuildingNumber: location?.shopOrBuildingNumber || "",
    address: location?.address || "",
    city: location?.city || "",
    district: location?.district || "",
    zipcode: location?.zipcode || "",
    state: location?.state || "",
    area: location?.area || "",
    country: location?.country || "India",
    isProductAddress: location?.isProductAddress ?? false,
    coordinates: location?.coordinates || ["", ""],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoordinateChange = (index, value) => {
    const newCoordinates = [...formData.coordinates];
    newCoordinates[index] = value;
    setFormData((prev) => ({
      ...prev,
      coordinates: newCoordinates,
    }));
  };

  const handleSubmit = () => {
    const {
      name,
      shopOrBuildingNumber,
      address,
      city,
      district,
      zipcode,
      state,
      area,
      country,
      isProductAddress,
      coordinates,
    } = formData;

    if (!name || !address || !city || !state || !zipcode) {
      alert(
        "Please fill in all required fields: Name, Address, City, State, and ZIP Code",
      );
      return;
    }

    const lat = coordinates[0];
    const lng = coordinates[1];

    if (!lat || !lng || lat === "" || lng === "") {
      alert("Please enter both latitude & longitude");
      return;
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      alert("Please enter valid numbers for latitude and longitude");
      return;
    }

    if (latNum < -90 || latNum > 90) {
      alert("Latitude must be between -90 and 90");
      return;
    }

    if (lngNum < -180 || lngNum > 180) {
      alert("Longitude must be between -180 and 180");
      return;
    }

    const payload = {
      name,
      shopOrBuildingNumber,
      address,
      city,
      district,
      zipcode,
      state,
      area,
      country,
      isProductAddress,
      coordinates: [latNum, lngNum],
    };

    onSave(payload, location?._id);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            coordinates: [
              position.coords.latitude.toString(),
              position.coords.longitude.toString(),
            ],
          }));
        },
        (error) => {
          alert("Unable to get location: " + error.message);
        },
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Main Shop"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop/Building Number
            </label>
            <input
              type="text"
              name="shopOrBuildingNumber"
              value={formData.shopOrBuildingNumber}
              onChange={handleInputChange}
              placeholder="12A"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Near Market Road"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Davanagere"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              placeholder="Davanagere"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Karnataka"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              placeholder="577007"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="India"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            placeholder="davanagere taluku"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isProductAddress"
            checked={formData.isProductAddress}
            onChange={handleInputChange}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            id="isProductAddress"
          />
          <label htmlFor="isProductAddress" className="text-sm text-gray-700">
            This is a product address
          </label>
        </div>

        {/* Coordinates Section */}
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-green-800">Coordinates</h3>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              <Navigation size={14} />
              Get Current
            </button>
          </div>

          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ℹ️ Format: <code>[latitude, longitude]</code> - Example:{" "}
            <code>[75.90, 22.45]</code>
            <br />
            Valid ranges: Latitude: -90 to 90, Longitude: -180 to 180
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={formData.coordinates[0]}
                onChange={(e) => handleCoordinateChange(0, e.target.value)}
                placeholder="75.90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500">Range: -90 to 90</span>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500">Range: -180 to 180</span>
            </div>
          </div>

          {formData.coordinates[0] && formData.coordinates[1] && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <strong>Preview:</strong>{" "}
              <code>
                [{formData.coordinates[0]}, {formData.coordinates[1]}]
              </code>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            {location ? "Update Location" : "Add Location"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium transition-colors"
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
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 ${column.className || ""}`}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
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

// Main Location Management Component
const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("view");
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const locationsResponse = await locationsAPI.getAllLocations();
      console.log("Locations API Response:", locationsResponse);

      let locationsData =
        locationsResponse?.data?.data?.data ||
        locationsResponse?.data?.data ||
        locationsResponse?.data ||
        [];

      if (!Array.isArray(locationsData)) {
        console.warn("Locations data is not an array:", locationsData);
        locationsData = [];
      }
      console.log("Processed Locations:", locationsData);
      setLocations(locationsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      console.error("Error details:", err.response?.data);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Location Name",
      className: "whitespace-nowrap font-semibold",
      render: (name) => name || "N/A",
    },
    {
      key: "shopOrBuildingNumber",
      header: "Shop/Bldg No.",
      className: "whitespace-nowrap text-gray-700",
      render: (num) => num || "N/A",
    },
    {
      key: "address",
      header: "Address",
      className: "text-gray-700 max-w-xs truncate",
      render: (address) => address || "N/A",
    },
    {
      key: "area",
      header: "Area",
      className: "text-gray-700 max-w-xs truncate",
      render: (area) => area || "N/A",
    },
    {
      key: "city",
      header: "City",
      className: "whitespace-nowrap text-gray-600",
    },
    {
      key: "state",
      header: "State",
      className: "whitespace-nowrap text-gray-600",
    },
    {
      key: "zipcode",
      header: "ZIP",
      className: "whitespace-nowrap text-gray-600",
    },
    {
      key: "country",
      header: "Country",
      className: "whitespace-nowrap text-gray-600",
      render: (country) => country || "India",
    },
    {
      key: "isProductAddress",
      header: "Product Address",
      className: "whitespace-nowrap text-gray-600",
      render: (isProductAddress) =>
        isProductAddress ? (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Yes
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            No
          </span>
        ),
    },
    {
      key: "coordinates",
      header: "Coordinates",
      className: "whitespace-nowrap text-blue-600 text-sm",
      render: (coords) =>
        coords && coords.length === 2
          ? `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`
          : "N/A",
    },
  ];

  const actions = [
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: "text-green-600 hover:text-green-900 hover:bg-green-100",
      title: "Edit Location",
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: "text-red-600 hover:text-red-900 hover:bg-red-100",
      title: "Delete Location",
    },
  ];

  async function handleAdd(formData) {
    try {
      setLoading(true);
      setError(null);

      console.log("Creating location with payload:", formData);
      const response = await locationsAPI.createLocation(formData);
      console.log("Create Location Response:", response.data);

      await fetchAllData();
      setMode("view");
    } catch (err) {
      console.error("Error creating location:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create location",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(location) {
    setEditingLocation(location);
    setMode("edit");
  }

  async function handleUpdate(formData, locationId) {
    try {
      setLoading(true);
      setError(null);

      console.log("Updating location with payload:", formData);
      const response = await locationsAPI.updateLocation(locationId, formData);
      console.log("Update Location Response:", response.data);

      await fetchAllData();
      setMode("view");
      setEditingLocation(null);
    } catch (err) {
      console.error("Error updating location:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update location",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(location) {
    if (
      window.confirm(
        `Are you sure you want to delete "${location.name || "this location"}"?`,
      )
    ) {
      try {
        setLoading(true);
        setError(null);

        await locationsAPI.deleteLocation(location._id);
        console.log("Location deleted successfully");

        await fetchAllData();
      } catch (err) {
        console.error("Error deleting location:", err);
        console.error("Error response:", err.response?.data);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to delete location",
        );
      } finally {
        setLoading(false);
      }
    }
  }

  function handleCancel() {
    setMode("view");
    setEditingLocation(null);
    setError(null);
  }

  const locationsArray = Array.isArray(locations) ? locations : [];
  const coordinateCount = locationsArray.filter(
    (loc) => loc.coordinates && loc.coordinates.length === 2,
  ).length;

  if (loading && (!locations || locations.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <MapPin className="text-green-600" size={36} />
            📍 Rice Deal - Location Management
          </h1>
          <p className="text-gray-600">
            Manage your business locations with coordinates only
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {mode === "add" && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <LocationForm
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Add New Location"
              />
            </div>
          </div>
        )}

        {mode === "edit" && editingLocation && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <LocationForm
                location={editingLocation}
                onSave={handleUpdate}
                onCancel={handleCancel}
                title="Edit Location"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Locations</p>
                <p className="text-2xl font-bold text-gray-800">
                  {locationsArray.length}
                </p>
              </div>
              <MapPin className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Coordinates</p>
                <p className="text-2xl font-bold text-blue-600">
                  {coordinateCount}
                </p>
              </div>
              <span className="text-3xl">🗺️</span>
            </div>
          </div>
        </div>

        {mode === "view" && (
          <div className="mb-6">
            <button
              onClick={() => setMode("add")}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              Add New Location
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Locations ({locationsArray.length})
            </h2>
          </div>
          {loading && locationsArray.length > 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p>Updating...</p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={locationsArray}
              actions={actions}
              emptyMessage="No locations found. Add your first location to get started!"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationManagement;
