import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { teamService } from "../services/teamService";

export const fetchPublicTeam = createAsyncThunk(
  "team/fetchPublicTeam",
  async (academicYear, { rejectWithValue }) => {
    try {
      const response = await teamService.getTeamMembers(
        academicYear ? { academicYear } : {}
      );
      return {
        academicYear,
        data: response.data?.data || response.data || [],
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch team"
      );
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState: {
    membersByYear: {}, // { '2023-2024': [...] }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicTeam.fulfilled, (state, action) => {
        state.loading = false;
        const { academicYear, data } = action.payload;
        if (academicYear) {
          state.membersByYear[academicYear] = data;
        }
      })
      .addCase(fetchPublicTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teamSlice.reducer;
