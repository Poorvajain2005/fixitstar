"use client";

import React, {
  useEffect,
  useState,
} from "react";

import dynamic from "next/dynamic";

import Image from "next/image";

import {
  format,
  formatDistanceToNowStrict,
} from "date-fns";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

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
} from "@/components/ui/dialog";

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
  useToast,
} from "@/hooks/use-toast";

import {
  Issue,
  IssuePriority,
  IssueStatus,
  IssueType,
} from "@/types/issue";

import {
  allIssuesData,
  updateIssueStatusInDb,
  updateIssuePriorityInDb,
} from "@/lib/mock-db";

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
  Activity,
  Radar,
  Clock3,
  AlertCircle,
  ImageIcon,
} from "lucide-react";

const GoogleIssueMap = dynamic(
  () =>
    import(
      "@/components/admin/google-issue-map"
    ),
  {
    ssr: false,

    loading: () => (
      <div className="flex h-[450px] items-center justify-center rounded-[32px] border border-black/5 bg-white/80 backdrop-blur-2xl">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  }
);

const priorities: IssuePriority[] =
  [
    "Low",
    "Medium",
    "High",
  ];

const issueTypes: IssueType[] =
  [
    "Road",
    "Garbage",
    "Streetlight",
    "Park",
    "Other",
  ];

const statuses: IssueStatus[] = [
  "Pending",
  "In Progress",
  "Resolved",
];

const mockFetchAllIssues =
  async (): Promise<Issue[]> => {
    await new Promise(
      (resolve) =>
        setTimeout(resolve, 500)
    );

    return [...allIssuesData];
  };

export default function AdminDashboardPage() {
  const [issues, setIssues] =
    useState<Issue[]>([]);

  const [
    filteredIssues,
    setFilteredIssues,
  ] = useState<Issue[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedIssue, setSelectedIssue] =
    useState<Issue | null>(null);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState<
      IssueStatus | "all"
    >("all");

  const [filterPriority, setFilterPriority] =
    useState<
      IssuePriority | "all"
    >("all");

  const [filterType, setFilterType] =
    useState<
      IssueType | "all"
    >("all");

  const [error, setError] =
    useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const load =
      async () => {
        try {
          setLoading(true);

          const data =
            await mockFetchAllIssues();

          setIssues(data);
        } catch (err) {
          console.error(err);

          setError(
            "Failed to load issues."
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const interval =
      setInterval(async () => {
        try {
          const current =
            await mockFetchAllIssues();

          if (!isMounted) return;

          setIssues((prev) => {
            const same =
              JSON.stringify(
                prev
              ) ===
              JSON.stringify(
                current
              );

            return same
              ? prev
              : current;
          });
        } catch (err) {
          console.error(err);
        }
      }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let temp = [...issues];

    if (filterStatus !== "all") {
      temp = temp.filter(
        (issue) =>
          issue.status ===
          filterStatus
      );
    }

    if (filterPriority !== "all") {
      temp = temp.filter(
        (issue) =>
          issue.priority ===
          filterPriority
      );
    }

    if (filterType !== "all") {
      temp = temp.filter(
        (issue) =>
          issue.type ===
          filterType
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
    searchTerm,
    filterStatus,
    filterPriority,
    filterType,
  ]);

  const totalIssues =
    issues.length;

  const totalPending =
    issues.filter(
      (i) =>
        i.status === "Pending"
    ).length;

  const totalProgress =
    issues.filter(
      (i) =>
        i.status ===
        "In Progress"
    ).length;

  const totalResolved =
    issues.filter(
      (i) =>
        i.status ===
        "Resolved"
    ).length;

  const handleStatusChange =
    async (
      issueId: string,
      newStatus: IssueStatus
    ) => {
      updateIssueStatusInDb(
        issueId,
        newStatus
      );

      const updated =
        await mockFetchAllIssues();

      setIssues(updated);

      toast({
        title:
          "Status Updated",
        description: `Issue marked as ${newStatus}`,
      });
    };

  const handlePriorityChange =
    async (
      issueId: string,
      newPriority: IssuePriority
    ) => {
      updateIssuePriorityInDb(
        issueId,
        newPriority
      );

      const updated =
        await mockFetchAllIssues();

      setIssues(updated);

      toast({
        title:
          "Priority Updated",
        description: `Priority changed to ${newPriority}`,
      });
    };

  return (
    <div className="relative space-y-10">
      {/* HERO */}
      <div className="ui-glass relative overflow-hidden rounded-[36px] p-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.05] via-transparent to-violet-500/[0.05]" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="mb-5 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-blue-600">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Governance Center
            </Badge>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Civic Operations
              Dashboard
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Monitor civic
              infrastructure
              issues, manage AI
              prioritization, and
              coordinate urban
              governance workflows
              in real time.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

              <span className="font-semibold text-emerald-600">
                Systems Online
              </span>
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              AI Monitoring Active
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label:
              "Total Issues",
            value:
              totalIssues,
            icon: (
              <BarChart3 className="h-6 w-6" />
            ),
          },

          {
            label:
              "Pending",
            value:
              totalPending,
            icon: (
              <Info className="h-6 w-6" />
            ),
          },

          {
            label:
              "In Progress",
            value:
              totalProgress,
            icon: (
              <LoaderCircle className="h-6 w-6 animate-spin" />
            ),
          },

          {
            label:
              "Resolved",
            value:
              totalResolved,
            icon: (
              <CheckCircle className="h-6 w-6" />
            ),
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="relative overflow-hidden rounded-[32px] ui-interactive"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-500/[0.03]" />

            <CardContent className="relative z-10 flex items-center justify-between p-8">
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

      {/* MAP */}
      <Card className="overflow-hidden rounded-[32px]">
        <CardContent className="p-0">
          <GoogleIssueMap
            issues={
              filteredIssues
            }
          />
        </CardContent>
      </Card>

      {/* FILTERS */}
      <Card className="rounded-[32px]">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search issues..."
                value={
                  searchTerm
                }
                onChange={(
                  e
                ) =>
                  setSearchTerm(
                    e.target
                      .value
                  )
                }
                className="h-12 rounded-2xl pl-10"
              />
            </div>

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
                  (
                    status
                  ) => (
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
                  (
                    type
                  ) => (
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
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden rounded-[32px]">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map(
                (
                  item
                ) => (
                  <Skeleton
                    key={item}
                    className="h-20 rounded-2xl"
                  />
                )
              )}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />

              <AlertTitle>
                Error
              </AlertTitle>

              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/50 bg-slate-50/70 dark:border-slate-700/50 dark:bg-slate-900/40">
                  <TableHead>
                    Issue
                  </TableHead>

                  <TableHead>
                    Type
                  </TableHead>

                  <TableHead>
                    Priority
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Reported
                  </TableHead>

                  <TableHead>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredIssues.map(
                  (issue) => (
                    <TableRow
                      key={
                        issue.id
                      }
                      className="transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/40"
                    >
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-muted">
                            {issue.imageUrl ? (
                              <Image
                                src={
                                  issue.imageUrl
                                }
                                alt={
                                  issue.title
                                }
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
                            <div className="font-semibold">
                              {
                                issue.title
                              }
                            </div>

                            <div className="line-clamp-1 max-w-[250px] text-sm text-muted-foreground">
                              {
                                issue.description
                              }
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {
                            issue.type
                          }
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Select
                          value={
                            issue.priority
                          }
                          onValueChange={(
                            value
                          ) =>
                            handlePriorityChange(
                              issue.id,
                              value as IssuePriority
                            )
                          }
                        >
                          <SelectTrigger className="h-9 w-[120px] rounded-xl">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {priorities.map(
                              (
                                p
                              ) => (
                                <SelectItem
                                  key={
                                    p
                                  }
                                  value={
                                    p
                                  }
                                >
                                  {p}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell>
                        <Select
                          value={
                            issue.status
                          }
                          onValueChange={(
                            value
                          ) =>
                            handleStatusChange(
                              issue.id,
                              value as IssueStatus
                            )
                          }
                        >
                          <SelectTrigger className="h-9 w-[150px] rounded-xl">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {statuses.map(
                              (
                                s
                              ) => (
                                <SelectItem
                                  key={
                                    s
                                  }
                                  value={
                                    s
                                  }
                                >
                                  {s}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {format(
                            new Date(
                              issue.reportedAt
                            ),
                            "MMM d, yyyy"
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl"
                          onClick={() => {
                            setSelectedIssue(
                              issue
                            );

                            setDialogOpen(
                              true
                            );
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DIALOG */}
      <Dialog
        open={dialogOpen}
        onOpenChange={
          setDialogOpen
        }
      >
        <DialogContent className="rounded-[32px] border-slate-200/60 bg-white/80 backdrop-blur-lg dark:border-slate-800/50 dark:bg-slate-900/60 sm:max-w-[720px]">
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

                  <div className="flex items-center gap-3">
                    <Clock3 className="h-4 w-4" />

                    {formatDistanceToNowStrict(
                      new Date(
                        selectedIssue.reportedAt
                      )
                    )}{" "}
                    ago
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}