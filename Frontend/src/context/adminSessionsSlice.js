import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../services/adminService";

export const fetchAdminSessions = createAsyncThunk(
  "adminSessions/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getSessions();
      return response.data?.data || response.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const killAdminSession = createAsyncThunk(
  "adminSessions/kill",
  async (id, { rejectWithValue }) => {
    try {
      await adminService.killSession(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const adminSessionsSlice = createSlice({
  name: "adminSessions",
  initialState: {
    sessions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchAdminSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(killAdminSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter((s) => s._id !== action.payload);
      });
  },
});

export default adminSessionsSlice.reducer;
