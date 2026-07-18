import React from "react";
import { Settings, Sun, Moon, LayoutTemplate } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export default function AdminSettings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border-soft flex items-center gap-3 bg-card-hover">
        <Settings className="text-accent w-5 h-5" />
        <h2 className="font-semibold text-text">Preferences & Appearance</h2>
      </div>
      <div className="p-8 sm:p-10 space-y-12">
        {/* Appearance Section */}
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-text mb-6">
            {theme === "light" ? (
              <Sun className="w-5 h-5 text-accent" />
            ) : (
              <Moon className="w-5 h-5 text-accent" />
            )}
            Appearance
          </h2>

          <div className="flex flex-col border-y border-border-soft divide-y divide-border-soft">
            {/* Theme Toggle */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
              <div className="pr-8">
                <h3 className="text-sm font-semibold text-text">Interface Theme</h3>
                <p className="text-sm text-text-muted mt-1">
                  Customize the visual appearance of the dashboard. Switch between light and dark modes based on your environment.
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card hover:bg-card-hover text-text transition-all font-medium text-sm shrink-0 shadow-sm"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-4 h-4" />
                    Switch to Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    Switch to Light Mode
                  </>
                )}
              </button>
            </div>

            {/* Mock Layout Toggle */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-50 cursor-not-allowed">
              <div className="pr-8">
                <h3 className="text-sm font-semibold text-text">Compact Layout</h3>
                <p className="text-sm text-text-muted mt-1">
                  Reduce padding and font sizes to fit more data on the screen. (Coming soon)
                </p>
              </div>
              <div className="w-11 h-6 bg-border-soft rounded-full relative shrink-0">
                <div className="absolute left-1 top-1 w-4 h-4 bg-card rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Section Example */}
        <section className="opacity-50 pointer-events-none">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text mb-6">
            <LayoutTemplate className="w-5 h-5 text-accent" />
            Dashboard Layout
          </h2>
          <div className="flex flex-col border-y border-border-soft divide-y divide-border-soft">
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="pr-8">
                <h3 className="text-sm font-semibold text-text">Default Landing Page</h3>
                <p className="text-sm text-text-muted mt-1">
                  Choose which page loads first when you log into the admin portal.
                </p>
              </div>
              <div className="px-4 py-2 border border-border bg-bg rounded-lg text-sm font-medium text-text-muted">
                Dashboard
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}