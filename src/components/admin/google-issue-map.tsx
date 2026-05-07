"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Issue } from "@/types/issue";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Eye } from "lucide-react";

interface GoogleIssueMapProps {
  issues: Issue[];
}

// Custom priority-based SVG marker generator
const createCustomIcon = (priority: string) => {
  let color = "#10b981"; // Low (Green)
  if (priority === "High") color = "#ef4444"; // High (Red)
  else if (priority === "Medium") color = "#f97316"; // Medium (Orange)

  return L.divIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-md border-2" style="border-color: ${color}">
        <span class="w-3.5 h-3.5 rounded-full" style="background-color: ${color}"></span>
      </div>
    `,
    className: "custom-leaflet-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const GoogleIssueMap: React.FC<GoogleIssueMapProps> = ({ issues }) => {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const individualMarkers = useRef<{ [key: string]: L.Marker }>({});

  // 1. Process valid coordinate pairs
  const validIssues = useMemo(
    () =>
      issues.filter(
        (issue) =>
          typeof issue.location?.latitude === "number" &&
          typeof issue.location?.longitude === "number"
      ),
    [issues]
  );

  // 2. Local fuzzy search filtration
  const filteredIssues = useMemo(() => {
    return validIssues.filter((issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.location.address && issue.location.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      issue.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [validIssues, searchQuery]);

  const center: [number, number] =
    validIssues.length > 0
      ? [validIssues[0].location.latitude, validIssues[0].location.longitude]
      : [26.2183, 78.1828]; // Fallback to center coordinates

  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. Initialize Leaflet Map Instance
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

  // 4. Handle Markers & Custom Priorities
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();
    individualMarkers.current = {};

    filteredIssues.forEach((issue) => {
      const customIcon = createCustomIcon(issue.priority);
      const marker = L.marker([issue.location.latitude, issue.location.longitude], {
        icon: customIcon,
      });

      marker.bindPopup(`
        <div class="p-1 max-w-[200px]">
          <p class="font-bold text-slate-900 dark:text-white m-0 leading-tight mb-1">${issue.title}</p>
          <span class="inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 mb-2">${issue.type}</span>
          <p class="text-xs text-slate-500 dark:text-slate-400 m-0 leading-snug">${issue.location.address || "Address not available"}</p>
        </div>
      `);

      marker.addTo(markersRef.current!);
      individualMarkers.current[issue.id] = marker; // Store reference for interactive fly-to triggers
    });
  }, [filteredIssues]);

  // 5. Smooth fly-to function for side-panel integration
  const handleFocusIssue = (issue: Issue) => {
    if (!mapRef.current) return;

    setSelectedIssueId(issue.id);
    mapRef.current.flyTo([issue.location.latitude, issue.location.longitude], 15, {
      animate: true,
      duration: 1.5,
    });

    const targetMarker = individualMarkers.current[issue.id];
    if (targetMarker) {
      setTimeout(() => {
        targetMarker.openPopup();
      }, 1400); // Wait for the fly animation to finalize before rendering popup
    }
  };

  return (
    <div className="grid gap-4 p-4 md:grid-cols-[2fr_1fr]">
      {/* MAP VIEW PORT */}
      <div className="relative h-[480px] overflow-hidden rounded-2xl border border-border/70 shadow-sm">
        {mounted ? (
          <div ref={mapContainerRef} className="h-full w-full z-10" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground bg-muted/20">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p>Loading Interactive Map Layer...</p>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED ISSUES PANEL WITH CONTROLS */}
      <div className="flex flex-col max-h-[480px] rounded-2xl border border-border/70 bg-card/50 backdrop-blur-md overflow-hidden shadow-sm">
        {/* Local Search Component */}
        <div className="p-3 border-b border-border/60 bg-card">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search map markers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-background/50 border-border/60"
            />
          </div>
        </div>

        {/* Dynamic Issue Feed List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Hotspots List ({filteredIssues.length})
            </h3>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="text-xs text-primary font-medium hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => handleFocusIssue(issue)}
                className={`group relative rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                  selectedIssueId === issue.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60 bg-background/60 hover:bg-background hover:shadow-xs hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {issue.title}
                  </p>
                  <Eye className="h-4 w-4 opacity-0 group-hover:opacity-60 transition-opacity text-muted-foreground shrink-0" />
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[10px] px-2 py-0">
                    {issue.type}
                  </Badge>
                  <Badge
                    variant={
                      issue.priority === "High"
                        ? "destructive"
                        : issue.priority === "Medium"
                          ? "default"
                          : "secondary"
                    }
                    className="text-[10px] px-2 py-0"
                  >
                    {issue.priority}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 max-w-[65%] truncate">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {issue.location.address || "No Address Saved"}
                  </span>
                  <span>
                    {format(new Date(issue.reportedAt), "MMM d")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">No matches found</p>
              <p className="text-xs text-muted-foreground/80 mt-1">Try refining search parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleIssueMap;