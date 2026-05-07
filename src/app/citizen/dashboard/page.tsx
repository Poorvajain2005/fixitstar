"use client";

import React, {
  useState,
  useEffect,
  ReactNode,
} from "react";

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

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Skeleton,
} from "@/components/ui/skeleton";

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
  Radar,
  Activity,
} from "lucide-react";

import {
  format,
  formatDistanceToNowStrict,
} from "date-fns";

import {
  Issue,
  IssuePriority,
  IssueStatus,
  IssueType,
} from "@/types/issue";

import {
  allIssuesData,
} from "@/lib/mock-db";

import {
  getUserProfile,
  UserProfile,
} from "@/lib/mock-users";

const issueTypes: IssueType[] = [
  "Road",
  "Garbage",
  "Streetlight",
  "Park",
  "Other",
];

const priorities: IssuePriority[] = [
  "Low",
  "Medium",
  "High",
];

const statuses: IssueStatus[] = [
  "Pending",
  "In Progress",
  "Resolved",
];

const mockFetchIssues = async (
  userId: string
): Promise<Issue[]> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 500)
  );

  return [
    ...allIssuesData.filter(
      (issue) =>
        issue.reportedById === userId
    ),
  ].sort(
    (a, b) =>
      b.reportedAt - a.reportedAt
  );
};

const getStatusBadgeVariant = (
  status: IssueStatus
):
  | "default"
  | "secondary"
  | "outline"
  | "destructive" => {
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
):
  | "default"
  | "secondary"
  | "destructive"
  | "outline" => {
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

const getPriorityIcon = (
  priority: IssuePriority
): ReactNode => {
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
        <ShieldAlert
          className={`${className} text-primary-foreground`}
        />
      );

    case "Low":
      return (
        <ShieldAlert
          className={`${className} text-secondary-foreground`}
        />
      );

    default:
      return (
        <ShieldAlert
          className={className}
        />
      );
  }
};

const getStatusIcon = (
  status: IssueStatus
): ReactNode => {
  const className = "h-4 w-4";

  switch (status) {
    case "Pending":
      return (
        <Info
          className={`${className} text-muted-foreground`}
        />
      );

    case "In Progress":
      return (
        <LoaderCircle
          className={`${className} animate-spin text-primary`}
        />
      );

    case "Resolved":
      return (
        <CheckCircle
          className={`${className} text-emerald-500`}
        />
      );

    default:
      return (
        <Info
          className={`${className} text-muted-foreground`}
        />
      );
  }
};

