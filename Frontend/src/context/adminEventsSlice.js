import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

export const fetchAdminEvents = createAsyncThunk(
  "adminEvents/fetch",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState().adminEvents;
      const {
        page = state.currentPage || 1,
        limit = state.limit || 12,
        force = false,
        ...restFilters
      } = params;

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

      if (
        !force &&
        !filtersChanged &&
        state.pages[page] &&
        state.pages[page].length > 0
      ) {
        return { fromCache: true, page };
      }

      const response = await axiosInstance.get("/events", { params: queryParams });
      const payload = response.data?.data || response.data || response;
      return {
        fromCache: false,
        resetCache: filtersChanged || force,
        newFilters: restFilters,
        events: payload.events || (Array.isArray(payload) ? payload : []),
        page: payload.pagination?.page || page,
        limit: payload.pagination?.limit || limit,
        total: payload.pagination?.total || 0,
        totalPages: payload.pagination?.totalPages || 1,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch events"
      );
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
      return response.data?.data || response.data || response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to create event"
      );
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
      return response.data?.data || response.data || response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to update event"
      );
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
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete event"
      );
    }
  }
);

const adminEventsSlice = createSlice({
  name: "adminEvents",
  initialState: {
    pages: {},
    filters: {},
    currentPage: 1,
    filterType: "ALL",
    searchQuery: "",
    debouncedSearch: "",
    limit: 12,
    total: 0,
    totalPages: 1,
    loading: false,
    error: null,
    isLoaded: false,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
      state.currentPage = 1;
      state.pages = {};
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setDebouncedSearch: (state, action) => {
      state.debouncedSearch = action.payload;
      state.currentPage = 1;
      state.pages = {};
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.currentPage = 1;
      state.pages = {};
    },
    clearFilters: (state) => {
      state.filterType = "ALL";
      state.searchQuery = "";
      state.debouncedSearch = "";
      state.currentPage = 1;
      state.pages = {};
    },
    invalidateEvents: (state) => {
      state.pages = {};
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        const payload = action.payload;

        if (payload.fromCache) {
          state.currentPage = payload.page;
          return;
        }

        if (payload.resetCache) {
          state.pages = {};
          state.filters = payload.newFilters;
        }

        state.pages[payload.page] = payload.events;
        state.total = payload.total;
        state.totalPages = payload.totalPages;
        state.currentPage = payload.page;
        state.limit = payload.limit;
      })
      .addCase(fetchAdminEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdminEvent.fulfilled, (state) => {
        state.pages = {};
        state.isLoaded = false;
      })
      .addCase(updateAdminEvent.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated && updated._id) {
          Object.keys(state.pages).forEach((pageNum) => {
            state.pages[pageNum] = state.pages[pageNum].map((e) =>
              e._id === updated._id ? { ...e, ...updated } : e
            );
          });
        }
      })
      .addCase(deleteAdminEvent.fulfilled, (state, action) => {
        const deletedId = action.payload;
        Object.keys(state.pages).forEach((pageNum) => {
          state.pages[pageNum] = state.pages[pageNum].filter(
            (e) => e._id !== deletedId
          );
        });
        if (state.total > 0) {
          state.total -= 1;
          state.totalPages = Math.ceil(state.total / (state.limit || 12)) || 1;
        }
      });
  },
});

export const {
  setCurrentPage,
  setFilterType,
  setSearchQuery,
  setDebouncedSearch,
  setLimit,
  clearFilters,
  invalidateEvents,
} = adminEventsSlice.actions;

export default adminEventsSlice.reducer;

