import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminLayout() {
  const isAuthResolved = useSelector((state) => state.auth.isAuthResolved);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  // 1. Wait for session check to complete before rendering anything
  if (!isAuthResolved) {
    return null;
  }

  const isLoginPage = location.pathname === "/admin/login";

  // 2. If unauthenticated and trying to access dashboard routes, redirect to login
  if (!user && !isLoginPage) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // 3. If authenticated and trying to access the login page, redirect to dashboard
  if (user && isLoginPage) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 4. Otherwise, render the requested route (Login page or DashboardLayout)
  return <Outlet />;
}
