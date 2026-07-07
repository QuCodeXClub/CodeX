import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShieldCheck,
  FileText,
  MessageSquare,
  Activity,
  LogOut,
} from "lucide-react";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setLogout } from "../../context/authSlice";

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    { name: "Registrations", path: "/admin/registrations", icon: Users },
    { name: "Events", path: "/admin/events", icon: Calendar },
    { name: "Team Roster", path: "/admin/team", icon: ShieldCheck },
    { name: "Certificates", path: "/admin/certificates", icon: FileText },
    { name: "Sessions", path: "/admin/sessions", icon: Activity },
    { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  ];
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/admin/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Backend logout failed or session already cleared:", error);
    } finally {
      dispatch(setLogout());
      navigate("/admin/login");
    }
  };
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-8 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            CODEX
          </h1>
          <p className="mt-1 text-[11px] font-semibold text-teal-500 uppercase tracking-widest">
            Admin Portal
          </p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? "bg-teal-50 text-teal-700 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-teal-500 before:rounded-r-md"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 rounded-lg transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>
      <main className="flex-1 relative overflow-hidden flex flex-col h-screen">
        <div className="relative z-10 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
