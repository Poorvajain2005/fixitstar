"use client";

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