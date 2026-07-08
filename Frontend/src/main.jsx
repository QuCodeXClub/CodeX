import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";

import "./index.css";
import App from "./App";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import GlobalError from "./pages/Error";

import Home from "./pages/Home";

// Public pages
const Team = lazy(() => import("./pages/Team"));
const Events = lazy(() => import("./pages/Events"));
const Resources = lazy(() => import("./pages/Resources"));
const Faqs = lazy(() => import("./pages/Faqs"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const Contact = lazy(() => import("./pages/Contact"));

// Admin only pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminRegistrations = lazy(() => import("./pages/admin/Registrations"));
const AdminEvents = lazy(() => import("./pages/admin/ManageEvents"));
const AdminTeam = lazy(() => import("./pages/admin/ManageTeam"));
const BulkCertificates = lazy(() => import("./pages/admin/BulkCertificates"));
const ManageSessions = lazy(() => import("./pages/admin/ManageSessions"));
const ManageContacts = lazy(() => import("./pages/admin/ManageContacts"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <GlobalError />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/team", element: <Team /> },
      { path: "/events", element: <Events /> },
      { path: "/resources", element: <Resources /> },
      { path: "/faqs", element: <Faqs /> },
      { path: "/register", element: <Register /> },
      {
      path: "/verify-certificate/:certificateId",
      element: <VerifyCertificate />
    },
      { path: "/contact", element: <Contact /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
    errorElement: <GlobalError />,
  },
  {
    path: "/admin",
    element: <AuthLayout />, // Guards the routes
    errorElement: <GlobalError />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "registrations", element: <AdminRegistrations /> },
          { path: "events", element: <AdminEvents /> },
          { path: "team", element: <AdminTeam /> },
          { path: "certificates", element: <BulkCertificates /> },
          { path: "sessions", element: <ManageSessions /> },
          { path: "messages", element: <ManageContacts /> },
        ],
      },
    ],
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
