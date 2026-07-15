import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

export const fetchAdminEvents = createAsyncThunk(
  "adminEvents/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/events");
      const payload = response.data?.data || response.data || response;
      return payload.events || (Array.isArray(payload) ? payload : []);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().adminEvents.loading) return false;
    },
  }
);

export const createAdminEvent = createAsyncThunk(
  "adminEvents/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateAdminEvent = createAsyncThunk(
  "adminEvents/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
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
    loading: false,
    error: null,
    isLoaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        state.events = action.payload;
      })
      .addCase(fetchAdminEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAdminEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload);
      });
  },
});

export default adminEventsSlice.reducer;
