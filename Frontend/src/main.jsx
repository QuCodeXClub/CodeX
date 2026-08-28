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
import SplashScreen from "./components/common/SplashScreen";
import { routeLazy, prefetchRoute } from "./utils/lazyWithRetry";

// Dynamic Loaders
const loadAbout = () => import("./pages/About");
const loadTeam = () => import("./pages/Team");
const loadEvents = () => import("./pages/Events");
const loadEventDetails = () => import("./pages/EventDetails");
const loadRegister = () => import("./pages/Register");
const loadVerifyCertificate = () => import("./pages/VerifyCertificate");
const loadVerifyBoardingPass = () => import("./pages/VerifyBoardingPass");

// Legal / Policy Loaders
const loadPrivacyPolicy = () => import("./pages/PrivacyPolicy");
const loadTermsConditions = () => import("./pages/TermsConditions");
const loadCommunityGuidelines = () => import("./pages/CommunityGuidelines");
const loadEventPolicy = () => import("./pages/EventPolicy");
const loadAccessibility = () => import("./pages/Accessibility");
const loadPaymentRegistrationGuide = () => import("./pages/PaymentRegistrationGuide");

// Admin Loaders
const loadAdminLogin = () => import("./pages/admin/AdminLogin");
const loadAdminDashboard = () => import("./pages/admin/Dashboard");
const loadAdminRegistrations = () => import("./pages/admin/Registrations");
const loadAdminEvents = () => import("./pages/admin/ManageEvents");
const loadAdminTeam = () => import("./pages/admin/ManageTeam");
const loadBulkCertificates = () => import("./pages/admin/BulkCertificates");
const loadBulkBoardingPasses = () => import("./pages/admin/BulkBoardingPasses");
const loadQRGenerator = () => import("./pages/admin/QRGenerator");
const loadManageSessions = () => import("./pages/admin/ManageSessions");
const loadManageContacts = () => import("./pages/admin/ManageContacts");
const loadAdminProfile = () => import("./pages/admin/AdminProfile");
const loadAdminSettings = () => import("./pages/admin/AdminSettings");
const loadAdminAnnouncements = () => import("./pages/admin/Announcements");
const loadBackgroundJobs = () => import("./pages/admin/BackgroundJobs");
const loadAuditHistory = () => import("./pages/admin/AuditHistory");

// Public pages (Cached & Prefetch-Ready)
const About = routeLazy(loadAbout);
const Team = routeLazy(loadTeam);
const Events = routeLazy(loadEvents);
const EventDetails = routeLazy(loadEventDetails);
const Register = routeLazy(loadRegister);
const VerifyCertificate = routeLazy(loadVerifyCertificate);
const VerifyBoardingPass = routeLazy(loadVerifyBoardingPass);

// Policy Pages
const PrivacyPolicy = routeLazy(loadPrivacyPolicy);
const TermsConditions = routeLazy(loadTermsConditions);
const CommunityGuidelines = routeLazy(loadCommunityGuidelines);
const EventPolicy = routeLazy(loadEventPolicy);
const Accessibility = routeLazy(loadAccessibility);
const PaymentRegistrationGuide = routeLazy(loadPaymentRegistrationGuide);

// Admin Pages
const AdminLogin = routeLazy(loadAdminLogin);
const AdminDashboard = routeLazy(loadAdminDashboard);
const AdminRegistrations = routeLazy(loadAdminRegistrations);
const AdminEvents = routeLazy(loadAdminEvents);
const AdminTeam = routeLazy(loadAdminTeam);
const BulkCertificates = routeLazy(loadBulkCertificates);
const BulkBoardingPasses = routeLazy(loadBulkBoardingPasses);
const QRGenerator = routeLazy(loadQRGenerator);
const ManageSessions = routeLazy(loadManageSessions);
const ManageContacts = routeLazy(loadManageContacts);
const AdminProfile = routeLazy(loadAdminProfile);
const AdminSettings = routeLazy(loadAdminSettings);
const AdminAnnouncements = routeLazy(loadAdminAnnouncements);
const BackgroundJobs = routeLazy(loadBackgroundJobs);
const AuditHistory = routeLazy(loadAuditHistory);

// Idle Background Prefetching for instantaneous routing
if (typeof window !== "undefined") {
  const prefetchPublicRoutes = () => {
    prefetchRoute(loadEvents);
    prefetchRoute(loadAbout);
    prefetchRoute(loadTeam);
    prefetchRoute(loadRegister);
    prefetchRoute(loadPaymentRegistrationGuide);
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(prefetchPublicRoutes, { timeout: 1500 });
  } else {
    setTimeout(prefetchPublicRoutes, 800);
  }
}

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
      { path: "/payment-registration-guide", lazy: PaymentRegistrationGuide },
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
        <RouterProvider router={router} fallbackElement={<SplashScreen />} />
      </App>
    </Provider>
  </React.StrictMode>
);