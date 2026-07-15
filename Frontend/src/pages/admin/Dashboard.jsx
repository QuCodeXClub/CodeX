import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardMetrics } from "../../context/adminDashboardSlice";

import DashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import AdminWelcome from "../../components/admin/dashboard/AdminWelcome";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import MetricsGrid from "../../components/admin/dashboard/MetricsGrid";
import DatabaseAggregates from "../../components/admin/dashboard/DatabaseAggregates";
import RecentRegistrations from "../../components/admin/dashboard/RecentRegistrations";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { metrics, recentLogs, loading, isLoaded } = useSelector(
    (state) => state.adminDashboard
  );

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchDashboardMetrics());
    }
  }, [dispatch, isLoaded]);

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full">
      <DashboardHeader
        onRefresh={() => dispatch(fetchDashboardMetrics())}
        loading={loading}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <AdminWelcome />
          <QuickActions />
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <MetricsGrid metrics={metrics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DatabaseAggregates metrics={metrics} />
            <RecentRegistrations metrics={metrics} recentLogs={recentLogs} />
          </div>
        </div>
      </div>
    </div>
  );
}
