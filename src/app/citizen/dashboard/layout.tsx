<<<<<<< HEAD
"use client";

import type { ReactNode } from "react";

import { Navbar } from "@/components/shared/navbar";

import {
  FilePenLine,
  History,
  Sparkles,
  ShieldCheck,
  Activity,
  Radar,
} from "lucide-react";

import { usePathname } from "next/navigation";

import { motion } from "framer-motion";
=======

"use client"; // Required for using hooks like usePathname

import { Navbar } from "@/components/shared/navbar";
import { FilePenLine, History } from 'lucide-react'; // Import icons for nav items
import { usePathname } from 'next/navigation'; // Import usePathname
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc

export default function CitizenDashboardLayout({
  children,
}: {
<<<<<<< HEAD
  children: ReactNode;
}) {
  const pathname = usePathname();

  const citizenNavItems = [
    {
      href: "/citizen/dashboard/report",
      label: "Report Issue",
      icon: <FilePenLine className="h-4 w-4" />,
      isActive:
        pathname === "/citizen/dashboard/report",
    },

    {
      href: "/citizen/dashboard",
      label: "My Issues",
      icon: <History className="h-4 w-4" />,
      isActive:
        pathname === "/citizen/dashboard",
    },
  ];

  return (
    <div className="ui-shell relative min-h-screen overflow-hidden text-foreground">
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
            {/* LEFT */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-violet-500/20 backdrop-blur-xl shadow-xl">
                  <Radar className="h-7 w-7 text-primary" />
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

                <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                  Citizen Intelligence Dashboard
                </h1>

                <p className="mt-1 max-w-2xl text-muted-foreground">
                  AI-powered civic reporting,
                  geospatial monitoring,
                  severity analysis, and
                  intelligent governance
                  workflows.
                </p>
              </div>
            </div>

            {/* RIGHT METRICS */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {/* CARD */}
              <div className="ui-glass rounded-2xl px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" />
                  Active Reports
                </div>

                <div className="text-2xl font-black tracking-tight">
                  128
                </div>
              </div>

              {/* CARD */}
              <div className="ui-glass rounded-2xl px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Resolved
                </div>

                <div className="text-2xl font-black tracking-tight text-emerald-500">
                  94
                </div>
              </div>

              {/* CARD */}
              <div className="ui-glass col-span-2 rounded-2xl px-4 py-3 md:col-span-1">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Accuracy
                </div>

                <div className="text-2xl font-black tracking-tight text-blue-500">
                  97%
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTAINER */}
          <div className="ui-glass relative overflow-hidden rounded-[36px]">
            {/* INNER OVERLAY */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />

            {/* TOP HIGHLIGHT */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* CONTENT */}
            <div className="relative z-10 p-4 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
=======
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get current path

  const citizenNavItems = [
    { href: "/citizen/dashboard/report", label: "Report Issue", icon: <FilePenLine className="h-4 w-4" />, isActive: pathname === "/citizen/dashboard/report" },
    { href: "/citizen/dashboard", label: "My Issues", icon: <History className="h-4 w-4" />, isActive: pathname === "/citizen/dashboard" },
    // The profile link is handled by the dropdown in the Navbar now.
    // Keeping this structure allows adding more main nav links easily if needed later.
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[url('https://picsum.photos/seed/citizenbg/1920/1080')] bg-cover bg-center bg-fixed">
      {/* Pass isActive status to Navbar */}
      <Navbar navItems={citizenNavItems} userType="Citizen" />
       {/* Added semi-transparent background, backdrop blur, padding, rounded corners, and shadow to main content area */}
       <main className="flex-1 container mx-auto px-4 py-8 bg-background/90 backdrop-blur-sm my-6 rounded-lg shadow-xl">
        {children}
      </main>
    </div>
  );
}
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
