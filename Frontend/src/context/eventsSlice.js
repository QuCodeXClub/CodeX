import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { eventService } from "../services/eventService";

export const fetchAllEvents = createAsyncThunk(
  "events/fetchAllEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = { limit: 6, page: 1, ...params };
      delete queryParams.type;
      const response = await eventService.getEvents(queryParams);
      const payload = response.data?.data || response.data || response;
      return {
        events: payload.events || (Array.isArray(payload) ? payload : []),
        pagination: payload.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch all events"
      );
    }
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  "events/fetchUpcomingEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = { type: "upcoming", limit: 6, page: 1, ...params };
      const response = await eventService.getEvents(queryParams);
      const payload = response.data?.data || response.data || response;
      return {
        events: payload.events || (Array.isArray(payload) ? payload : []),
        pagination: payload.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch upcoming events"
      );
    }
  }
);

export const fetchPastEvents = createAsyncThunk(
  "events/fetchPastEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = { type: "past", limit: 6, page: 1, ...params };
      const response = await eventService.getEvents(queryParams);
      const payload = response.data?.data || response.data || response;
      return {
        events: payload.events || (Array.isArray(payload) ? payload : []),
        pagination: payload.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch past events"
      );
    }
  }
);

// Backward-compatibility wrapper for fetching all events
export const fetchPublicEvents = createAsyncThunk(
  "events/fetchPublicEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvents(params);
      const payload = response.data?.data || response.data || response;
      return payload.events || (Array.isArray(payload) ? payload : []);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch events"
      );
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    all: {
      events: [],
      pagination: { page: 1, limit: 6, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      loading: false,
      isLoaded: false,
      error: null,
    },
    upcoming: {
      events: [],
      pagination: { page: 1, limit: 6, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      loading: false,
      isLoaded: false,
      error: null,
    },
    past: {
      events: [],
      pagination: { page: 1, limit: 6, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      loading: false,
      isLoaded: false,
      error: null,
    },
    // Fallback array for any components reading state.events directly
    events: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // All Events
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.all.loading = true;
        state.all.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.all.loading = false;
        state.all.isLoaded = true;
        state.all.events = action.payload.events;
        if (action.payload.pagination) {
          state.all.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.all.loading = false;
        state.all.isLoaded = true;
        state.all.error = action.payload;
      });

    // Upcoming
    builder
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.upcoming.loading = true;
        state.upcoming.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.upcoming.loading = false;
        state.upcoming.isLoaded = true;
        state.upcoming.events = action.payload.events;
        if (action.payload.pagination) {
          state.upcoming.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.upcoming.loading = false;
        state.upcoming.isLoaded = true;
        state.upcoming.error = action.payload;
      });

    // Past
    builder
      .addCase(fetchPastEvents.pending, (state) => {
        state.past.loading = true;
        state.past.error = null;
      })
      .addCase(fetchPastEvents.fulfilled, (state, action) => {
        state.past.loading = false;
        state.past.isLoaded = true;
        state.past.events = action.payload.events;
        if (action.payload.pagination) {
          state.past.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchPastEvents.rejected, (state, action) => {
        state.past.loading = false;
        state.past.isLoaded = true;
        state.past.error = action.payload;
      });

    // Fallback general fetch
    builder
      .addCase(fetchPublicEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchPublicEvents.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default eventsSlice.reducer;
