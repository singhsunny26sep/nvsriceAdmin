import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../components/api/api';

// Async thunk for email/password login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data.data;
      
      console.log("Login successful, received token and user:", token, user);
      
      // Store both token and user in localStorage
      localStorage.setItem('nvstoken', token);
      localStorage.setItem('nvsuser', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Get initial state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('nvstoken');
  const userStr = localStorage.getItem('nvsuser');
  let user = null;
  
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    localStorage.removeItem('nvsuser');
  }
  
  return {
    user,
    token,
    isAuthenticated: !!(token && user),
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('nvsuser', JSON.stringify(action.payload));
    },
    // Client-side logout - clear state and localStorage
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('nvstoken');
      localStorage.removeItem('nvsuser');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        console.log("Redux state updated:", { token: state.token, user: state.user });
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser, logout } = authSlice.actions;
export default authSlice.reducer;