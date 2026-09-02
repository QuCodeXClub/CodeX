import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registrationService } from "../services/registrationService";

export const fetchAdminRegistrations = createAsyncThunk(
  "adminRegistrations/fetch",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState().adminRegistrations;
      const { page = 1, limit = 100, force = false, ...restFilters } = params;

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

      // If filters are same and we already have this page cached, skip fetching unless force: true
      if (
        !force &&
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
        resetCache: filtersChanged || force,
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

export const fetchLatestRegistrationsOnly = createAsyncThunk(
  "adminRegistrations/fetchLatestOnly",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState().adminRegistrations;
      const { ...restFilters } = params;

      // Find the latest registration createdAt currently stored in Redux
      let newestCreatedAt = null;
      Object.values(state.pages).forEach((pageList) => {
        pageList.forEach((reg) => {
          if (!newestCreatedAt || new Date(reg.createdAt) > new Date(newestCreatedAt)) {
            newestCreatedAt = reg.createdAt;
          }
        });
      });

      const queryParams = { ...restFilters, limit: 100 };
      if (newestCreatedAt) {
        queryParams.since = newestCreatedAt;
      }
      for (const key in queryParams) {
        if (queryParams[key] === "ALL" || queryParams[key] === "") {
          delete queryParams[key];
        }
      }

      const response = await registrationService.getRegistrations(queryParams);
      const payload = response.data?.data || response.data || response;
      const newItems = payload.registrations || (Array.isArray(payload) ? payload : []);

      return {
        newItems,
        total: payload.total !== undefined ? payload.total : state.total + newItems.length,
        hasSince: Boolean(newestCreatedAt),
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to check for new registrations"
      );
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
  async ({ id, status, rejectionReason, reason }, { rejectWithValue }) => {
    try {
      const finalReason = rejectionReason || reason || "";
      await registrationService.updateRegistrationStatus(id, status, finalReason);
      return { id, status, rejectionReason: finalReason };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const updateAdminRegistrationDetails = createAsyncThunk(
  "adminRegistrations/updateDetails",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await registrationService.updateRegistrationDetails(id, data);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update registration details"
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
      .addCase(fetchLatestRegistrationsOnly.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestRegistrationsOnly.fulfilled, (state, action) => {
        state.loading = false;
        const { newItems, total, hasSince } = action.payload;
        state.total = total;
        state.totalPages = Math.max(1, Math.ceil(total / 100));

        if (newItems.length > 0) {
          if (!hasSince || !state.pages[1]) {
            state.pages[1] = newItems;
          } else {
            const existingPage1 = state.pages[1] || [];
            const existingIds = new Set(existingPage1.map((r) => r._id));
            const uniqueNew = newItems.filter((r) => !existingIds.has(r._id));
            if (uniqueNew.length > 0) {
              state.pages[1] = [...uniqueNew, ...existingPage1];
            }
          }
        }
      })
      .addCase(fetchLatestRegistrationsOnly.rejected, (state, action) => {
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
      .addCase(updateAdminRegistrationDetails.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated && updated._id) {
          Object.keys(state.pages).forEach((pageNum) => {
            const index = state.pages[pageNum].findIndex((r) => r._id === updated._id);
            if (index !== -1) {
              state.pages[pageNum][index] = { ...state.pages[pageNum][index], ...updated };
            }
          });
        }
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
