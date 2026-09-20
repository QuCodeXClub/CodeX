import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registrationService } from "../services/registrationService";

export const fetchRegistrationStatus = createAsyncThunk(
  "registration/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await registrationService.getRegistrationStatus();
      const payload = res.data?.data || res.data || res;
      return {
        isRegistrationOpen: payload.isRegistrationOpen ?? true,
        closedMessage:
          payload.closedMessage ||
          "The CodeX membership registration portal is currently closed. New student submissions are not being accepted at this time.",
        openedAt: payload.openedAt || null,
        closedAt: payload.closedAt || null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch registration status"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { registration } = getState();
      if (registration?.loading) {
        return false;
      }
    },
  }
);

const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    isOpen: true,
    closedMessage:
      "The CodeX membership registration portal is currently closed. New student submissions are not being accepted at this time.",
    openedAt: null,
    closedAt: null,
    loading: false,
    loaded: false,
    error: null,
  },
  reducers: {
    setRegistrationStatus: (state, action) => {
      if (typeof action.payload.isOpen === "boolean") {
        state.isOpen = action.payload.isOpen;
      }
      if (action.payload.closedMessage) {
        state.closedMessage = action.payload.closedMessage;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegistrationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.isOpen = action.payload.isRegistrationOpen;
        if (action.payload.closedMessage) {
          state.closedMessage = action.payload.closedMessage;
        }
        state.openedAt = action.payload.openedAt;
        state.closedAt = action.payload.closedAt;
      })
      .addCase(fetchRegistrationStatus.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = action.payload;
      })
      // If admin updates system status while in app, keep public state synced immediately
      .addCase("adminRegistrations/updateSystemStatus/fulfilled", (state, action) => {
        const payload = action.payload?.data || action.payload;
        if (payload && typeof payload.isRegistrationOpen === "boolean") {
          state.isOpen = payload.isRegistrationOpen;
          if (payload.closedMessage) {
            state.closedMessage = payload.closedMessage;
          }
        }
      });
  },
});

export const { setRegistrationStatus } = registrationSlice.actions;
export default registrationSlice.reducer;
