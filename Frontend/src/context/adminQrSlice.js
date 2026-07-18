import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { qrService } from "../services/qrService";

export const fetchQRHistory = createAsyncThunk(
  "adminQr/fetchQRHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await qrService.getQRHistory();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to fetch QR history");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const generateCustomQR = createAsyncThunk(
  "adminQr/generateCustomQR",
  async (link, { rejectWithValue, dispatch }) => {
    try {
      const response = await qrService.generateCustomQR(link);
      if (response.success) {
        // Refresh history after generating a new one
        dispatch(fetchQRHistory());
        return response.data.qrUrl;
      }
      return rejectWithValue(response.message || "Failed to generate QR Code");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const deleteCustomQR = createAsyncThunk(
  "adminQr/deleteCustomQR",
  async (id, { rejectWithValue }) => {
    try {
      const response = await qrService.deleteCustomQR(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || "Failed to delete QR Code");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "An error occurred"
      );
    }
  }
);

const adminQrSlice = createSlice({
  name: "adminQr",
  initialState: {
    history: [],
    loading: false,
    generating: false,
    error: null,
    generatedQrUrl: null,
  },
  reducers: {
    clearGeneratedQr(state) {
      state.generatedQrUrl = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch History
      .addCase(fetchQRHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQRHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
        state.error = null;
      })
      .addCase(fetchQRHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate QR
      .addCase(generateCustomQR.pending, (state) => {
        state.generating = true;
        state.error = null;
      })
      .addCase(generateCustomQR.fulfilled, (state, action) => {
        state.generating = false;
        state.generatedQrUrl = action.payload;
      })
      .addCase(generateCustomQR.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      })
      // Delete QR
      .addCase(deleteCustomQR.fulfilled, (state, action) => {
        state.history = state.history.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export const { clearGeneratedQr, clearError } = adminQrSlice.actions;
export default adminQrSlice.reducer;
