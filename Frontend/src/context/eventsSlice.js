import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { eventService } from "../services/eventService";

export const fetchPublicEvents = createAsyncThunk(
  "events/fetchPublicEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvents();
      return response.data || [];
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
    events: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicEvents.pending, (state) => {
        if (!state.hasFetched) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchPublicEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchPublicEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasFetched = true;
      });
  },
});

export default eventsSlice.reducer;
