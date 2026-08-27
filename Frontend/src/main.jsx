import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";

import "./index.css";
import App from "./App";
import MainLayout from "./layout/MainLayout";
import DashboardLayout from "./pages/admin/DashboardLayout";
import AdminLayout from "./layout/AdminLayout";
import GlobalError from "./pages/Error";

import Home from "./pages/Home";
import { lazyWithRetry, routeLazy } from "./utils/lazyWithRetry";

// Public pages
const About = routeLazy(() => import("./pages/About"));
const Team = routeLazy(() => import("./pages/Team"));
const Events = routeLazy(() => import("./pages/Events"));
const EventDetails = routeLazy(() => import("./pages/EventDetails"));

const Register = routeLazy(() => import("./pages/Register"));

const VerifyCertificate = routeLazy(() => import("./pages/VerifyCertificate"));
const VerifyBoardingPass = routeLazy(() => import("./pages/VerifyBoardingPass"));


// New Policy Pages
const PrivacyPolicy = routeLazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = routeLazy(() => import("./pages/TermsConditions"));
const CommunityGuidelines = routeLazy(() => import("./pages/CommunityGuidelines"));
const EventPolicy = routeLazy(() => import("./pages/EventPolicy"));
const Accessibility = routeLazy(() => import("./pages/Accessibility"));

// Admin only pages
const AdminLogin = routeLazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = routeLazy(() => import("./pages/admin/Dashboard"));
const AdminRegistrations = routeLazy(() => import("./pages/admin/Registrations"));
const AdminEvents = routeLazy(() => import("./pages/admin/ManageEvents"));
const AdminTeam = routeLazy(() => import("./pages/admin/ManageTeam"));
const BulkCertificates = routeLazy(() => import("./pages/admin/BulkCertificates"));
const BulkBoardingPasses = routeLazy(() => import("./pages/admin/BulkBoardingPasses"));
const QRGenerator = routeLazy(() => import("./pages/admin/QRGenerator"));
const ManageSessions = routeLazy(() => import("./pages/admin/ManageSessions"));
const ManageContacts = routeLazy(() => import("./pages/admin/ManageContacts"));
const AdminProfile = routeLazy(() => import("./pages/admin/AdminProfile"));
const AdminSettings = routeLazy(() => import("./pages/admin/AdminSettings"));
const AdminAnnouncements = routeLazy(() => import("./pages/admin/Announcements"));
const BackgroundJobs = routeLazy(() => import("./pages/admin/BackgroundJobs"));
const AuditHistory = routeLazy(() => import("./pages/admin/AuditHistory"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <GlobalError />,
    children: [
      { path: "/", element: <Home /> },

      { path: "/team", lazy: Team },
      { path: "/events", lazy: Events },
      { path: "/events/:id", lazy: EventDetails },
      { path: "/about", lazy: About },

      { path: "/register", lazy: Register },
      { path: "/verify-certificate/:certificateId", lazy: VerifyCertificate },
      { path: "/verify-boarding-pass/:boardingPassId", lazy: VerifyBoardingPass },


      { path: "/privacy-policy", lazy: PrivacyPolicy },
      { path: "/terms-conditions", lazy: TermsConditions },
      { path: "/community-guidelines", lazy: CommunityGuidelines },
      { path: "/event-policy", lazy: EventPolicy },
      { path: "/accessibility", lazy: Accessibility },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <GlobalError />,
    children: [
      { path: "login", lazy: AdminLogin },
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", lazy: AdminDashboard },
          { path: "registrations", lazy: AdminRegistrations },
          { path: "events", lazy: AdminEvents },
          { path: "team", lazy: AdminTeam },
          { path: "certificates", lazy: BulkCertificates },
          { path: "boarding-passes", lazy: BulkBoardingPasses },
          { path: "qr-generator", lazy: QRGenerator },
          { path: "sessions", lazy: ManageSessions },
          { path: "messages", lazy: ManageContacts },
          { path: "tasks", lazy: BackgroundJobs },
          { path: "history", lazy: AuditHistory },
          { path: "profile", lazy: AdminProfile },
          { path: "settings", lazy: AdminSettings },
          { path: "announcements", lazy: AdminAnnouncements },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <GlobalError />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <RouterProvider router={router} />
      </App>
    </Provider>
  </React.StrictMode>
);