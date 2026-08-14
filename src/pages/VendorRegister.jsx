import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, UserPlus, Phone, User, ShieldCheck, List, ArrowLeft, UserPlus as RegisterIcon } from "lucide-react";
import { register, clearError } from "../redux/slices/authSlice";
import { usersAPI } from "../components/api/api";

const VendorRegister = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "vendor"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);

  const fetchVendors = async () => {
    try {
      setVendorsLoading(true);
      const response = await usersAPI.getUsers({ role: "vendor", limit: 100 });
      let data = [];
      if (response.data.success) {
        data = response.data.data?.data || response.data.data || [];
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      setVendors(data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setVendorsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setRegisterSuccess("");

    const payload = {
      name: formData.name,
      email: formData.email || undefined,
      mobile: formData.mobile || undefined,
      password: formData.password,
      role: "vendor",
      fcmToken: "dkcdkmdedmeidcwd"
    };

    const result = await dispatch(register(payload));

    if (register.fulfilled.match(result)) {
      setRegisterSuccess("Vendor registered successfully!");
      setFormData({ name: "", email: "", mobile: "", password: "", role: "vendor" });
      fetchVendors();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-green-700 via-green-600 to-green-500">
      <div className="w-full max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-green-400 rounded-xl flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-white">Vendor Registration</h2>
          <p className="mt-2 text-base sm:text-lg text-green-100">
            Manage vendors and create new accounts
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {error && (
            <div className="mx-6 mt-6 flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {registerSuccess && (
            <div className="mx-6 mt-6 flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
              <ShieldCheck className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">{registerSuccess}</p>
            </div>
          )}

          {showForm ? (
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <RegisterIcon size={20} className="text-green-600" />
                  Register New Vendor
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setRegisterSuccess("");
                    setFormData({ name: "", email: "", mobile: "", password: "", role: "vendor" });
                  }}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <ArrowLeft size={16} />
                  Back to List
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 hover:border-green-400"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                      <span className="text-gray-400 font-normal ml-1">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 hover:border-green-400"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                      Mobile Number
                      <span className="text-gray-400 font-normal ml-1">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 hover:border-green-400"
                        placeholder="Enter mobile number"
                        value={formData.mobile}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength="6"
                        className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 hover:border-green-400"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">Password must be at least 6 characters</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.name || !formData.password}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Register Vendor</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <List size={20} className="text-green-600" />
                  Registered Vendors
                </h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 shadow-md transition-colors text-sm font-medium"
                >
                  <RegisterIcon size={18} />
                  Register Vendor
                </button>
              </div>

              {vendorsLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                  <p className="text-gray-500">Loading vendors...</p>
                </div>
              ) : vendors.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <List size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No vendors registered yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Mobile</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {vendors.map((vendor) => (
                        <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{vendor.name || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{vendor.email || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{vendor.mobile || "N/A"}</td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-600">
                By continuing, you agree to our{" "}
                <span className="text-green-600 font-medium cursor-pointer hover:underline">Terms of Service</span>
                {" "}and{" "}
                <span className="text-green-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;
