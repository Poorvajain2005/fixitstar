"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { format, formatDistanceToNowStrict } from "date-fns";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Types & Mock DB
import { Issue, IssuePriority, IssueStatus, IssueType } from "@/types/issue";
import {
  allIssuesData,
  updateIssueStatusInDb,
  updateIssuePriorityInDb,
  deleteIssueFromDb,
} from "@/lib/mock-db";

// Icons
import {
  Search,
  Sparkles,
  ShieldAlert,
  LoaderCircle,
  CheckCircle,
  Info,
  Calendar,
  MapPin,
  Eye,
  Tag,
  BarChart3,
  Clock3,
  AlertCircle,
  ImageIcon,
  Trash2,
  User,
  Map,
} from "lucide-react";

// Dynamically import Google Maps components with SSR disabled
const GoogleIssueMap = dynamic(
  () => import("@/components/admin/google-issue-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[450px] items-center justify-center rounded-[32px] border border-black/5 bg-white/80 backdrop-blur-2xl">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  }
);

const priorities: IssuePriority[] = ["Low", "Medium", "High"];
const issueTypes: IssueType[] = ["Road", "Garbage", "Streetlight", "Park", "Other"];
const statuses: IssueStatus[] = ["Pending", "In Progress", "Resolved"];

// Mock data fetching function - returns sorted issues
const mockFetchAllIssues = async (): Promise<Issue[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...allIssuesData].sort((a, b) => {
    // Resolved issues go last
    if (a.status === "Resolved" && b.status !== "Resolved") return 1;
    if (a.status !== "Resolved" && b.status === "Resolved") return -1;

    // Sort by priority (High first)
    const priorityOrder: Record<IssuePriority, number> = { High: 1, Medium: 2, Low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Sort by due date (soonest first, N/A last within priority)
    const dueDateA = a.dueDate || Infinity;
    const dueDateB = b.dueDate || Infinity;
    if (dueDateA !== dueDateB) return dueDateA - dueDateB;

    // Finally, sort by reported date (newest first)
    return b.reportedAt - a.reportedAt;
  });
};

// Badges & Color Helpers
const getPriorityBadgeClass = (priority: IssuePriority): string => {
  switch (priority) {
    case "High":
      return "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    case "Medium":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "Low":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-600";
  }
};

const getStatusBadgeClass = (status: IssueStatus): string => {
  switch (status) {
    case "Pending":
      return "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400";
    case "In Progress":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "Resolved":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-600";
  }
};

const formatDueDate = (dueDate?: number, status?: IssueStatus): string => {
  if (!dueDate || status === "Resolved") return "N/A";
  const now = Date.now();
  if (now > dueDate) {
    return `Overdue by ${formatDistanceToNowStrict(dueDate, { addSuffix: false })}`;
  }
  return `Due in ${formatDistanceToNowStrict(dueDate, { addSuffix: false })}`;
};

const getDueDateColorClass = (dueDate?: number, status?: IssueStatus): string => {
  if (!dueDate || status === "Resolved") return "text-muted-foreground";
  const now = Date.now();
  const daysRemaining = (dueDate - now) / (1000 * 60 * 60 * 24);
  if (daysRemaining < 0) return "text-red-500 font-semibold";
  if (daysRemaining <= 2) return "text-amber-500 font-medium";
  return "text-muted-foreground";
};