export default function CitizenDashboardPage() {
  const [userEmail, setUserEmail] =
    useState<string | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(
      null
    );

  const [issues, setIssues] =
    useState<Issue[]>([]);

  const [filteredIssues, setFilteredIssues] =
    useState<Issue[]>([]);

  const [filterStatus, setFilterStatus] =
    useState<
      IssueStatus | "all"
    >("all");

  const [filterType, setFilterType] =
    useState<
      IssueType | "all"
    >("all");

  const [
    filterPriority,
    setFilterPriority,
  ] = useState<
    IssuePriority | "all"
  >("all");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedIssue, setSelectedIssue] =
    useState<Issue | null>(null);

  useEffect(() => {
    if (
      typeof window !==
      "undefined"
    ) {
      const email =
        localStorage.getItem(
          "citizenUserEmail"
        );

      setUserEmail(email);

      if (email) {
        const p =
          getUserProfile(email, "citizen");

        if (p) setProfile(p);
      }
    }
  }, []);

  const userId = userEmail;

  useEffect(() => {
    const loadIssues =
      async () => {
        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);

          const fetchedIssues =
            await mockFetchIssues(
              userId
            );

          setIssues(
            fetchedIssues
          );
        } catch (err) {
          console.error(err);

          setError(
            "Failed to load issues."
          );
        } finally {
          setLoading(false);
        }
      };

    loadIssues();
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    const interval =
      setInterval(async () => {
        if (!userId) return;

        try {
          const currentIssues =
            [
              ...allIssuesData.filter(
                (issue) =>
                  issue.reportedById ===
                  userId
              ),
            ].sort(
              (a, b) =>
                b.reportedAt -
                a.reportedAt
            );

          if (!isMounted) return;

          setIssues((prev) => {
            const hasChanged =
              currentIssues.length !==
                prev.length ||
              currentIssues.some(
                (
                  issue,
                  index
                ) => {
                  const existing =
                    prev[index];

                  return (
                    issue.id !==
                      existing?.id ||
                    issue.status !==
                      existing?.status ||
                    issue.priority !==
                      existing?.priority
                  );
                }
              );

            return hasChanged
              ? currentIssues
              : prev;
          });
        } catch (err) {
          console.error(err);
        }
      }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  useEffect(() => {
    let temp = [...issues];

    if (filterStatus !== "all") {
      temp = temp.filter(
        (issue) =>
          issue.status ===
          filterStatus
      );
    }

    if (filterType !== "all") {
      temp = temp.filter(
        (issue) =>
          issue.type ===
          filterType
      );
    }

    if (
      filterPriority !== "all"
    ) {
      temp = temp.filter(
        (issue) =>
          issue.priority ===
          filterPriority
      );
    }

    if (searchTerm) {
      const lower =
        searchTerm.toLowerCase();

      temp = temp.filter(
        (issue) =>
          issue.title
            .toLowerCase()
            .includes(lower) ||
          issue.description
            .toLowerCase()
            .includes(lower)
      );
    }

    setFilteredIssues(temp);
  }, [
    issues,
    filterStatus,
    filterType,
    filterPriority,
    searchTerm,
  ]);

  const totalReported =
    issues.length;

  const issuesResolved =
    issues.filter(
      (issue) =>
        issue.status ===
        "Resolved"
    ).length;

  const issuesInProgress =
    issues.filter(
      (issue) =>
        issue.status ===
        "In Progress"
    ).length;

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="rounded-[32px] border border-black/5 bg-white/80 p-10 shadow-xl backdrop-blur-2xl">
          <CardContent className="text-center">
            <h2 className="mb-3 text-2xl font-black">
              No Active Session
            </h2>

            <p className="mb-6 text-muted-foreground">
              Please login again
              to access your
              dashboard.
            </p>

            <Button asChild>
              <Link href="/login/citizen">
                Go To Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="ui-glass relative overflow-hidden rounded-[36px] p-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.04] via-transparent to-violet-500/[0.04]" />

        <div className="relative z-10">
          <Badge className="mb-5 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-blue-600">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Civic Dashboard
          </Badge>

          <h1 className="text-4xl font-black tracking-tight">
            Welcome back,
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {" "}
              {profile?.displayName ||
                userEmail}
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Monitor civic
            reports, track issue
            resolution workflows,
            and contribute to
            AI-assisted urban
            governance systems.
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

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            label:
              "Total Reports",
            value:
              totalReported,
            icon: (
              <ListChecks className="h-5 w-5" />
            ),
          },

          {
            label:
              "In Progress",
            value:
              issuesInProgress,
            icon: (
              <LoaderCircle className="h-5 w-5" />
            ),
          },

          {
            label:
              "Resolved",
            value:
              issuesResolved,
            icon: (
              <CheckCircle className="h-5 w-5" />
            ),
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="rounded-[28px] ui-interactive"
          >
            <CardContent className="flex items-center justify-between p-8">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.label}
                </p>
                <h2 className="mt-2 text-4xl font-black">
                  {item.value}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                {item.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FILTERS */}
      <Card className="rounded-[32px]">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              placeholder="Search issues..."
              value={
                searchTerm
              }
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="h-12 rounded-2xl"
            />

            <Select
              value={
                filterStatus
              }
              onValueChange={(
                value
              ) =>
                setFilterStatus(
                  value as any
                )
              }
            >
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Status
                </SelectItem>

                {statuses.map(
                  (status) => (
                    <SelectItem
                      key={
                        status
                      }
                      value={
                        status
                      }
                    >
                      {status}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={filterType}
              onValueChange={(
                value
              ) =>
                setFilterType(
                  value as any
                )
              }
            >
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Types
                </SelectItem>

                {issueTypes.map(
                  (type) => (
                    <SelectItem
                      key={type}
                      value={type}
                    >
                      {type}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={
                filterPriority
              }
              onValueChange={(
                value
              ) =>
                setFilterPriority(
                  value as any
                )
              }
            >
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Priority
                </SelectItem>

                {priorities.map(
                  (
                    priority
                  ) => (
                    <SelectItem
                      key={
                        priority
                      }
                      value={
                        priority
                      }
                    >
                      {
                        priority
                      }
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* LOADING */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(
            (item) => (
              <Skeleton
                key={item}
                className="h-[350px] rounded-[32px]"
              />
            )
          )}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />

          <AlertTitle>
            Error
          </AlertTitle>

          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* ISSUES */}
      {!loading &&
        filteredIssues.length >
          0 && (
          <Dialog
            onOpenChange={(
              open
            ) =>
              !open &&
              setSelectedIssue(
                null
              )
            }
          >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredIssues.map(
                (issue) => (
                  <DialogTrigger
                    key={issue.id}
                    asChild
                  >
                    <Card
                      onClick={() =>
                        setSelectedIssue(
                          issue
                        )
                      }
                      className="group relative cursor-pointer overflow-hidden rounded-[32px] ui-interactive hover:shadow-[0_20px_80px_rgba(59,130,246,0.12)]"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {issue.imageUrl ? (
                          <Image
                            src={
                              issue.imageUrl
                            }
                            alt={
                              issue.title
                            }
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-muted">
                            <ImageIcon className="h-14 w-14 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>

                      <CardContent className="space-y-4 p-6">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {issue.type}
                          </Badge>

                          <Badge
                            variant={getPriorityBadgeVariant(
                              issue.priority
                            )}
                          >
                            {
                              issue.priority
                            }
                          </Badge>
                        </div>

                        <div>
                          <h2 className="line-clamp-1 text-xl font-black">
                            {issue.title}
                          </h2>

                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {
                              issue.description
                            }
                          </p>
                        </div>

                        <div className="space-y-2 border-t pt-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />

                            <span className="line-clamp-1">
                              {issue
                                .location
                                .address ||
                                "Location unavailable"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />

                            {format(
                              new Date(
                                issue.reportedAt
                              ),
                              "MMM d, yyyy"
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                          <Badge
                            variant={getStatusBadgeVariant(
                              issue.status
                            )}
                            className="flex items-center gap-2"
                          >
                            {getStatusIcon(
                              issue.status
                            )}

                            {
                              issue.status
                            }
                          </Badge>

                          <span className="text-sm font-medium text-primary">
                            View Details →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                )
              )}
            </div>

            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[32px] border-slate-200/60 bg-white/80 backdrop-blur-lg dark:border-slate-800/50 dark:bg-slate-900/60 sm:max-w-[720px]">
              {selectedIssue && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-black">
                      {
                        selectedIssue.title
                      }
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="relative aspect-video overflow-hidden rounded-3xl">
                      {selectedIssue.imageUrl ? (
                        <Image
                          src={
                            selectedIssue.imageUrl
                          }
                          alt={
                            selectedIssue.title
                          }
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <ImageIcon className="h-20 w-20 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    <p className="rounded-2xl bg-muted/50 p-5 leading-relaxed">
                      {
                        selectedIssue.description
                      }
                    </p>

                    <div className="space-y-4 text-sm">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4" />

                        {selectedIssue
                          .location
                          .address ||
                          "Unknown"}
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4" />

                        {format(
                          new Date(
                            selectedIssue.reportedAt
                          ),
                          "PPP"
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
}