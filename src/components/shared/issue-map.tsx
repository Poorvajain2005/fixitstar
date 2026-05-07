"use client";

import { useEffect, useState } from "react";

export default function IssueMap({ issues }: { issues: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] min-h-[400px] rounded-xl bg-slate-800 animate-pulse flex items-center justify-center border border-slate-700">
        <span className="text-sm font-medium text-slate-400">Loading Map Container...</span>
      </div>
    );
  }

  const firstIssue = issues?.[0];
  let queryLocation = "Gwalior, Madhya Pradesh";

  if (firstIssue) {
    if (firstIssue.location?.address) {
      queryLocation = firstIssue.location.address;
    } else if (firstIssue.location?.latitude && firstIssue.location?.longitude) {
      queryLocation = `${firstIssue.location.latitude},${firstIssue.location.longitude}`;
    } else if (firstIssue.latitude && firstIssue.longitude) {
      queryLocation = `${firstIssue.latitude},${firstIssue.longitude}`;
    }
  }

  const encodedLocation = encodeURIComponent(queryLocation);

  return (
    <div className="w-full h-[400px] min-h-[400px] rounded-xl overflow-hidden relative border border-slate-700 bg-slate-900 z-10">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${encodedLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
      />
    </div>
  );
}
