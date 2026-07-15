import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registrationService } from "../services/registrationService";

export const fetchAdminRegistrations = createAsyncThunk(
  "adminRegistrations/fetch",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState().adminRegistrations;
      const { page = 1, limit = 100, ...restFilters } = params;

      const queryParams = { page, limit, ...restFilters };
      for (const key in queryParams) {
        if (queryParams[key] === "ALL" || queryParams[key] === "") {
          delete queryParams[key];
        }
      }

      // Check if filters changed (excluding page/limit)
      const currentFiltersStr = JSON.stringify(state.filters);
      const newFiltersStr = JSON.stringify(restFilters);
      const filtersChanged = currentFiltersStr !== newFiltersStr;

      if (filtersChanged) {
        queryParams.page = 1;
      }

      // If filters are same and we already have this page cached, we can skip fetching
      if (
        !filtersChanged &&
        state.pages[page] &&
        state.pages[page].length > 0
      ) {
        return { fromCache: true, page };
      }

      const response = await registrationService.getRegistrations(queryParams);
      const payload = response.data?.data || response.data || response;

      return {
        fromCache: false,
        resetCache: filtersChanged,
        newFilters: restFilters,
        data: payload.registrations || (Array.isArray(payload) ? payload : []),
        page: payload.page || page,
        total: payload.total || 0,
        totalPages: payload.totalPages || 1,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().adminRegistrations.loading) return false;
    },
  }
);

export const updateRegistrationStatus = createAsyncThunk(
  "adminRegistrations/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await registrationService.updateRegistrationStatus(id, status);
      return { id, status };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const createManualRegistration = createAsyncThunk(
  "adminRegistrations/createManual",
  async (data, { rejectWithValue }) => {
    try {
      const response = await registrationService.addManualRegistration(data);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create registration"
      );
    }
  }
);

export const createBulkRegistration = createAsyncThunk(
  "adminRegistrations/createBulk",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await registrationService.addBulkRegistration(formData);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to upload CSV"
      );
    }
  }
);

const adminRegistrationsSlice = createSlice({
  name: "adminRegistrations",
  initialState: {
    pages: {},
    filters: {},
    currentPage: 1,
    total: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCache: (state) => {
      state.pages = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminRegistrations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminRegistrations.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        if (payload.fromCache) {
          state.currentPage = payload.page;
          return;
        }

        if (payload.resetCache) {
          state.pages = {};
          state.filters = payload.newFilters;
        }

        state.pages[payload.page] = payload.data;
        state.total = payload.total;
        state.totalPages = payload.totalPages;
        state.currentPage = payload.page;
      })
      .addCase(fetchAdminRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRegistrationStatus.fulfilled, (state, action) => {
        // Update the status in whichever page it exists
        Object.keys(state.pages).forEach((pageNum) => {
          const index = state.pages[pageNum].findIndex(
            (r) => r._id === action.payload.id
          );
          if (index !== -1) {
            state.pages[pageNum][index].status = action.payload.status;
          }
        });
      })
      .addCase(createManualRegistration.fulfilled, (state, action) => {
        // Unshift to page 1 to make it visible immediately
        if (state.pages[1]) {
          state.pages[1].unshift(action.payload);
        } else {
          state.pages[1] = [action.payload];
        }
        state.total += 1;
      });
  },
});

export const { setCurrentPage, clearCache } = adminRegistrationsSlice.actions;
export default adminRegistrationsSlice.reducer;
