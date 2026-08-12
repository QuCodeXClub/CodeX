import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Calendar,
  ShieldCheck,
  FileText,
  MessageSquare,
  User,
  Menu,
  X,
  Ticket,
  Scan,
  Megaphone,
  KeyRound,
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const contentRef = React.useRef(null);

  // Close sidebar and reset scroll to top on route change
  useEffect(() => {
    setIsSidebarOpen(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    { name: "Registrations", path: "/admin/registrations", icon: Users },
    { name: "Special UTRs", path: "/admin/special-utrs", icon: KeyRound },
    { name: "Events", path: "/admin/events", icon: Calendar },
    { name: "Team Roster", path: "/admin/team", icon: ShieldCheck },
    { name: "Certificates", path: "/admin/certificates", icon: FileText },
    { name: "Boarding Passes", path: "/admin/boarding-passes", icon: Ticket },
    { name: "QR Generator", path: "/admin/qr-generator", icon: Scan },
    { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
    { name: "Messages", path: "/admin/messages", icon: MessageSquare },
    { name: "Profile", path: "/admin/profile", icon: User },
  ];

  return (
    <div className="flex h-screen max-h-screen w-full overflow-hidden bg-bg font-sans text-text relative">
      {/* Background Grid Pattern (Same as Welcome Page) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#2ec5d4 1px, transparent 1px), linear-gradient(90deg, #2ec5d4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Ambient Radial Cyan Glow Spots */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-accent/15 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-accent/10 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-bg/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/85 backdrop-blur-xl border-r border-border/80 flex flex-col shrink-0 h-full transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 pb-4 flex items-center justify-between border-b border-border/60 shrink-0">
          <div>
            <h1 className="text-2xl font-display font-black tracking-tight text-text flex items-center gap-2">
              CODE <span className="text-accent">X</span>
            </h1>
            <p className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-accent/10 text-accent border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Admin Portal
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-text-muted hover:text-text lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-accent/15 text-accent border border-accent/30 shadow-[0_0_15px_var(--color-accent-glow)] font-semibold"
                    : "text-text-muted hover:bg-card-hover/80 hover:text-text hover:border-border/60 border border-transparent"
                }`
              }
            >
              <item.icon className="w-4 h-4 text-accent/90" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-full w-full min-w-0 z-10">
        {/* Mobile Header */}
        <header className="bg-card/85 backdrop-blur-xl border-b border-border/80 px-4 py-3.5 flex items-center justify-between lg:hidden z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-text-muted hover:bg-card-hover rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-display font-black tracking-tight text-text leading-none">
                CODE <span className="text-accent">X</span>
              </h1>
            </div>
          </div>
        </header>

        <div ref={contentRef} className="relative z-10 flex-1 overflow-y-auto h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}