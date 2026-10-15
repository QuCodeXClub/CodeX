import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchDashboardMetrics } from "../../context/adminDashboardSlice";

import DashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import AdminWelcome from "../../components/admin/dashboard/AdminWelcome";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import MetricsGrid from "../../components/admin/dashboard/MetricsGrid";
import DatabaseAggregates from "../../components/admin/dashboard/DatabaseAggregates";
import RecentRegistrations from "../../components/admin/dashboard/RecentRegistrations";
import SuperAdminActivityFeed from "../../components/admin/dashboard/SuperAdminActivityFeed";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get("view"); // 'admin' | null | 'super'

  const { metrics, recentLogs, recentActivityLogs, loading, isLoaded } = useSelector(
    (state) => state.adminDashboard
  );
  const currentUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = (currentUser?.admin?.role || currentUser?.role) === "SuperAdmin";

  // For SuperAdmin: default view is super, but if view=admin, show admin view
  const isSuperView = isSuperAdmin && viewParam !== "admin";

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchDashboardMetrics());
    }
  }, [dispatch, isLoaded]);

  const handleToggleView = (newView) => {
    if (newView === "admin") {
      setSearchParams({ view: "admin" });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full">
      <DashboardHeader
        onRefresh={() => dispatch(fetchDashboardMetrics())}
        loading={loading}
        isSuperView={isSuperView}
        onToggleView={handleToggleView}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <AdminWelcome isSuperView={isSuperView} />
          <QuickActions isSuperView={isSuperView} />
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <MetricsGrid metrics={metrics} isSuperView={isSuperView} />
          {isSuperView ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SuperAdminActivityFeed
                  recentActivityLogs={recentActivityLogs}
                  loading={loading}
                />
                <DatabaseAggregates metrics={metrics} />
              </div>
              <RecentRegistrations metrics={metrics} recentLogs={recentLogs} />
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DatabaseAggregates metrics={metrics} />
              <RecentRegistrations metrics={metrics} recentLogs={recentLogs} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
