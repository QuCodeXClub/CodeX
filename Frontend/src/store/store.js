import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../context/authSlice";
import messageReducer from "../context/messageSlice";
import adminEventsReducer from "../context/adminEventsSlice";
import adminTeamReducer from "../context/adminTeamSlice";
import adminRegistrationsReducer from "../context/adminRegistrationsSlice";
import adminSessionsReducer from "../context/adminSessionsSlice";
import adminDashboardReducer from "../context/adminDashboardSlice";
import adminContactReducer from "../context/adminContactSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    adminEvents: adminEventsReducer,
    adminTeam: adminTeamReducer,
    adminRegistrations: adminRegistrationsReducer,
    adminSessions: adminSessionsReducer,
    adminDashboard: adminDashboardReducer,
    adminContact: adminContactReducer,
  },
});

export default store;
