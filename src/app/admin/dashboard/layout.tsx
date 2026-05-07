"use client";

<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { ListChecks, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  const pathname =
    usePathname();

  const {
    theme,
    setTheme,
  } = useTheme();

  const [mounted, setMounted] =
    useState(false);

=======
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent server hydration mismatch
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
  useEffect(() => {
    setMounted(true);
  }, []);

  const adminNavItems = [
    {
      href: "/admin/dashboard",
<<<<<<< HEAD

      label:
        "Manage Issues",

      icon: (
        <ListChecks className="h-4 w-4" />
      ),

      isActive:
        pathname ===
        "/admin/dashboard",
=======
      label: "Manage Issues",
      icon: <ListChecks className="h-4 w-4" />,
      isActive: pathname === "/admin/dashboard",
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
    },
  ];

  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
      </main>
    </div>
  );
}