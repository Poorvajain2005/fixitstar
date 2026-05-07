"use client";

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