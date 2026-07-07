import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

export const fetchAdminFaqs = createAsyncThunk(
  "adminFaqs/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/faqs");
      const payload = response.data?.data || response.data || response;
      return payload.faqs || (Array.isArray(payload) ? payload : []);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createAdminFaq = createAsyncThunk(
  "adminFaqs/create",
  async (faqData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/faqs", faqData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateAdminFaq = createAsyncThunk(
  "adminFaqs/update",
  async ({ id, faqData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/faqs/${id}`, faqData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteAdminFaq = createAsyncThunk(
  "adminFaqs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/faqs/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const adminFaqsSlice = createSlice({
  name: "adminFaqs",
  initialState: {
    faqs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminFaqs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(fetchAdminFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAdminFaq.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter((f) => f._id !== action.payload);
      });
  },
});

export default adminFaqsSlice.reducer;
