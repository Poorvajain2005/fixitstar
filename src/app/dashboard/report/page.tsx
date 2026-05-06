"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Mock Data: FixIt issues (Inko aap database entries se query karke swap kar sakti hain)
const dummyIssues = [
  {
    id: "1",
    title: "Deep Pothole near Amity Highway",
    latitude: 26.2155,
    longitude: 78.1812,
    category: "Pothole",
    severity: 8,
  },
  {
    id: "2",
    title: "Uncollected Public Garbage Dump",
    latitude: 26.2210,
    longitude: 78.1925,
    category: "Garbage Pile",
    severity: 6,
  },
];

export default function ReportPage() {
  // Safe dynamic import to prevent "window is not defined" SSR errors
  const MapWithNoSSR = useMemo(
    () =>
      dynamic(() => import("@/components/shared/issue-map"), {
        loading: () => (
          <div className="w-full h-[450px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center border border-slate-200">
            <span className="text-sm font-medium text-slate-500">Loading Map View...</span>
          </div>
        ),
        ssr: false, // Disables server rendering
      }),
    []
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Civic Issues Hotspots</h1>
        <p className="text-sm text-slate-500">Real-time marked pothole and garbage detections.</p>
      </div>

      {/* Renders dynamic map safely without any hydration mismatch errors */}
      <MapWithNoSSR issues={dummyIssues} />
    </div>
  );
}