import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { teamService } from "../services/teamService";

export const fetchAdminTeam = createAsyncThunk(
  "adminTeam/fetch",
  async (year, { rejectWithValue }) => {
    try {
      const params = year && year !== "ALL" ? { academicYear: year } : {};
      const response = await teamService.getTeamMembers(params);
      const payload = response.data?.data || response.data || response;
      return payload.team || (Array.isArray(payload) ? payload : []);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addAdminTeamMember = createAsyncThunk(
  "adminTeam/add",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await teamService.addTeamMember(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateAdminTeamMember = createAsyncThunk(
  "adminTeam/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await teamService.updateTeamMember(id, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteAdminTeamMember = createAsyncThunk(
  "adminTeam/delete",
  async (id, { rejectWithValue }) => {
    try {
      await teamService.deleteTeamMember(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const adminTeamSlice = createSlice({
  name: "adminTeam",
  initialState: {
    members: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchAdminTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAdminTeamMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m._id !== action.payload);
      });
  },
});

export default adminTeamSlice.reducer;
