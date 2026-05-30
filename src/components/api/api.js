import axios from 'axios';

// Base API URL - replace with your actual API endpoint
// const BASE_URL =  'https://api.fixsetadmin.com/v1';
// const BASE_URL =  'http://localhost:5000/';
const BASE_URL =  'https://api.nvsricemart.com/nvs-rice-mart/';

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nvstoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints - FIXED AND UNCOMMENTED
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  getProfile: () => api.get('/auth/profile'),
};

// Categories API endpoints
export const categoriesAPI = {
  getCategories: (params) => api.get('/categories/getAll', { params }),
  getCategoryById: (id) => api.get(`/categories/get/${id}`),
  createCategory: (categoryData) => api.post('/categories/create', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/update/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/delete/${id}`),
};

// Subcategories API endpoints
export const subcategoriesAPI = {
  getSubcategories: (params) => api.get('/subCategories/getAll', { params }),
  
  getSubcategoryById: (id) => api.get(`/subCategories/get/${id}`),
  
  // FIXED: Now uses axios instance with proper BASE_URL
  createSubcategory: (categoryId, formData) => {
    return api.post(`/subCategories/${categoryId}/create`, formData);
  },
  
  updateSubcategory: (id, formData) => {
    return api.put(`/subCategories/update/${id}`, formData);
  },
  
  deleteSubcategory: (id) => api.delete(`/subCategories/delete/${id}`),
};


// Product api 
// Products API endpoints
export const productsAPI = {
  getProducts: (params) => api.get('/products/getAll', { params }),
  getProductById: (id) => api.get(`/products/get/${id}`),
  createProduct: (productData) => api.post('/products/create', productData),
  updateProduct: (id, productData) => api.put(`/products/update/${id}`, productData),
  updateProductLocations: (id, locationData) => api.put(`/products/update-product-locations/${id}`, locationData, {
    headers: { 'Content-Type': 'application/json' }
  }),
  deleteProduct: (id) => api.delete(`/products/delete/${id}`),
};

// Users API endpoints
export const usersAPI = {
  getUsers: (params) => api.get('/users/get', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats'),
};

// Orders API endpoints
export const ordersAPI = {
  getOrders: (params) => api.get('/orders/getAll', { params }),
  getOrderById: (id) => api.get(`/orders/get/${id}`),
  updateOrder: (id, data) => api.put(`/orders/update/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/delete/${id}`),
};

// Dashboard API endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getChartData: (type, period) => api.get(`/dashboard/charts/${type}`, { params: { period } }),
  getRecentActivity: () => api.get('/dashboard/activity'),
  getSystemHealth: () => api.get('/dashboard/system-health'),
};

// Admin API endpoints
export const adminAPI = {
  getZones: () => api.get('/admin/zones'),
  createZone: (zoneData) => api.post('/admin/zones', zoneData),
  updateZone: (id, zoneData) => api.put(`/admin/zones/${id}`, zoneData),
  deleteZone: (id) => api.delete(`/admin/zones/${id}`),
  getAdmins: () => api.get('/admin/administrators'),
  createAdmin: (adminData) => api.post('/admin/administrators', adminData),
  updateAdmin: (id, adminData) => api.put(`/admin/administrators/${id}`, adminData),
  deleteAdmin: (id) => api.delete(`/admin/administrators/${id}`),
};

// Reports API endpoints
export const reportsAPI = {
  getUserReport: (params) => api.get('/reports/users', { params }),
  getActivityReport: (params) => api.get('/reports/activity', { params }),
  getSystemReport: (params) => api.get('/reports/system', { params }),
  exportReport: (type, params) => api.get(`/reports/export/${type}`, { 
    params, 
    responseType: 'blob' 
  }),
};

// Notifications API endpoints
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Settings API endpoints
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.put('/settings', settings),
  getSystemConfig: () => api.get('/settings/system'),
  updateSystemConfig: (config) => api.put('/settings/system', config),
};

// Support API endpoints
export const supportAPI = {
  getTickets: (params) => api.get('/support/tickets', { params }),
  getTicketById: (id) => api.get(`/support/tickets/${id}`),
  createTicket: (ticketData) => api.post('/support/tickets', ticketData),
  updateTicket: (id, ticketData) => api.put(`/support/tickets/${id}`, ticketData),
  closeTicket: (id) => api.put(`/support/tickets/${id}/close`),
  addComment: (ticketId, comment) => api.post(`/support/tickets/${ticketId}/comments`, { comment }),
};

// File upload API
export const fileAPI = {
  uploadSingle: (file, folder = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post('/files/upload', formData);
  },
  uploadMultiple: (files, folder = 'uploads') => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folder', folder);
    return api.post('/files/upload-multiple', formData);
  },
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),
};

// banner
export const bannersAPI = {
  getBanners: (params) => api.get('/banners/getAll', { params }),
  
  getBannerById: (id) => api.get(`/banners/get/${id}`),
  
  createBanner: (formData) => {
    return api.post('/banners/create', formData);
  },
  
  updateBanner: (id, formData) => {
    return api.put(`/banners/update/${id}`, formData);
  },
  
  deleteBanner: (id) => api.delete(`/banners/delete/${id}`)
};


// locations/create
export const locationsAPI = {
  createLocation: (locationData) => api.post('/locations/create', locationData,
     { 
      headers: {
        'Content-Type': 'application/json', // ✅ IMPORTANT: Must be JSON
      }
    }
  ),
  getAllLocations: () => api.get('/locations/getAll'),
  getLocationById: (id) => api.get(`/locations/${id}`),
  updateLocation: (id, locationData) => api.put(`/locations/${id}`, locationData,
     { 
      headers: {
        'Content-Type': 'application/json', // ✅ IMPORTANT: Must be JSON
      }
    }
  ),
  deleteLocation: (id) => api.delete(`/locations/delete/${id}`),
};



export default api;