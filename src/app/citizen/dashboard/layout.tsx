"use client";

import React, { type ReactNode, Suspense } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import {
  FilePenLine,
  History,
  Sparkles,
  ShieldCheck,
  Activity,
  Radar,
} from "lucide-react";

export default function CitizenDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const citizenNavItems = [
    {
      href: "/citizen/dashboard/report",
      label: "Report Issue",
      icon: <FilePenLine className="h-4 w-4" />,
      isActive: pathname === "/citizen/dashboard/report",
    },
    {
      href: "/citizen/dashboard",
      label: "My Issues",
      icon: <History className="h-4 w-4" />,
      isActive: pathname === "/citizen/dashboard",
    },
  ];

  return (
    <div className="ui-shell relative min-h-screen overflow-hidden text-foreground bg-background">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-30 overflow-hidden">
        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* TOP LEFT GLOW */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl" />

        {/* BOTTOM RIGHT GLOW */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-3xl" />

        {/* CENTER GLOW */}
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* NAVBAR */}
      <Navbar
        navItems={citizenNavItems}
        userType="Citizen"
        sticky={false}
        className="border-0 bg-transparent shadow-none backdrop-blur-0"
      />

      {/* PAGE */}
      <motion.main
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
        className="relative z-10 px-4 pt-24 pb-10 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* TOP BAR */}
          <div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            {/* LEFT SIDE HEADER & BADGES */}
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl border border-black/5 dark:border-white/10 bg-gradient-to-br from-blue-500/20 to-violet-500/20 backdrop-blur-xl shadow-xl">
                  <Radar className="h-7 w-7 text-blue-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 backdrop-blur-xl">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-500">
                      Systems Operational
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 backdrop-blur-xl">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-semibold text-blue-500">
                      AI Governance Active
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl font-black tracking-tight md:text-3xl text-foreground">
                  Citizen Intelligence Dashboard
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  AI-powered civic reporting, geospatial monitoring, severity
                  analysis, and intelligent governance workflows.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE STATS GRID */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              {/* CARD: ACTIVE */}
              <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-2xl px-5 py-3 shadow-sm min-w-[120px]">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Activity className="h-3.5 w-3.5 text-blue-500" />
                  Active Reports
                </div>
                <div className="text-2xl font-black tracking-tight text-foreground">
                  128
                </div>
              </div>

              {/* CARD: RESOLVED */}
              <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-2xl px-5 py-3 shadow-sm min-w-[120px]">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Resolved
                </div>
                <div className="text-2xl font-black tracking-tight text-emerald-500">
                  94
                </div>
              </div>

              {/* CARD: ACCURACY */}
              <div className="col-span-2 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-2xl px-5 py-3 shadow-sm min-w-[120px] sm:col-span-1">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  AI Accuracy
                </div>
                <div className="text-2xl font-black tracking-tight text-violet-500">
                  97%
                </div>
              </div>
            </div>
          </div>

          {/* MAIN GLASS CONTAINER */}
          <div className="relative overflow-hidden rounded-[36px] border border-black/5 dark:border-white/10 bg-white/60 dark:bg-zinc-950/20 backdrop-blur-3xl shadow-xl">
            {/* INNER HIGHLIGHT OVERLAYS */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 dark:via-zinc-800 to-transparent" />

            {/* MAIN CHILDREN SLOTS */}
            <div className="relative z-10 p-4 md:p-8">
              <Suspense fallback={<div className="w-full h-[400px] flex items-center justify-center">Loading...</div>}>
                {children}
              </Suspense>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}