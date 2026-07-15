import { createSlice } from "@reduxjs/toolkit";

const initialUser = null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    isAuthResolved: false,
  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload;
      state.isAuthResolved = true;
      localStorage.setItem("codex_admin_auth", "true");
    },
    setAuthResolved: (state, action) => {
      state.isAuthResolved = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
      state.isAuthResolved = true;
      localStorage.removeItem("codex_admin_auth");
    },
  },
});

export const { setLogin, setLogout, setAuthResolved } = authSlice.actions;

export default authSlice.reducer;
