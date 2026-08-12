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
  },
  {
    condition: (_, { getState }) => {
      if (getState().adminSessions.loading) return false;
    },
  }
);

export const killAdminSession = createAsyncThunk(
  "adminSessions/kill",
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminService.killSession(id);
      const updatedSession = response.data?.data || response.data;
      return { id, updatedSession };
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
    isLoaded: false,
  },
  reducers: {
    clearSessions: (state) => {
      state.sessions = [];
      state.isLoaded = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        state.sessions = action.payload;
      })
      .addCase(fetchAdminSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(killAdminSession.fulfilled, (state, action) => {
        const { id, updatedSession } = action.payload;
        const index = state.sessions.findIndex((s) => s._id === id);
        if (index !== -1) {
          if (updatedSession && typeof updatedSession === "object" && updatedSession.status) {
            state.sessions[index] = { ...state.sessions[index], ...updatedSession };
          } else {
            state.sessions[index] = {
              ...state.sessions[index],
              status: "REVOKED",
              loggedOutAt: new Date().toISOString(),
            };
          }
        }
      });
  },
});

export const { clearSessions } = adminSessionsSlice.actions;
export default adminSessionsSlice.reducer;
