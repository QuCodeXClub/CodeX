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
import lazyWithRetry from "./utils/lazyWithRetry";

// Public pages
const Team = lazyWithRetry(() => import("./pages/Team"));
const Events = lazyWithRetry(() => import("./pages/Events"));
const EventDetails = lazyWithRetry(() => import("./pages/EventDetails"));

const Register = lazyWithRetry(() => import("./pages/Register"));

const VerifyCertificate = lazyWithRetry(() => import("./pages/VerifyCertificate"));
const VerifyBoardingPass = lazyWithRetry(() => import("./pages/VerifyBoardingPass"));


// New Policy Pages
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazyWithRetry(() => import("./pages/TermsConditions"));
const CommunityGuidelines = lazyWithRetry(() => import("./pages/CommunityGuidelines"));
const EventPolicy = lazyWithRetry(() => import("./pages/EventPolicy"));
const Accessibility = lazyWithRetry(() => import("./pages/Accessibility"));

// Admin only pages
const AdminLogin = lazyWithRetry(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazyWithRetry(() => import("./pages/admin/Dashboard"));
const AdminRegistrations = lazyWithRetry(() => import("./pages/admin/Registrations"));
const AdminEvents = lazyWithRetry(() => import("./pages/admin/ManageEvents"));
const AdminTeam = lazyWithRetry(() => import("./pages/admin/ManageTeam"));
const BulkCertificates = lazyWithRetry(() => import("./pages/admin/BulkCertificates"));
const BulkBoardingPasses = lazyWithRetry(() => import("./pages/admin/BulkBoardingPasses"));
const QRGenerator = lazyWithRetry(() => import("./pages/admin/QRGenerator"));
const ManageSessions = lazyWithRetry(() => import("./pages/admin/ManageSessions"));
const ManageContacts = lazyWithRetry(() => import("./pages/admin/ManageContacts"));
const AdminProfile = lazyWithRetry(() => import("./pages/admin/AdminProfile"));
const AdminSettings = lazyWithRetry(() => import("./pages/admin/AdminSettings"));
const AdminAnnouncements = lazyWithRetry(() => import("./pages/admin/Announcements"));
const BackgroundJobs = lazyWithRetry(() => import("./pages/admin/BackgroundJobs"));
const AuditHistory = lazyWithRetry(() => import("./pages/admin/AuditHistory"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <GlobalError />,
    children: [
      { path: "/", element: <Home /> },

      { path: "/team", element: <Team /> },
      { path: "/events", element: <Events /> },
      { path: "/events/:id", element: <EventDetails /> },

      { path: "/register", element: <Register /> },
      { path: "/verify-certificate/:certificateId", element: <VerifyCertificate /> },
      { path: "/verify-boarding-pass/:boardingPassId", element: <VerifyBoardingPass /> },


      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms-conditions", element: <TermsConditions /> },
      { path: "/community-guidelines", element: <CommunityGuidelines /> },
      { path: "/event-policy", element: <EventPolicy /> },
      { path: "/accessibility", element: <Accessibility /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <GlobalError />,
    children: [
      { path: "login", element: <AdminLogin /> },
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "registrations", element: <AdminRegistrations /> },
          { path: "events", element: <AdminEvents /> },
          { path: "team", element: <AdminTeam /> },
          { path: "certificates", element: <BulkCertificates /> },
          { path: "boarding-passes", element: <BulkBoardingPasses /> },
          { path: "qr-generator", element: <QRGenerator /> },
          { path: "sessions", element: <ManageSessions /> },
          { path: "messages", element: <ManageContacts /> },
          { path: "tasks", element: <BackgroundJobs /> },
          { path: "history", element: <AuditHistory /> },
          { path: "profile", element: <AdminProfile /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "announcements", element: <AdminAnnouncements /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
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