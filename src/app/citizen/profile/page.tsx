"use client";

import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

import { useToast } from "@/hooks/use-toast";

import {
  Edit,
  Save,
  KeyRound,
  Star,
  CheckCircle,
  MessageSquare,
  Camera,
  Settings,
  Activity,
  Info,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Radar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";

import { motion } from "framer-motion";

import { formatDistanceToNowStrict } from "date-fns";

import {
  getUserProfile,
  setUserProfile,
  updateUserPassword,
  UserProfile,
} from "@/lib/mock-users";

const mockActivities = [
  {
    id: "act1",
    type: "report",
    title: "Large Pothole on Main St",
    status: "Pending",
    timestamp: new Date(
      2024,
      6,
      15,
      10,
      30
    ),
  },

  {
    id: "act2",
    type: "resolve",
    title: "Overflowing Bin",
    status: "Resolved",
    timestamp: new Date(
      2024,
      6,
      12,
      15,
      0
    ),
  },

  {
    id: "act3",
    type: "comment",
    title: "Streetlight Out",
    comment:
      "Any updates on this?",
    timestamp: new Date(
      2024,
      6,
      10,
      9,
      0
    ),
  },
].sort(
  (a, b) =>
    b.timestamp.getTime() -
    a.timestamp.getTime()
);

const getInitials = (
  name: string | null | undefined
): string => {
  if (!name) return "?";

  const names = name
    .trim()
    .split(" ");

  if (names.length === 1)
    return (
      names[0][0]?.toUpperCase() ??
      "?"
    );

  return (
    names[0][0] +
    (
      names[
        names.length - 1
      ][0] || ""
    )
  ).toUpperCase();
};

const ActivityIcon = ({
  type,
  status,
}: {
  type: string;
  status?: string;
}) => {
  const className =
    "h-5 w-5 mt-1";

  switch (type) {
    case "report":
      return (
        <Radar
          className={`${className} text-primary`}
        />
      );

    case "resolve":
      return (
        <CheckCircle
          className={`${className} text-emerald-500`}
        />
      );

    case "comment":
      return (
        <MessageSquare
          className={`${className} text-muted-foreground`}
        />
      );

    case "update":
      return (
        <Info
          className={`${className} text-blue-500`}
        />
      );

    default:
      return (
        <Activity
          className={`${className} text-muted-foreground`}
        />
      );
  }
};

export default function CitizenProfilePage() {
  const [userEmail, setUserEmail] =
    useState<string | null>(
      null
    );

  const [profile, setProfile] =
    useState<UserProfile | null>(
      null
    );

  const [isEditing, setIsEditing] =
    useState(false);

  const [displayName, setDisplayName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [bio, setBio] =
    useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const email =
      typeof window !==
      "undefined"
        ? localStorage.getItem(
            "citizenUserEmail"
          )
        : null;

    setUserEmail(email);
  }, []);

  useEffect(() => {
    if (userEmail) {
      const loaded =
        getUserProfile(
          userEmail,
          "citizen"
        );

      if (loaded)
        setProfile({
          ...loaded,
        });
    }
  }, [userEmail]);

  useEffect(() => {
    if (profile) {
      setDisplayName(
        profile.displayName ||
          ""
      );

      setPhone(
        profile.phone || ""
      );

      setLocation(
        profile.location || ""
      );

      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleEditToggle =
    () => {
      if (
        isEditing &&
        profile &&
        userEmail
      ) {
        const updated: UserProfile =
          {
            ...profile,
            displayName,
            phone,
            location,
            bio,
          };

        setUserProfile(
          userEmail,
          updated,
          "citizen"
        );

        setProfile(updated);

        toast({
          title:
            "Profile Updated",
          description:
            "Changes saved successfully.",
        });
      }

      setIsEditing(!isEditing);
    };

  const handleChangePassword =
    () => {
      if (!userEmail) return;
      const result = updateUserPassword(userEmail, "citizen", currentPassword, newPassword);
      toast({
        title: result.ok ? "Password Updated" : "Password Update Failed",
        description: result.message,
        variant: result.ok ? "default" : "destructive",
      });
      if (result.ok) {
        setCurrentPassword("");
        setNewPassword("");
      }
    };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || !profile || !userEmail) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updated: UserProfile = {
        ...profile,
        photoURL: reader.result as string,
      };
      setUserProfile(userEmail, updated, "citizen");
      setProfile(updated);
      toast({ title: "Profile Photo Updated", description: "Your profile photo has been updated." });
    };
    reader.readAsDataURL(file);
  };

 if (!profile) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-[32px] border border-black/5 bg-white/80 p-10 shadow-xl backdrop-blur-2xl text-center">
        <h2 className="text-2xl font-black mb-3">
          Profile Not Found
        </h2>

        <p className="text-muted-foreground mb-6 max-w-md">
          User session could not be loaded.
          Please login again.
        </p>

        <Button
          onClick={() => {
            window.location.href =
              "/login/citizen";
          }}
        >
          Go To Login
        </Button>
      </div>
    </div>
  );
}
  return (
    <div className="relative space-y-8">
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* HERO */}
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="ui-glass relative overflow-hidden rounded-[32px] p-8 md:p-10"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* LEFT */}
          <div className="flex items-start gap-5">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-2 border-slate-200/60 ring-4 ring-primary/20 shadow-xl shadow-slate-200/30 dark:border-slate-800/50 dark:shadow-none">
                <AvatarImage
                  src={
                    profile.photoURL ||
                    undefined
                  }
                />

                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white text-4xl font-black">
                  {getInitials(
                    displayName
                  )}
                </AvatarFallback>
              </Avatar>

              <Button
                size="icon"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 rounded-full bg-background/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/50"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 px-4 py-1">
                  Verified Citizen
                </Badge>

                <Badge
                  variant="outline"
                  className="rounded-full border-white/10 bg-background/40 backdrop-blur-xl px-4 py-1"
                >
                  AI Governance Member
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                {displayName}
              </h1>

              <p className="text-muted-foreground text-lg mt-2">
                Civic Intelligence
                Contributor
              </p>

              <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {phone ||
                    "Not Added"}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {location ||
                    "Unknown"}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT STATS */}
          <div className="grid grid-cols-3 gap-4 min-w-[320px]">
            {[
              {
                value:
                  profile.reportsSubmitted ||
                  0,
                label:
                  "Reports",
              },

              {
                value:
                  profile.reportsResolved ||
                  0,
                label:
                  "Resolved",
              },

              {
                value:
                  profile.commentsMade ||
                  0,
                label:
                  "Comments",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200/60 bg-background/50 backdrop-blur-md dark:border-slate-800/50 p-5 text-center"
              >
                <div className="text-3xl font-black">
                  {item.value}
                </div>

                <div className="text-xs uppercase tracking-wide text-muted-foreground mt-2">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <Tabs
        defaultValue="personal-info"
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/50 backdrop-blur-md p-1 h-auto">
          <TabsTrigger
            value="personal-info"
            className="rounded-xl py-3"
          >
            Personal Info
          </TabsTrigger>

          <TabsTrigger
            value="activity"
            className="rounded-xl py-3"
          >
            Activity
          </TabsTrigger>

          <TabsTrigger
            value="settings"
            className="rounded-xl py-3"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* PERSONAL */}
        <TabsContent value="personal-info">
          <Card className="rounded-[32px]">
            <CardHeader>
              <CardTitle>
                Personal
                Information
              </CardTitle>

              <CardDescription>
                Manage your
                profile and
                civic identity.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  Full Name
                </Label>

                <Input
                  value={
                    displayName
                  }
                  onChange={(e) =>
                    setDisplayName(
                      e.target
                        .value
                    )
                  }
                  disabled={
                    !isEditing
                  }
                  className="h-12 rounded-2xl border-slate-200/60 dark:border-slate-800/50 bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Phone
                </Label>

                <Input
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target
                        .value
                    )
                  }
                  disabled={
                    !isEditing
                  }
                  className="h-12 rounded-2xl border-slate-200/60 dark:border-slate-800/50 bg-background/50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>
                  Location
                </Label>

                <Input
                  value={
                    location
                  }
                  onChange={(e) =>
                    setLocation(
                      e.target
                        .value
                    )
                  }
                  disabled={
                    !isEditing
                  }
                  className="h-12 rounded-2xl border-slate-200/60 dark:border-slate-800/50 bg-background/50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Bio</Label>

                <Textarea
                  value={bio}
                  onChange={(e) =>
                    setBio(
                      e.target
                        .value
                    )
                  }
                  disabled={
                    !isEditing
                  }
                  className="min-h-[140px] rounded-2xl border-slate-200/60 dark:border-slate-800/50 bg-background/50"
                />
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-200/60 dark:border-slate-800/50 pt-6 flex justify-end">
              <Button
                onClick={
                  handleEditToggle
                }
                className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600"
              >
                {isEditing ? (
                  <Save className="mr-2 h-4 w-4" />
                ) : (
                  <Edit className="mr-2 h-4 w-4" />
                )}

                {isEditing
                  ? "Save Changes"
                  : "Edit Profile"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ACTIVITY */}
        <TabsContent value="activity">
          <Card className="rounded-[32px]">
            <CardHeader>
              <CardTitle>
                Activity Feed
              </CardTitle>

              <CardDescription>
                Real-time civic
                participation
                history.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {mockActivities.map(
                (
                  activity,
                  index
                ) => (
                  <React.Fragment
                    key={
                      activity.id
                    }
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-background/50 border border-slate-200/60 dark:border-slate-800/50 flex items-center justify-center">
                        <ActivityIcon
                          type={
                            activity.type
                          }
                          status={
                            activity.status
                          }
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium leading-relaxed">
                          {
                            activity.title
                          }
                        </p>

                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDistanceToNowStrict(
                            activity.timestamp,
                            {
                              addSuffix:
                                true,
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {index <
                      mockActivities.length -
                        1 && (
                      <Separator />
                    )}
                  </React.Fragment>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS */}
        <TabsContent value="settings">
          <Card className="rounded-[32px]">
            <CardHeader>
              <CardTitle>
                Account
                Settings
              </CardTitle>

              <CardDescription>
                Security and
                platform
                preferences.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-background/50 p-5 flex items-center justify-between">
                <div className="w-full">
                  <h3 className="font-semibold">
                    Password &
                    Security
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your
                    authentication
                    credentials.
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={
                    handleChangePassword
                  }
                  className="rounded-2xl"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-background/50 p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    AI Trust
                    Score
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    Credibility
                    and civic
                    participation
                    rating.
                  </p>
                </div>

                <Badge className="rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-1">
                  High Trust
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}