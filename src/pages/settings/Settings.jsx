import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import { settingsAPI } from '../../components/api/api';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    delivery: {
      baseCharge: 30,
      perKmRate: 5,
      perKgRate: 1.5,
      minDeliveryCharge: 40,
      baseMaxCharge: 150,
      maxPerKgIncrement: 1.2,
      maxPerKmIncrement: 4,
      maxRadiusKm: 50,
      distanceFactor: 4,
      weightFactor: 6
    }
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getSettings();
      const settingsData = response?.data?.data?.data || response?.data?.data || response?.data;
      
      if (settingsData && settingsData.delivery) {
        setSettings(settingsData);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await settingsAPI.createSettings(settings);
      console.log('Settings saved:', response.data);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings');
    } finally {
      setSaveLoading(false);
    }
  };

  const deliveryFields = [
    { key: 'baseCharge', label: 'Base Charge', description: 'Starting delivery charge' },
    { key: 'perKmRate', label: 'Per Km Rate', description: 'Charge per kilometer' },
    { key: 'perKgRate', label: 'Per Kg Rate', description: 'Charge per kg weight' },
    { key: 'minDeliveryCharge', label: 'Min Delivery Charge', description: 'Minimum delivery charge' },
    { key: 'baseMaxCharge', label: 'Base Max Charge', description: 'Maximum base charge cap' },
    { key: 'maxPerKgIncrement', label: 'Max Per Kg Increment', description: 'Max increment per kg' },
    { key: 'maxPerKmIncrement', label: 'Max Per Km Increment', description: 'Max increment per km' },
    { key: 'maxRadiusKm', label: 'Max Radius (Km)', description: 'Maximum delivery radius in km' },
    { key: 'distanceFactor', label: 'Distance Factor', description: 'Distance calculation factor' },
    { key: 'weightFactor', label: 'Weight Factor', description: 'Weight calculation factor' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <SettingsIcon className="text-green-600" size={36} />
          Delivery Settings
        </h1>
        <p className="text-gray-600">
          Configure delivery charges and parameters for your rice mart
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryFields.map(({ key, label, description }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.delivery[key]}
                onChange={(e) => handleInputChange('delivery', key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={description}
              />
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={saveLoading || loading}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
        >
          {saveLoading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {saveLoading ? 'Saving...' : 'Save Settings'}
        </button>
        <button
          onClick={fetchSettings}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p>Loading settings...</p>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;