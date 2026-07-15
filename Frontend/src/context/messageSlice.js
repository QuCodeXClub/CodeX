import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  type: "error", // optional (error, success, warning)
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.message = action.payload;
      state.type = "error";
    },
    setSuccess: (state, action) => {
      state.message = action.payload;
      state.type = "success";
    },
    setWarning: (state, action) => {
      state.message = action.payload;
      state.type = "warning";
    },
    clearError: (state) => {
      state.message = null;
    },
  },
});

export const { setError, setSuccess, setWarning, clearError } =
  messageSlice.actions;
export default messageSlice.reducer;
