"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { ListChecks, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent server hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const adminNavItems = [
    {
      href: "/admin/dashboard",
      label: "Manage Issues",
      icon: <ListChecks className="h-4 w-4" />,
      isActive: pathname === "/admin/dashboard",
    },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50/70 dark:bg-slate-950/95 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Premium background radial glow for modern SaaS depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200/40 via-transparent to-transparent dark:from-slate-900/40 pointer-events-none" />

      {/* Top Header Section with perfect blur and uniform borders */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-6 py-2">
        <div className="flex-1">
          <Navbar navItems={adminNavItems} userType="Admin" />
        </div>

        {/* Global Layout Theme Switcher (Fully Functional & Animated) */}
        <div className="flex items-center pl-4">
          {mounted ? (
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-all duration-200 hover:scale-105 active:scale-95 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/60"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-500 animate-in spin-in-90 duration-500" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 fill-slate-700/10 dark:text-amber-500 dark:fill-amber-500/20 animate-in spin-in-45 duration-500" />
              )}
            </Button>
          ) : (
            // Layout skeleton to prevent visual popping during mount
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
          )}
        </div>
      </header>

      {/* Main Dashboard Canvas Workspace */}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="min-h-[calc(100vh-12rem)] w-full rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 shadow-xl shadow-slate-200/30 dark:shadow-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}