"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  MapPin,
  Tag,
  Calendar,
  Info,
  Filter,
  AlertCircle,
  LoaderCircle,
  CheckCircle,
  Image as ImageIcon,
  ShieldAlert,
  Clock,
  FilePenLine,
  Search,
  History,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { format, formatDistanceToNowStrict } from "date-fns";

import {
  Issue,
  IssuePriority,
  IssueStatus,
  IssueType,
} from "@/types/issue";

import { allIssuesData } from "@/lib/mock-db";
import { getUserProfile, UserProfile } from "@/lib/mock-users";
import SummaryCard from "@/components/shared/summary-card";

const issueTypes: IssueType[] = [
  "Road",
  "Garbage",
  "Streetlight",
  "Park",
  "Other",
];

const priorities: IssuePriority[] = ["Low", "Medium", "High"];

const statuses: IssueStatus[] = ["Pending", "In Progress", "Resolved"];

const mockFetchIssues = async (userId: string): Promise<Issue[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    ...allIssuesData.filter((issue) => issue.reportedById === userId),
  ].sort((a, b) => b.reportedAt - a.reportedAt);
};

const getStatusBadgeVariant = (
  status: IssueStatus
): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "Pending":
      return "secondary";
    case "In Progress":
      return "default";
    case "Resolved":
      return "outline";
    default:
      return "secondary";
  }
};

const getPriorityBadgeVariant = (
  priority: IssuePriority
): "default" | "secondary" | "destructive" | "outline" => {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "default";
    case "Low":
      return "secondary";
    default:
      return "outline";
  }
};

const getPriorityIcon = (priority: IssuePriority): ReactNode => {
  const className = "h-3 w-3";

  switch (priority) {
    case "High":
      return (
        <ShieldAlert
          className={`${className} text-destructive-foreground`}
        />
      );
    case "Medium":
      return (
        <ShieldAlert className={`${className} text-primary-foreground`} />
      );
    case "Low":
      return (
        <ShieldAlert
          className={`${className} text-secondary-foreground`}
        />
      );
    default:
      return <ShieldAlert className={className} />;
  }
};

const getStatusIcon = (status: IssueStatus): ReactNode => {
  const className = "h-4 w-4";

  switch (status) {
    case "Pending":
      return (
        <Info className={`${className} text-muted-foreground`} />
      );
    case "In Progress":
      return (
        <LoaderCircle
          className={`${className} animate-spin text-primary`}
        />
      );
    case "Resolved":
      return <CheckCircle className={`${className} text-emerald-500`} />;
    default:
      return (
        <Info className={`${className} text-muted-foreground`} />
      );
  }
};

