"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Navbar,
} from "@/components/shared/navbar";

import {
  ListChecks,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

import {
  useTheme,
} from "next-themes";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  motion,
} from "framer-motion";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const {
    theme,
    setTheme,
  } = useTheme();

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const adminNavItems = [
    {
      href: "/admin/dashboard",

      label:
        "Manage Issues",

      icon: (
        <ListChecks className="h-4 w-4" />
      ),

      isActive:
        pathname ===
        "/admin/dashboard",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900 transition-colors duration-300 dark:bg-[#020617] dark:text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* TOP GLOW */}
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        {/* BOTTOM GLOW */}
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-[#020617]/70">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">
            {/* BRAND */}
            <motion.div
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.35,
              }}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-gradient-to-br from-blue-500/10 to-violet-500/10 shadow-lg dark:border-white/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  AI Governance
                </div>

                <div className="text-lg font-black tracking-tight">
                  Admin Dashboard
                </div>
              </div>
            </motion.div>

            {/* NAVBAR */}
            <Navbar
              navItems={
                adminNavItems
              }
              userType="Admin"
              sticky={false}
              className="border-0 bg-transparent shadow-none backdrop-blur-0"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* SYSTEM STATUS */}
            <Badge className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-600 md:flex dark:text-emerald-400">
              <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

              Systems Online
            </Badge>

            {/* SECURITY BADGE */}
            <Badge className="hidden rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-blue-600 lg:flex dark:text-blue-400">
              <ShieldCheck className="mr-2 h-4 w-4" />

              Secure Access
            </Badge>

            {/* THEME TOGGLE */}
            {mounted ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle Theme"
                onClick={() =>
                  setTheme(
                    theme ===
                      "dark"
                      ? "light"
                      : "dark"
                  )
                }
                className="h-11 w-11 rounded-2xl border border-black/5 bg-white/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {theme ===
                "dark" ? (
                  <Sun className="h-5 w-5 text-amber-400 transition-all duration-300" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700 transition-all duration-300 dark:text-slate-200" />
                )}
              </Button>
            ) : (
              <div className="h-11 w-11 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 px-4 py-8 md:px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="mx-auto max-w-7xl"
        >
          {/* DASHBOARD SHELL */}
          <div className="relative overflow-hidden rounded-[36px] border border-black/5 bg-white/70 backdrop-blur-2xl shadow-[0_10px_60px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
            {/* INNER GLOW */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-500/[0.03] dark:from-white/[0.03]" />

            {/* CONTENT */}
            <div className="relative z-10 min-h-[calc(100vh-10rem)] p-5 md:p-8">
              {children}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}