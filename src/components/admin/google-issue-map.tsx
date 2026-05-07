"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Issue } from "@/types/issue";
import { Badge } from "@/components/ui/badge";

interface GoogleIssueMapProps {
  issues: Issue[];
}

const GoogleIssueMap: React.FC<GoogleIssueMapProps> = ({ issues }) => {
  const [mounted, setMounted] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const validIssues = useMemo(
    () =>
      issues.filter(
        (issue) =>
          typeof issue.location?.latitude === "number" &&
          typeof issue.location?.longitude === "number"
      ),
    [issues]
  );

  const center: [number, number] =
    validIssues.length > 0
      ? [validIssues[0].location.latitude, validIssues[0].location.longitude]
      : [26.2183, 78.1828];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(center, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, [mounted, center]);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    validIssues.forEach((issue) => {
      const marker = L.marker([issue.location.latitude, issue.location.longitude]);
      marker.bindPopup(
        `<div><p style="font-weight:600;margin-bottom:4px;">${issue.title}</p><p style="font-size:12px;color:#64748b;">${issue.location.address || "Address not available"}</p></div>`
      );
      marker.addTo(markersRef.current!);
    });

    mapRef.current.setView(center, 13, { animate: false });
  }, [validIssues, center]);

  return (
    <div className="grid gap-4 p-4 md:grid-cols-[2fr_1fr]">
      <div className="h-[420px] overflow-hidden rounded-xl border border-border/70">
        {mounted ? (
          <div ref={mapContainerRef} className="h-full w-full" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Loading map...
          </div>
        )}
      </div>

      <div className="max-h-[420px] space-y-3 overflow-auto rounded-xl border border-border/70 bg-card/70 p-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Marked Issues ({validIssues.length})</h3>
        {validIssues.length > 0 ? (
          validIssues.map((issue) => (
            <div key={issue.id} className="rounded-lg border border-border/60 bg-background/70 p-3">
              <p className="line-clamp-1 font-medium">{issue.title}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline">{issue.type}</Badge>
                <Badge
                  variant={
                    issue.priority === "High"
                      ? "destructive"
                      : issue.priority === "Medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {issue.priority}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Reported: {format(new Date(issue.reportedAt), "MMM d, yyyy")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No issues available to display on the map.</p>
        )}
      </div>
    </div>
  );
};

export default GoogleIssueMap;
