import { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { adminService } from "./services/adminService";
import { setLogin, setLogout, setAuthResolved } from "./context/authSlice";
import GlobalMessage from "./components/common/GlobalMessage";
import SplashScreen from "./components/common/SplashScreen";
import { ConfirmProvider } from "./context/ConfirmContext";


function App({ children }) {
  const dispatch = useDispatch();
  const isTargetingAdmin = window.location.pathname.startsWith('/admin');
  const [showSplash, setShowSplash] = useState(isTargetingAdmin);

  useEffect(() => {
    dispatch(setAuthResolved(false));
    const fetchProfile = async () => {
      try {
        const response = await adminService.getCurrentAdmin();
        // Assuming response or response.data contains the user payload
        dispatch(setLogin(response.data || response));
      } catch {
        dispatch(setLogout());
      } finally {
        dispatch(setAuthResolved(true));
        // Keep splash screen mounted momentarily so Suspense chunks can load underneath
        setTimeout(() => {
          setShowSplash(false);
        }, 1200);
      }
    };

    // Since the session token is in an httpOnly cookie, we should always
    // attempt to fetch the profile on mount to verify the session.
    fetchProfile();
  }, [dispatch]);

  return (
    <ConfirmProvider>
      <SplashScreen show={showSplash} />
      <GlobalMessage />
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div></div>}>
        {children}
      </Suspense>
    </ConfirmProvider>
  );
}

export default App;
