import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// `api` instance already has baseURL '/api' so use relative '/bids'
const API_URL = '/bids';

export const createBid = createAsyncThunk(
  'bids/createBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, bidData, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bid');
    }
  }
);

export const getBidsForGig = createAsyncThunk(
  'bids/getBidsForGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/gig/${gigId}`, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
    }
  }
);

export const getUserBids = createAsyncThunk(
  'bids/getUserBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/user/my-bids`, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user bids');
    }
  }
);

export const hireBid = createAsyncThunk(
  'bids/hireBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/${bidId}/hire`, {}, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire bid');
    }
  }
);

export const rejectBid = createAsyncThunk(
  'bids/rejectBid',
  async ({ bidId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/${bidId}/reject`, { reason }, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject bid');
    }
  }
);

const initialState = {
  bids: [],
  gigBids: [],
  loading: false,
  error: null,
};

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.loading = false;
        state.bids.push(action.payload);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBidsForGig.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBidsForGig.fulfilled, (state, action) => {
        state.loading = false;
        state.gigBids = action.payload;
      })
      .addCase(getUserBids.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserBids.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        // Server returns { gig, hiredBid } for hire; support both shapes
        const payloadBid = action.payload && action.payload.hiredBid ? action.payload.hiredBid : action.payload;
        const index = state.gigBids.findIndex(b => b._id === payloadBid._id);
        if (index >= 0) {
          state.gigBids[index] = payloadBid;
        }
      })
      .addCase(rejectBid.fulfilled, (state, action) => {
        const index = state.gigBids.findIndex(b => b._id === action.payload._id);
        if (index >= 0) {
          state.gigBids[index] = action.payload;
        }
      });
  },
});

export default bidsSlice.reducer;
