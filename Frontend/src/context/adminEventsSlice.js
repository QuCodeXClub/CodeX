import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

export const fetchAdminEvents = createAsyncThunk(
  "adminEvents/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/events", { params });
      const payload = response.data?.data || response.data || response;
      return {
        events: payload.events || (Array.isArray(payload) ? payload : []),
        pagination: payload.pagination || null,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createAdminEvent = createAsyncThunk(
  "adminEvents/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateAdminEvent = createAsyncThunk(
  "adminEvents/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteAdminEvent = createAsyncThunk(
  "adminEvents/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/events/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const adminEventsSlice = createSlice({
  name: "adminEvents",
  initialState: {
    events: [],
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
    loading: false,
    error: null,
    isLoaded: false,
  },
  reducers: {
    invalidateEvents: (state) => {
      state.isLoaded = false;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        state.events = action.payload.events;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAdminEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdminEvent.fulfilled, (state) => {
        state.isLoaded = false;
      })
      .addCase(updateAdminEvent.fulfilled, (state, action) => {
        const updated = action.payload?.data?.data || action.payload?.data || action.payload;
        if (updated && updated._id) {
          state.events = state.events.map((e) => (e._id === updated._id ? updated : e));
        }
      })
      .addCase(deleteAdminEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload);
        if (state.pagination.total > 0) {
          state.pagination.total -= 1;
          state.pagination.totalPages = Math.ceil(state.pagination.total / (state.pagination.limit || 12)) || 1;
        }
      });
  },
});

export const { invalidateEvents, setPagination } = adminEventsSlice.actions;
export default adminEventsSlice.reducer;

