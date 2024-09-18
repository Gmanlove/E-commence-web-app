import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, fetchUserProfile } from '../services/api';

interface AuthState {
  userInfo: any | null;
  loading: boolean;
  error: string | null;
}

// Get user info from localStorage if available
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')!)
  : null;
  
const initialState: AuthState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
  loading: false,
  error: null,
};

// Login User Action
export const login = createAsyncThunk('auth/login', async ({ email, password }: { email: string; password: string }) => {
  const response = await loginUser(email, password);
  return response; // Ensure the response contains user data and token
});

// Get User Profile Action
export const getUserProfile = createAsyncThunk('auth/getUserProfile', async (token: string) => {
  const response = await fetchUserProfile(token);
  return response; // Ensure the response contains user profile data
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo'); // Clear user info from local storage
      localStorage.removeItem('token'); // Clear token from local storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when starting login
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Set user info to the response data
        localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Save user info to local storage
        localStorage.setItem('token', action.payload.token); // Save token to local storage
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when fetching profile
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Update user profile with fetched data
        localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Update user info in local storage
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user profile';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
