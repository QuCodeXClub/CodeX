import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { teamService } from "../services/teamService";

export const fetchAdminTeam = createAsyncThunk(
  "adminTeam/fetch",
  async (arg, { getState, rejectWithValue }) => {
    try {
      const year = typeof arg === "object" ? arg.year : arg;
      const force = typeof arg === "object" ? arg.force : false;

      const state = getState().adminTeam;
      if (!force && state.cache && state.cache[year]) {
        return state.cache[year];
      }

      const params = year && year !== "ALL" ? { academicYear: year } : {};
      const response = await teamService.getTeamMembers(params);
      const payload = response.data?.data || response.data || response;
      return payload.team || (Array.isArray(payload) ? payload : []);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().adminTeam.loading) return false;
    },
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
    isLoaded: false,
    currentYear: null,
    cache: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        state.members = action.payload;
        const yearArg =
          typeof action.meta.arg === "object"
            ? action.meta.arg.year
            : action.meta.arg;
        state.currentYear = yearArg;
        if (yearArg) {
          state.cache[yearArg] = action.payload;
        }
      })
      .addCase(fetchAdminTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAdminTeamMember.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.members = state.members.filter((m) => m._id !== deletedId);

        Object.keys(state.cache).forEach((year) => {
          state.cache[year] = state.cache[year].filter(
            (m) => m._id !== deletedId
          );
        });
      })
      .addCase(addAdminTeamMember.fulfilled, (state, action) => {
        const newMember = action.payload;
        if (!newMember || !newMember._id) return;

        if (
          state.currentYear === "ALL" ||
          state.currentYear === newMember.academicYear
        ) {
          state.members.push(newMember);
        }

        if (state.cache[newMember.academicYear]) {
          if (
            !state.cache[newMember.academicYear].some(
              (m) => m._id === newMember._id
            )
          ) {
            state.cache[newMember.academicYear].push(newMember);
          }
        }
        if (state.cache["ALL"]) {
          if (!state.cache["ALL"].some((m) => m._id === newMember._id)) {
            state.cache["ALL"].push(newMember);
          }
        }
      })
      .addCase(updateAdminTeamMember.fulfilled, (state, action) => {
        const updatedMember = action.payload;
        if (!updatedMember || !updatedMember._id) return;

        const index = state.members.findIndex(
          (m) => m._id === updatedMember._id
        );
        if (
          state.currentYear === "ALL" ||
          state.currentYear === updatedMember.academicYear
        ) {
          if (index !== -1) {
            state.members[index] = updatedMember;
          } else {
            state.members.push(updatedMember);
          }
        } else {
          if (index !== -1) {
            state.members.splice(index, 1);
          }
        }

        Object.keys(state.cache).forEach((year) => {
          const cacheIndex = state.cache[year].findIndex(
            (m) => m._id === updatedMember._id
          );

          if (year === "ALL" || year === updatedMember.academicYear) {
            if (cacheIndex !== -1) {
              state.cache[year][cacheIndex] = updatedMember;
            } else {
              state.cache[year].push(updatedMember);
            }
          } else {
            if (cacheIndex !== -1) {
              state.cache[year].splice(cacheIndex, 1);
            }
          }
        });
      });
  },
});

export default adminTeamSlice.reducer;
