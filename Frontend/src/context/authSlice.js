import { createSlice } from "@reduxjs/toolkit";

const getStoredToken = () => {
  try {
    return localStorage.getItem("codex_access_token") || null;
  } catch {
    return null;
  }
};

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem("codex_admin_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthResolved: false,
  },
  reducers: {
    setLogin: (state, action) => {
      const payload = action.payload;
      // Normalizes both { admin: {...}, token } and raw admin objects
      const adminData = payload?.admin ? payload.admin : payload;
      state.user = adminData;

      if (payload?.token) {
        state.token = payload.token;
        try {
          localStorage.setItem("codex_access_token", payload.token);
        } catch (e) {
          console.warn("Unable to store access token in localStorage", e);
        }
      }

      state.isAuthResolved = true;

      try {
        localStorage.setItem("codex_admin_auth", "true");
        if (adminData) {
          localStorage.setItem("codex_admin_user", JSON.stringify(adminData));
        }
      } catch (e) {
        console.warn("Unable to store user profile in localStorage", e);
      }
    },
    setAuthResolved: (state, action) => {
      state.isAuthResolved = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthResolved = true;

      try {
        localStorage.removeItem("codex_admin_auth");
        localStorage.removeItem("codex_access_token");
        localStorage.removeItem("codex_admin_user");
      } catch (e) {
        console.warn("Unable to clear auth credentials from localStorage", e);
      }
    },
  },
});

export const { setLogin, setLogout, setAuthResolved } = authSlice.actions;

export default authSlice.reducer;