export default function AdminDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<IssueStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<IssuePriority | "all">("all");
  const [filterType, setFilterType] = useState<IssueType | "all">("all");

  // Load Actions
  const [updatingIssueId, setUpdatingIssueId] = useState<string | null>(null);
  const [deletingIssueId, setDeletingIssueId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initial Fetch
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await mockFetchAllIssues();
        setIssues(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load issues.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Sync Database Updates
  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const current = await mockFetchAllIssues();
        if (!isMounted) return;

        setIssues((prev) => {
          const same = JSON.stringify(prev) === JSON.stringify(current);
          return same ? prev : current;
        });
      } catch (err) {
        console.error(err);
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Filter Pipeline
  useEffect(() => {
    let temp = [...issues];

    if (filterStatus !== "all") {
      temp = temp.filter((issue) => issue.status === filterStatus);
    }
    if (filterPriority !== "all") {
      temp = temp.filter((issue) => issue.priority === filterPriority);
    }
    if (filterType !== "all") {
      temp = temp.filter((issue) => issue.type === filterType);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      temp = temp.filter(
        (issue) =>
          issue.title.toLowerCase().includes(lower) ||
          issue.description.toLowerCase().includes(lower) ||
          issue.id.toLowerCase().includes(lower) ||
          (issue.location.address && issue.location.address.toLowerCase().includes(lower)) ||
          issue.reportedById.toLowerCase().includes(lower)
      );
    }

    setFilteredIssues(temp);
  }, [issues, searchTerm, filterStatus, filterPriority, filterType]);

  // Metric Calculation
  const totalIssues = issues.length;
  const totalPending = issues.filter((i) => i.status === "Pending").length;
  const totalProgress = issues.filter((i) => i.status === "In Progress").length;
  const totalResolved = issues.filter((i) => i.status === "Resolved").length;

  // Handlers
  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    setUpdatingIssueId(issueId);
    try {
      updateIssueStatusInDb(issueId, newStatus);
      const updated = await mockFetchAllIssues();
      setIssues(updated);

      if (selectedIssue && selectedIssue.id === issueId) {
        const currentSelected = updated.find((i) => i.id === issueId);
        setSelectedIssue(currentSelected || null);
      }

      toast({
        title: "Status Updated",
        description: `Issue marked as ${newStatus}`,
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Could not update status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingIssueId(null);
    }
  };

  const handlePriorityChange = async (issueId: string, newPriority: IssuePriority) => {
    setUpdatingIssueId(issueId);
    try {
      updateIssuePriorityInDb(issueId, newPriority);
      const updated = await mockFetchAllIssues();
      setIssues(updated);

      if (selectedIssue && selectedIssue.id === issueId) {
        const currentSelected = updated.find((i) => i.id === issueId);
        setSelectedIssue(currentSelected || null);
      }

      toast({
        title: "Priority Updated",
        description: `Priority changed to ${newPriority}`,
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Could not update priority.",
        variant: "destructive",
      });
    } finally {
      setUpdatingIssueId(null);
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    setDeletingIssueId(issueId);
    try {
      const success = deleteIssueFromDb(issueId);
      if (!success) throw new Error("Issue not found.");
      const updated = await mockFetchAllIssues();
      setIssues(updated);

      toast({
        title: "Issue Deleted",
        description: "The issue record has been removed successfully.",
      });

      setDialogOpen(false);
      setSelectedIssue(null);
    } catch (err: any) {
      toast({
        title: "Deletion Failed",
        description: err.message || "Could not delete issue.",
        variant: "destructive",
      });
    } finally {
      setDeletingIssueId(null);
    }
  };

  const stopPropagation = (e: React.MouseEvent | React.FocusEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative space-y-10">
      {/* HERO BANNER */}
      <div className="ui-glass relative overflow-hidden rounded-[36px] p-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.05] via-transparent to-violet-500/[0.05]" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="mb-5 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-blue-600">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Governance Center
            </Badge>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Civic Operations Dashboard
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Monitor civic infrastructure issues, manage AI prioritization, and coordinate urban
              governance workflows in real time.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-semibold text-emerald-600">Systems Online</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">AI Monitoring Active</div>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Issues",
            value: totalIssues,
            icon: <BarChart3 className="h-6 w-6" />,
          },
          {
            label: "Pending",
            value: totalPending,
            icon: <Info className="h-6 w-6" />,
          },
          {
            label: "In Progress",
            value: totalProgress,
            icon: <LoaderCircle className="h-6 w-6 animate-spin" />,
          },
          {
            label: "Resolved",
            value: totalResolved,
            icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="relative overflow-hidden rounded-[32px] ui-interactive"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-500/[0.03]" />
            <CardContent className="relative z-10 flex items-center justify-between p-8">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <h2 className="mt-2 text-4xl font-black">{item.value}</h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                {item.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* INTERACTIVE MAP CONTAINER */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black">Issue Map View</h2>
          <Button variant="outline" className="rounded-full" onClick={() => setIsMapVisible(!isMapVisible)}>
            <Map className="mr-2 h-4 w-4" />
            {isMapVisible ? "Hide Map" : "Show Map"}
          </Button>
        </div>
        {isMapVisible && (
          <Card className="overflow-hidden rounded-[32px]">
            <CardContent className="p-0">
              <GoogleIssueMap issues={filteredIssues} />
            </CardContent>
          </Card>
        )}
      </section>

      {/* FILTERS PANEL */}
      <Card className="rounded-[32px]">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search issues, reporter or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 rounded-2xl pl-10"
              />
            </div>

            <Select
              value={filterStatus}
              onValueChange={(val) => setFilterStatus(val as any)}
            >
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterPriority}
              onValueChange={(val) => setFilterPriority(val as any)}
            >
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={(val) => setFilterType(val as any)}>
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {issueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* MAIN DATA TABLE */}
      <Card className="overflow-hidden rounded-[32px]">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/50 bg-slate-50/70 dark:border-slate-700/50 dark:bg-slate-900/40">
                  <TableHead className="pl-6">Issue</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Target Due Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      No matching civic operations issues located.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow
                      key={issue.id}
                      className={`transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/40 cursor-pointer ${
                        updatingIssueId === issue.id || deletingIssueId === issue.id
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedIssue(issue);
                        setDialogOpen(true);
                      }}
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-muted">
                            {issue.imageUrl ? (
                              <Image
                                src={issue.imageUrl}
                                alt={issue.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="font-semibold">{issue.title}</div>
                            <div className="line-clamp-1 max-w-[220px] text-xs text-muted-foreground">
                              {issue.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="rounded-full">
                          <Tag className="mr-1 h-3 w-3" />
                          {issue.type}
                        </Badge>
                      </TableCell>

                      <TableCell onClick={stopPropagation}>
                        <Select
                          value={issue.priority}
                          onValueChange={(val: IssuePriority) =>
                            handlePriorityChange(issue.id, val)
                          }
                          disabled={updatingIssueId === issue.id}
                        >
                          <SelectTrigger
                            className={`h-9 w-[110px] rounded-xl border-0 focus:ring-0 ${getPriorityBadgeClass(
                              issue.priority
                            )}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell>
                        <div
                          className={`text-xs flex items-center gap-1.5 ${getDueDateColorClass(
                            issue.dueDate,
                            issue.status
                          )}`}
                        >
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDueDate(issue.dueDate, issue.status)}
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                        <MapPin className="inline mr-1 h-3.5 w-3.5 text-primary" />
                        {issue.location.address || "Geo Coordinates Registered"}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex flex-col">
                          <span className="font-medium flex items-center gap-1 text-slate-800 dark:text-slate-300">
                            <User className="h-3 w-3" /> {issue.reportedById}
                          </span>
                          <span>{format(new Date(issue.reportedAt), "MMM d, yyyy")}</span>
                        </div>
                      </TableCell>

                      <TableCell onClick={stopPropagation}>
                        <Select
                          value={issue.status}
                          onValueChange={(val: IssueStatus) =>
                            handleStatusChange(issue.id, val)
                          }
                          disabled={updatingIssueId === issue.id}
                        >
                          <SelectTrigger
                            className={`h-9 w-[130px] rounded-xl border-0 focus:ring-0 ${getStatusBadgeClass(
                              issue.status
                            )}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="text-right pr-6" onClick={stopPropagation}>
                        <div className="flex items-center justify-end gap-1">
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-xl h-9 w-9"
                                  onClick={() => {
                                    setSelectedIssue(issue);
                                    setDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Inspect Issue</TooltipContent>
                            </Tooltip>

                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="rounded-xl h-9 w-9 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                                      disabled={deletingIssueId === issue.id}
                                    >
                                      {deletingIssueId === issue.id ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>Delete Ticket</TooltipContent>
                              </Tooltip>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will permanently delete the ticket: &quot;
                                    {issue.title}&quot;. This action cannot be reversed.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteIssue(issue.id)}
                                    className="bg-rose-500 text-white hover:bg-rose-600"
                                  >
                                    Confirm Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DETAILED DIALOG VISUALIZER */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-[32px] border-slate-200/60 bg-white/85 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/85 sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
          {selectedIssue && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-black">{selectedIssue.title}</DialogTitle>
                <DialogDescription asChild>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Badge variant="outline" className="rounded-full">
                      <Tag className="mr-1 h-3.5 w-3.5 text-primary" /> {selectedIssue.type}
                    </Badge>
                    <Badge className={`rounded-full border ${getPriorityBadgeClass(selectedIssue.priority)}`}>
                      <ShieldAlert className="mr-1 h-3.5 w-3.5" /> {selectedIssue.priority} Priority
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="relative aspect-video overflow-hidden rounded-3xl border border-black/5">
                  {selectedIssue.imageUrl ? (
                    <Image
                      src={selectedIssue.imageUrl}
                      alt={selectedIssue.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-muted">
                      <ImageIcon className="h-16 w-16 text-muted-foreground/40 mb-2" />
                      <span className="text-sm text-muted-foreground">No imagery payload included</span>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-5 leading-relaxed border border-slate-200/40 dark:border-slate-800/40 text-slate-700 dark:text-slate-300">
                  {selectedIssue.description}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-sm border-t pt-5 border-slate-200/50">
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Location: </strong>
                        {selectedIssue.location.address ||
                          `${selectedIssue.location.latitude.toFixed(5)}, ${selectedIssue.location.longitude.toFixed(5)}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                      <User className="h-4 w-4 text-primary" />
                      <span>
                        <strong className="text-foreground">Reporter ID: </strong>
                        {selectedIssue.reportedById}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        <strong className="text-foreground">Reported: </strong>
                        {format(new Date(selectedIssue.reportedAt), "PPP p")}
                      </span>
                    </div>

                    {selectedIssue.dueDate && (
                      <div
                        className={`flex items-center gap-3 ${getDueDateColorClass(
                          selectedIssue.dueDate,
                          selectedIssue.status
                        )}`}
                      >
                        <Clock3 className="h-4 w-4" />
                        <span>
                          <strong className="text-foreground">Expected By: </strong>
                          {format(new Date(selectedIssue.dueDate), "MMMM d, yyyy")}{" "}
                          {selectedIssue.status !== "Resolved" &&
                            `(${formatDueDate(selectedIssue.dueDate, selectedIssue.status)})`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* RESOLUTION TIME */}
                {selectedIssue.resolvedAt && (
                  <div className="flex items-center gap-3 text-emerald-600 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-sm">
                    <CheckCircle className="h-5 w-5" />
                    <span>
                      <strong>Resolved On:</strong>{" "}
                      {format(new Date(selectedIssue.resolvedAt), "PPP p")}
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4 sm:justify-between items-center gap-3 border-t border-slate-200/50 pt-5">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select
                    value={selectedIssue.status}
                    onValueChange={(newStatus: IssueStatus) =>
                      handleStatusChange(selectedIssue.id, newStatus)
                    }
                    disabled={updatingIssueId === selectedIssue.id}
                  >
                    <SelectTrigger className="w-full sm:w-[150px] h-10 rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedIssue.priority}
                    onValueChange={(newPriority: IssuePriority) =>
                      handlePriorityChange(selectedIssue.id, newPriority)
                    }
                    disabled={updatingIssueId === selectedIssue.id}
                  >
                    <SelectTrigger className="w-full sm:w-[130px] h-10 rounded-xl">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 w-full sm:w-auto sm:justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="rounded-xl h-10 w-full sm:w-auto">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Ticket
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Permanent Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to permanently delete the ticket: &quot;
                          {selectedIssue.title}&quot;? This action is immediate and absolute.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteIssue(selectedIssue.id)}
                          className="bg-rose-500 text-white hover:bg-rose-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="rounded-xl h-10 w-full sm:w-auto">
                      Close Visualizer
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}