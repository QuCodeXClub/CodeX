import { useEffect, useState, Suspense } from "react";
import { Outlet, Navigate, useLocation, useNavigation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminService } from "../services/adminService";
import { setLogin, setLogout, setAuthResolved } from "../context/authSlice";
import SplashScreen from "../components/common/SplashScreen";
import RouteProgressBar from "../components/common/RouteProgressBar";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const isAuthResolved = useSelector((state) => state.auth.isAuthResolved);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigation = useNavigation();
  const [showSplash, setShowSplash] = useState(true);
  const isPageLoading = navigation.state === "loading";

  useEffect(() => {
    dispatch(setAuthResolved(false));

    // Optimization: check if we have a valid session or token before making the network call
    const hasAuthFlag = localStorage.getItem("codex_admin_auth") === "true";
    const hasToken = !!localStorage.getItem("codex_access_token");

    if (!hasAuthFlag && !hasToken) {
      dispatch(setLogout());
      setTimeout(() => {
        setShowSplash(false);
      }, 300); // Fast exit for guest users
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
        }, 400);
      }
    };

    fetchProfile();
  }, [dispatch]);

  let content = null;
  const isLoginPage = location.pathname === "/admin/login";

  if (isAuthResolved) {
    // 1. If unauthenticated and trying to access dashboard routes, redirect to login
    if (!user && !isLoginPage) {
      content = (
        <Navigate to="/admin/login" replace state={{ from: location }} />
      );
    }
    // 2. If authenticated and trying to access the login page, redirect to intended route or dashboard
    else if (user && isLoginPage) {
      const destination = location.state?.from?.pathname || "/admin/dashboard";
      content = <Navigate to={destination} replace />;
    }
    // 3. Otherwise, render the requested route
    else {
      content = <Outlet />;
    }
  }

  return (
    <>
      <SplashScreen show={!isAuthResolved || showSplash} />

      {isPageLoading && <RouteProgressBar />}

      <Suspense fallback={<RouteProgressBar />}>
        {content}
      </Suspense>
    </>
  );
}
