import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

//public pages
const Team = lazy(() => import('./pages/Team'));
const Events = lazy(() => import('./pages/Events'));
const Resources = lazy(() => import('./pages/Resources'));

//admin only pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminRegistrations = lazy(() => import('./pages/admin/Registrations'));
const AdminEvents = lazy(() => import('./pages/admin/ManageEvents'));
const AdminTeam = lazy(() => import('./pages/admin/ManageTeam'));
const BulkCertificates = lazy(() => import('./pages/admin/BulkCertificates'));
const ManageFAQs = lazy(() => import('./pages/admin/ManageFAQs'));
const ManageSessions = lazy(() => import('./pages/admin/ManageSessions'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-light text-accent-cyan font-mono">
    {/* INITIALIZING MODULE... */}
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          
          {/* Public section*/}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
          </Route>
          {/*Admin section*/}
          <Route path="/admin">
            <Route index element={<AdminDashboard />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="certificates" element={<BulkCertificates />} />
            <Route path="faqs" element={<ManageFAQs />} />
            <Route path="sessions" element={<ManageSessions />} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;