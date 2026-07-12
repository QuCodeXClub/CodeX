import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registrationService } from "../services/registrationService";

export const fetchAdminRegistrations = createAsyncThunk(
  "adminRegistrations/fetch",
  async (academicYear, { rejectWithValue }) => {
    try {
      const response = await registrationService.getRegistrations(
        academicYear && academicYear !== 'ALL' ? { academicYear } : {}
      );
      const payload = response.data?.data || response.data || response;
      const records = payload.registrations || (Array.isArray(payload) ? payload : []);
      return records;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().adminRegistrations.loading) return false;
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

export const createManualRegistration = createAsyncThunk(
  "adminRegistrations/createManual",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await registrationService.addManualRegistration(studentData);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add registration');
    }
  }
);

const adminRegistrationsSlice = createSlice({
  name: "adminRegistrations",
  initialState: {
    registrationsByYear: {},
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
        const year = action.meta.arg || 'ALL';
        state.registrationsByYear[year] = action.payload;
      })
      .addCase(fetchAdminRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRegistrationStatus.fulfilled, (state, action) => {
        Object.keys(state.registrationsByYear).forEach(year => {
          const index = state.registrationsByYear[year].findIndex((r) => r._id === action.payload.id);
          if (index !== -1) {
            state.registrationsByYear[year][index].status = action.payload.status;
          }
        });
      })
      .addCase(createManualRegistration.fulfilled, (state, action) => {
        // Find the correct academic year to insert this into, or just re-fetch next time.
        // Easiest is to push to 'ALL' if it exists, and the specific academic year if it exists.
        const reg = action.payload;
        Object.keys(state.registrationsByYear).forEach(year => {
          // We can just unshift it to the top so it appears as NEW
          state.registrationsByYear[year].unshift(reg);
        });
      });
  },
});

export default adminRegistrationsSlice.reducer;