export default function CitizenDashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [filterStatus, setFilterStatus] = useState<IssueStatus | "all">("all");
  const [filterType, setFilterType] = useState<IssueType | "all">("all");
  const [filterPriority, setFilterPriority] = useState<IssuePriority | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("citizenUserEmail");
      setUserEmail(email);

      if (email) {
        const p = getUserProfile(email, "citizen");
        if (p) setProfile(p);
      }
    }
  }, []);

  const userId = userEmail;

  // Initial load
  useEffect(() => {
    const loadIssues = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedIssues = await mockFetchIssues(userId);
        setIssues(fetchedIssues);
      } catch (err) {
        console.error(err);
        setError("Failed to load your reported issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, [userId]);

  // Robust live updates & changes polling
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(async () => {
      try {
        const currentIssues = [
          ...allIssuesData.filter((issue) => issue.reportedById === userId),
        ].sort((a, b) => b.reportedAt - a.reportedAt);

        setIssues((prev) => {
          const hasChanged =
            currentIssues.length !== prev.length ||
            currentIssues.some((issue, index) => {
              const existing = prev[index];
              return (
                issue.id !== existing?.id ||
                issue.status !== existing?.status ||
                issue.priority !== existing?.priority ||
                issue.dueDate !== existing?.dueDate
              );
            });

          if (hasChanged) {
            console.log("Detected changes in mock DB, updating citizen dashboard...");
            return currentIssues;
          }
          return prev;
        });
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  // Combined Filters Logic
  useEffect(() => {
    let temp = [...issues];

    if (filterStatus !== "all") {
      temp = temp.filter((issue) => issue.status === filterStatus);
    }

    if (filterType !== "all") {
      temp = temp.filter((issue) => issue.type === filterType);
    }

    if (filterPriority !== "all") {
      temp = temp.filter((issue) => issue.priority === filterPriority);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      temp = temp.filter(
        (issue) =>
          issue.title.toLowerCase().includes(lower) ||
          issue.description.toLowerCase().includes(lower) ||
          (issue.location.address &&
            issue.location.address.toLowerCase().includes(lower)) ||
          issue.type.toLowerCase().includes(lower) ||
          issue.id.toLowerCase().includes(lower)
      );
    }

    setFilteredIssues(temp);
  }, [issues, filterStatus, filterType, filterPriority, searchTerm]);

  const totalReported = issues.length;
  const issuesResolved = issues.filter((issue) => issue.status === "Resolved").length;
  const issuesInProgress = issues.filter((issue) => issue.status === "In Progress").length;

  const getImageHint = (type: IssueType): string => {
    switch (type) {
      case "Road":
        return "pothole road street damage crack";
      case "Garbage":
        return "trash bin waste overflow litter";
      case "Streetlight":
        return "street light lamp broken night dark";
      case "Park":
        return "park bench tree playground graffiti";
      case "Other":
        return "urban issue misc graffiti hazard";
      default:
        return "issue";
    }
  };

  const formatDueDate = (dueDate?: number, status?: IssueStatus): string => {
    if (!dueDate || status === "Resolved") return "";
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

    if (daysRemaining < 0) return "text-destructive font-medium";
    if (daysRemaining <= 2) return "text-orange-500 font-medium";
    return "text-muted-foreground";
  };

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="rounded-[32px] border border-black/5 bg-white/80 p-10 shadow-xl backdrop-blur-2xl">
          <CardContent className="text-center">
            <h2 className="mb-3 text-2xl font-black">No Active Session</h2>
            <p className="mb-6 text-muted-foreground">
              Please login again to access your dashboard.
            </p>
            <Button asChild>
              <Link href="/login/citizen">Go To Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO BANNER */}
      <div className="ui-glass relative overflow-hidden rounded-[36px] p-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.04] via-transparent to-violet-500/[0.04]" />
        <div className="relative z-10">
          <Badge className="mb-5 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-blue-600">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Civic Dashboard
          </Badge>
          <h1 className="text-4xl font-black tracking-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {profile?.displayName || userEmail}
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Monitor civic reports, track issue resolution workflows, and contribute to
            AI-assisted urban governance systems.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              asChild
              className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 shadow-xl shadow-blue-500/20"
            >
              <Link href="/citizen/dashboard/report">
                <FilePenLine className="mr-2 h-5 w-5" />
                Report New Issue
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* STATS IMPACT CARDS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground">Your Impact</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <SummaryCard
            title="Total Reports"
            value={totalReported}
            description="Thank you for your contributions!"
            imageUrl="https://picsum.photos/seed/impact1/100/100"
            imageHint="city building contribution"
            icon={<ListChecks className="h-5 w-5" />}
            isLoading={loading}
          />
          <SummaryCard
            title="In Progress"
            value={issuesInProgress}
            description="Being addressed by civic workers."
            imageUrl="https://picsum.photos/seed/impact2/100/100"
            imageHint="tools worker progress"
            icon={<LoaderCircle className="h-5 w-5 animate-spin" />}
            isLoading={loading}
          />
          <SummaryCard
            title="Resolved"
            value={issuesResolved}
            description="Successfully completed!"
            imageUrl="https://picsum.photos/seed/impact3/100/100"
            imageHint="checkmark success completed"
            icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
            isLoading={loading}
          />
        </div>
      </section>

      {/* FILTERS & SEARCH */}
      <Card className="rounded-[32px]">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 rounded-2xl pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as any)}
              >
                <SelectTrigger className="h-12 rounded-2xl w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value as any)}
              >
                <SelectTrigger className="h-12 rounded-2xl w-full">
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

            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Select
                value={filterPriority}
                onValueChange={(value) => setFilterPriority(value as any)}
              >
                <SelectTrigger className="h-12 rounded-2xl w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LOADING SKELETONS */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="overflow-hidden rounded-[32px]">
              <Skeleton className="h-[200px] w-full" />
              <CardContent className="space-y-4 p-6">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="space-y-2 border-t pt-4">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* NO ISSUES EMPTY STATE */}
      {!loading && !error && filteredIssues.length === 0 && (
        <Card className="rounded-[32px] text-center py-16 border-dashed bg-card">
          <CardContent>
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              {searchTerm || filterStatus !== "all" || filterType !== "all" || filterPriority !== "all"
                ? "No issues match your filter settings."
                : "You haven't reported any civic issues yet."}
            </p>
            {searchTerm || filterStatus !== "all" || filterType !== "all" || filterPriority !== "all" ? (
              <Button
                variant="outline"
                className="mt-4 rounded-xl"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterType("all");
                  setFilterPriority("all");
                }}
              >
                Reset All Filters
              </Button>
            ) : (
              <Button asChild className="mt-6 rounded-xl">
                <Link href="/citizen/dashboard/report">
                  <FilePenLine className="mr-2 h-4 w-4" /> Report Your First Issue
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* ISSUES GRID */}
      {!loading && !error && filteredIssues.length > 0 && (
        <Dialog onOpenChange={(open) => !open && setSelectedIssue(null)}>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredIssues.map((issue) => (
              <DialogTrigger key={issue.id} asChild>
                <Card
                  onClick={() => setSelectedIssue(issue)}
                  className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[32px] border border-slate-200/60 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 ui-interactive hover:shadow-[0_20px_80px_rgba(59,130,246,0.12)]"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden">
                      {issue.imageUrl ? (
                        <Image
                          src={issue.imageUrl}
                          alt={issue.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint={getImageHint(issue.type)}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <ImageIcon className="h-14 w-14 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {issue.type}
                        </Badge>

                        <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                          {issue.priority}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="line-clamp-1 text-xl font-black">{issue.title}</h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {issue.description}
                        </p>
                      </div>

                      <div className="space-y-2 border-t pt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" />
                          <span className="line-clamp-1">
                            {issue.location.address || "Location unavailable"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-primary" />
                          <span>
                            Reported: {format(new Date(issue.reportedAt), "MMM d, yyyy")}
                          </span>
                        </div>

                        {issue.dueDate && issue.status !== "Resolved" && (
                          <div
                            className={`flex items-center gap-2 ${getDueDateColorClass(
                              issue.dueDate,
                              issue.status
                            )}`}
                          >
                            <Clock className="h-4 w-4 shrink-0" />
                            <span>{formatDueDate(issue.dueDate, issue.status)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="flex items-center justify-between border-t p-6 bg-muted/20">
                    <Badge
                      variant={getStatusBadgeVariant(issue.status)}
                      className="flex items-center gap-2 py-1 px-2.5"
                    >
                      {getStatusIcon(issue.status)}
                      {issue.status}
                    </Badge>
                    <span className="text-sm font-semibold text-primary hover:underline">
                      View Details &rarr;
                    </span>
                  </CardFooter>
                </Card>
              </DialogTrigger>
            ))}
          </div>

          {/* DETAILED DIALOG MODAL */}
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[32px] border-slate-200/60 bg-white/80 backdrop-blur-lg dark:border-slate-800/50 dark:bg-slate-900/60 sm:max-w-[720px]">
            {selectedIssue ? (
              <>
                <DialogHeader className="pr-10">
                  <DialogTitle className="text-3xl font-black">
                    {selectedIssue.title}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-2 text-sm pt-2">
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4" /> {selectedIssue.type}
                    </Badge>
                    <Badge
                      variant={getPriorityBadgeVariant(selectedIssue.priority)}
                      className="flex items-center gap-1"
                    >
                      {getPriorityIcon(selectedIssue.priority)} {selectedIssue.priority} Priority
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="relative aspect-video overflow-hidden rounded-3xl bg-muted shadow-inner">
                    {selectedIssue.imageUrl ? (
                      <Image
                        src={selectedIssue.imageUrl}
                        alt={selectedIssue.title}
                        fill
                        className="object-cover"
                        data-ai-hint={getImageHint(selectedIssue.type)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <ImageIcon className="h-20 w-20 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  <p className="rounded-2xl bg-muted/50 p-5 leading-relaxed text-foreground">
                    {selectedIssue.description}
                  </p>

                  <div className="space-y-3 text-sm border-t pt-4">
                    <h4 className="font-bold text-foreground">Details:</h4>
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>
                        <strong>Location:</strong>{" "}
                        {selectedIssue.location.address ||
                          `${selectedIssue.location.latitude.toFixed(
                            5
                          )}, ${selectedIssue.location.longitude.toFixed(5)}`}
                      </span>
                    </p>

                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <span>
                        <strong>Reported At:</strong>{" "}
                        {format(new Date(selectedIssue.reportedAt), "MMM d, yyyy HH:mm")}
                      </span>
                    </p>

                    {selectedIssue.dueDate && (
                      <p
                        className={`flex items-center gap-2 ${getDueDateColorClass(
                          selectedIssue.dueDate,
                          selectedIssue.status
                        )}`}
                      >
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>
                          <strong>Expected Deadline:</strong>{" "}
                          {format(new Date(selectedIssue.dueDate), "MMM d, yyyy")}{" "}
                          {selectedIssue.status !== "Resolved"
                            ? `(${formatDueDate(selectedIssue.dueDate, selectedIssue.status)})`
                            : ""}
                        </span>
                      </p>
                    )}

                    {selectedIssue.resolvedAt && (
                      <p className="flex items-center gap-2 text-emerald-500">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>
                          <strong>Resolved At:</strong>{" "}
                          {format(new Date(selectedIssue.resolvedAt), "MMM d, yyyy HH:mm")}
                        </span>
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <span className="shrink-0">{getStatusIcon(selectedIssue.status)}</span>
                      <strong>Current Status:</strong>{" "}
                      <Badge variant={getStatusBadgeVariant(selectedIssue.status)} className="text-sm">
                        {selectedIssue.status}
                      </Badge>
                    </div>

                    {selectedIssue.adminNotes && (
                      <Alert className="mt-4 rounded-2xl bg-primary/[0.02]">
                        <Info className="h-4 w-4" />
                        <AlertTitle className="font-bold">Official Admin Notes</AlertTitle>
                        <AlertDescription>{selectedIssue.adminNotes}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="rounded-xl">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <LoaderCircle className="h-8 w-8 mx-auto animate-spin mb-4" />
                Loading issue details...
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}