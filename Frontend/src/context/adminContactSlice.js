import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

export const fetchAdminContacts = createAsyncThunk(
  "adminContact/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/contact");
      return response.data?.data || response.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().adminContact.loading) return false;
    },
  }
);

export const markMessageAsRead = createAsyncThunk(
  "adminContact/markRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/contact/${id}/read`);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteContactMessage = createAsyncThunk(
  "adminContact/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/contact/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const adminContactSlice = createSlice({
  name: "adminContact",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    isLoaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        state.messages = action.payload;
      })
      .addCase(fetchAdminContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          (m) => m._id === action.payload._id
        );
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(deleteContactMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m._id !== action.payload);
      });
  },
});

export default adminContactSlice.reducer;
