import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../context/authSlice";
import messageReducer from "../context/messageSlice";
import adminEventsReducer from "../context/adminEventsSlice";
import adminTeamReducer from "../context/adminTeamSlice";
import adminRegistrationsReducer from "../context/adminRegistrationsSlice";
import adminSessionsReducer from "../context/adminSessionsSlice";
import adminDashboardReducer from "../context/adminDashboardSlice";
import adminContactReducer from "../context/adminContactSlice";
import adminQrReducer from "../context/adminQrSlice";

const appReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  adminEvents: adminEventsReducer,
  adminTeam: adminTeamReducer,
  adminRegistrations: adminRegistrationsReducer,
  adminSessions: adminSessionsReducer,
  adminDashboard: adminDashboardReducer,
  adminContact: adminContactReducer,
  adminQr: adminQrReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/setLogout") {
    // Reset all state on logout
    state = undefined;
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
