import { useEffect, useState, Suspense } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminService } from "../services/adminService";
import { setLogin, setLogout, setAuthResolved } from "../context/authSlice";
import SplashScreen from "../components/common/SplashScreen";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const isAuthResolved = useSelector((state) => state.auth.isAuthResolved);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    dispatch(setAuthResolved(false));

    // Optimization: check if we even have a valid session before making the API call
    const hasAuthFlag = localStorage.getItem("codex_admin_auth") === "true";

    if (!hasAuthFlag) {
      dispatch(setLogout());
      setTimeout(() => {
        setShowSplash(false);
      }, 500); // Shorter splash since no network request is made
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await adminService.getCurrentAdmin();
        dispatch(setLogin(response.data || response));
      } catch {
        dispatch(setLogout());
      } finally {
        dispatch(setAuthResolved(true));
        setTimeout(() => {
          setShowSplash(false);
        }, 1200);
      }
    };

    fetchProfile();
  }, [dispatch]);

  let content = null;
  const isLoginPage = location.pathname === "/admin/login";

  if (isAuthResolved) {
    // 2. If unauthenticated and trying to access dashboard routes, redirect to login
    if (!user && !isLoginPage) {
      content = (
        <Navigate to="/admin/login" replace state={{ from: location }} />
      );
    }
    // 3. If authenticated and trying to access the login page, redirect to dashboard
    else if (user && isLoginPage) {
      content = <Navigate to="/admin/dashboard" replace />;
    }
    // 4. Otherwise, render the requested route
    else {
      content = <Outlet />;
    }
  }

  return (
    <>
      {/* 
        Always keep SplashScreen at the top so it doesn't unmount abruptly.
        It fades out smoothly after showSplash becomes false.
      */}
      <SplashScreen show={!isAuthResolved || showSplash} />
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
          </div>
        }
      >
        {content}
      </Suspense>
    </>
  );
}
