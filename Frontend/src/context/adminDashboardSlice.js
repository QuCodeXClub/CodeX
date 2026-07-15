import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

export const fetchDashboardMetrics = createAsyncThunk(
  "adminDashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/dashboard");
      return response.data?.data || response.data || response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().adminDashboard?.loading) return false;
    },
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    metrics: {
      pendingApps: 0,
      activeEvents: 0,
      liveSessions: 0,
      totalApps: 0,
      teamSize: 0,
    },
    recentLogs: [],
    loading: false,
    error: null,
    isLoaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        if (action.payload?.metrics) {
          state.metrics = action.payload.metrics;
        }
        if (action.payload?.recentLogs) {
          state.recentLogs = action.payload.recentLogs;
        }
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminDashboardSlice.reducer;
