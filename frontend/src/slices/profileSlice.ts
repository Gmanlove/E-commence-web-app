import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile, updateUserProfile } from '../services/api';

interface ProfileState {
    userInfo: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    userInfo: null,
    loading: false,
    error: null,
};

// Fetch profile action
export const getProfile = createAsyncThunk('profile/getProfile', async (token: string, { rejectWithValue }) => {
    try {
        return await fetchUserProfile(token);
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
});

// Update profile action
export const updateProfile = createAsyncThunk('profile/updateProfile', async ({ token, profileData }: { token: string, profileData: any }, { rejectWithValue }) => {
    try {
        return await updateUserProfile(token, profileData);
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
});

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default profileSlice.reducer;
