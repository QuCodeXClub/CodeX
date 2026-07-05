import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AuthGuard from './components/AuthGuard';

// Public pages
const Team = lazy(() => import('./pages/Team'));
const Events = lazy(() => import('./pages/Events'));
const Resources = lazy(() => import('./pages/Resources'));
const Faqs = lazy(() => import('./pages/Faqs'));
const Register = lazy(() => import('./pages/Register'));

import AdminLayout from './pages/admin/AdminLayout'; 
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

// Admin only pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminRegistrations = lazy(() => import('./pages/admin/Registrations'));
const AdminEvents = lazy(() => import('./pages/admin/ManageEvents'));
const AdminTeam = lazy(() => import('./pages/admin/ManageTeam'));
const BulkCertificates = lazy(() => import('./pages/admin/BulkCertificates'));
const ManageFAQs = lazy(() => import('./pages/admin/ManageFAQs'));
const ManageSessions = lazy(() => import('./pages/admin/ManageSessions'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-[#2ec5d4] font-jetbrains">
    <div className="animate-pulse font-bold tracking-widest uppercase">Initializing Module...</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          
          {/* Public section */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/*authlocked admin routes*/}
          <Route element={<AuthGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="registrations" element={<AdminRegistrations />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="certificates" element={<BulkCertificates />} />
              <Route path="sessions" element={<ManageSessions />} />
              
            </Route>
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
export default App;