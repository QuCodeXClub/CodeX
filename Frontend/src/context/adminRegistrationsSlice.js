import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registrationService } from "../services/registrationService";

export const fetchAdminRegistrations = createAsyncThunk(
  "adminRegistrations/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await registrationService.getRegistrations();
      const payload = response.data?.data || response.data || response;
      const records = payload.registrations || (Array.isArray(payload) ? payload : []);
      return records;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateRegistrationStatus = createAsyncThunk(
  "adminRegistrations/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await registrationService.updateRegistrationStatus(id, status);
      return { id, status };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const adminRegistrationsSlice = createSlice({
  name: "adminRegistrations",
  initialState: {
    registrations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminRegistrations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminRegistrations.fulfilled, (state, action) => {
        state.loading = false;
        state.registrations = action.payload;
      })
      .addCase(fetchAdminRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRegistrationStatus.fulfilled, (state, action) => {
        const index = state.registrations.findIndex((r) => r._id === action.payload.id);
        if (index !== -1) {
          state.registrations[index].status = action.payload.status;
        }
      });
  },
});

export default adminRegistrationsSlice.reducer;
