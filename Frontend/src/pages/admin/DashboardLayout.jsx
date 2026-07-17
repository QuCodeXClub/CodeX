import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Calendar,
  ShieldCheck,
  FileText,
  MessageSquare,
  Activity,
  LogOut,
  User,
  Menu,
  X,
  Ticket,
} from "lucide-react";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setLogout } from "../../context/authSlice";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

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
    { name: "Boarding Passes", path: "/admin/boarding-passes", icon: Ticket },
    { name: "Messages", path: "/admin/messages", icon: MessageSquare },
    { name: "Profile", path: "/admin/profile", icon: User },
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
    <div className="flex min-h-screen bg-card-hover font-sans text-text">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-bg/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-8 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              CODEX
            </h1>
            <p className="mt-1 text-[11px] font-semibold text-accent uppercase tracking-widest">
              Admin Portal
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-text-text-muted hover:text-text-text-muted lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
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
                    ? "bg-accent/10 text-accent relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-accent before:rounded-r-md"
                    : "text-text-text-muted hover:bg-card-hover hover:text-text"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border-soft">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-text-text-muted rounded-lg transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-screen w-full">
        {/* Mobile Header */}
        <header className="bg-card border-b border-border px-4 py-4 flex items-center justify-between lg:hidden z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-text-text-muted hover:bg-card-hover rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-text leading-none">
                CODEX
              </h1>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
