import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import GlobalError from "../pages/Error";

// Core Public Pages (bundled for instant page transitions without loading flickers)
import Home from "../pages/Home";
import About from "../pages/About";
import Team from "../pages/Team";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import Register from "../pages/Register";

// Retry-enabled route lazy loader
import { routeLazy } from "../utils/lazyWithRetry";

// Grouped Informational & Legal Pages (bundled in 'legal-pages' chunk)
const PrivacyPolicy = routeLazy(() => import("../pages/PrivacyPolicy"));
const TermsConditions = routeLazy(() => import("../pages/TermsConditions"));
const CommunityGuidelines = routeLazy(() => import("../pages/CommunityGuidelines"));
const EventPolicy = routeLazy(() => import("../pages/EventPolicy"));
const Accessibility = routeLazy(() => import("../pages/Accessibility"));
const PaymentRegistrationGuide = routeLazy(() => import("../pages/PaymentRegistrationGuide"));

// High-Payload Verification Pages (code-split to keep 1.2MB PDF/SVG assets off critical path)
const VerifyCertificate = routeLazy(() => import("../pages/VerifyCertificate"));
const VerifyBoardingPass = routeLazy(() => import("../pages/VerifyBoardingPass"));

// Admin Suite (strictly isolated into 'admin-suite' chunk so visitors never download admin code)
const AdminLayout = routeLazy(() => import("../layout/AdminLayout"));
const DashboardLayout = routeLazy(() => import("../pages/admin/DashboardLayout"));
const AdminLogin = routeLazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = routeLazy(() => import("../pages/admin/Dashboard"));
const AdminRegistrations = routeLazy(() => import("../pages/admin/Registrations"));
const AdminEvents = routeLazy(() => import("../pages/admin/ManageEvents"));
const AdminTeam = routeLazy(() => import("../pages/admin/ManageTeam"));
const BulkCertificates = routeLazy(() => import("../pages/admin/BulkCertificates"));
const BulkBoardingPasses = routeLazy(() => import("../pages/admin/BulkBoardingPasses"));
const QRGenerator = routeLazy(() => import("../pages/admin/QRGenerator"));
const ManageSessions = routeLazy(() => import("../pages/admin/ManageSessions"));
const ManageContacts = routeLazy(() => import("../pages/admin/ManageContacts"));
const AdminProfile = routeLazy(() => import("../pages/admin/AdminProfile"));
const AdminSettings = routeLazy(() => import("../pages/admin/AdminSettings"));
const AdminAnnouncements = routeLazy(() => import("../pages/admin/Announcements"));
const BackgroundJobs = routeLazy(() => import("../pages/admin/BackgroundJobs"));
const AuditHistory = routeLazy(() => import("../pages/admin/AuditHistory"));

// High-performance intent prefetching: loads route chunks upon hover/touch before click completes
if (typeof window !== "undefined") {
  const prefetchedUrls = new Set();

  const prefetchByPath = (pathname) => {
    if (!pathname || prefetchedUrls.has(pathname)) return;
    prefetchedUrls.add(pathname);

    if (
      pathname.includes("/privacy-policy") ||
      pathname.includes("/terms-conditions") ||
      pathname.includes("/community-guidelines") ||
      pathname.includes("/event-policy") ||
      pathname.includes("/accessibility") ||
      pathname.includes("/payment-registration-guide")
    ) {
      import("../pages/PrivacyPolicy").catch(() => {});
    } else if (pathname.startsWith("/admin")) {
      import("../layout/AdminLayout").catch(() => {});
      import("../pages/admin/DashboardLayout").catch(() => {});
    } else if (pathname.includes("/verify-certificate")) {
      import("../pages/VerifyCertificate").catch(() => {});
    } else if (pathname.includes("/verify-boarding-pass")) {
      import("../pages/VerifyBoardingPass").catch(() => {});
    }
  };

  const handlePointerPrefetch = (event) => {
    const anchor = event.target?.closest?.("a[href]");
    if (anchor && anchor.origin === window.location.origin) {
      prefetchByPath(anchor.pathname);
    }
  };

  document.addEventListener("pointerover", handlePointerPrefetch, { passive: true });
  document.addEventListener("touchstart", handlePointerPrefetch, { passive: true });

  // Idle background prefetch for legal pages
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => import("../pages/PrivacyPolicy").catch(() => {}), { timeout: 3000 });
  } else {
    setTimeout(() => import("../pages/PrivacyPolicy").catch(() => {}), 2000);
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <GlobalError />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/team", element: <Team /> },
      { path: "/events", element: <Events /> },
      { path: "/events/:id", element: <EventDetails /> },
      { path: "/register", element: <Register /> },

      // Verification routes
      { path: "/verify-certificate/:certificateId", lazy: VerifyCertificate },
      { path: "/verify-boarding-pass/:boardingPassId", lazy: VerifyBoardingPass },

      // Legal & Documentation routes
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
    lazy: AdminLayout,
    errorElement: <GlobalError />,
    children: [
      { path: "login", lazy: AdminLogin },
      {
        path: "",
        lazy: DashboardLayout,
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
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

export default router;
