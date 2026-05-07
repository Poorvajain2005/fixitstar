"use client";

<<<<<<< HEAD
import dynamic from "next/dynamic";

// Dynamically import Leaflet map
// Prevents SSR crash in Next.js

const MapWithNoSSR = dynamic(
  () =>
    import(
      "@/components/shared/issue-map"
    ),

  {
    ssr: false,

    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="text-sm font-medium text-muted-foreground">
            Loading AI Heatmap...
          </p>
        </div>
      </div>
    ),
  }
);

export default MapWithNoSSR;
=======
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";

// ❌ Direct import ko delete karo:
// import IssueMap from "@/components/shared/issue-map";

// ✅ Is dynamic import ko copy-paste karo (Saves layout from SSR crash):
const MapWithNoSSR = useMemo(
  () =>
    dynamic(() => import("@/components/shared/issue-map"), {
      loading: () => (
        <div className="w-full h-[400px] bg-slate-800 animate-pulse rounded-xl flex items-center justify-center border border-slate-700">
          <span className="text-sm font-medium text-slate-400">Loading Hotspots Map...</span>
        </div>
      ),
      ssr: false, // Disables server-side rendering entirely for Leaflet
    }),
  []
);
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
