"use client";

<<<<<<< HEAD
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
=======
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, KeyRound, User, Mail, ListChecks, Star, CheckCircle, MessageSquare, Camera, Phone, MapPin, Settings, Activity, Info, LoaderCircle } from "lucide-react"; // Added Info, LoaderCircle
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect } from 'react';
import { formatDistanceToNowStrict } from 'date-fns'; // Import date-fns function
import { getUserProfile, setUserProfile, UserProfile } from "@/lib/mock-users";

// Mock Activity Data
const mockActivities = [
  {
    id: 'act1',
    type: 'report',
    title: 'Large Pothole on Main St',
    status: 'Pending',
    timestamp: new Date(2024, 6, 15, 10, 30),
  },
  {
    id: 'act2',
    type: 'resolve',
    title: 'Overflowing Bin',
    status: 'Resolved',
    timestamp: new Date(2024, 6, 12, 15, 0),
  },
  {
    id: 'act3',
    type: 'comment',
    title: 'Streetlight Out',
    comment: 'Any updates on this? It\'s still dark.',
    timestamp: new Date(2024, 6, 10, 9, 0),
  },
   {
    id: 'act4',
    type: 'report',
    title: 'Broken Park Bench',
    status: 'In Progress',
    timestamp: new Date(2024, 6, 8, 14, 15),
  },
  {
    id: 'act5',
    type: 'update', // Simulate an update from admin side
    title: 'Broken Park Bench',
    update: 'Assigned to parks department. Status changed to In Progress.',
    timestamp: new Date(2024, 6, 9, 11, 0),
  },
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by newest first

const getInitials = (name: string | null | undefined): string => {
    if (!name) return "?";
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() ?? "?";
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
};

const ActivityIcon = ({ type, status }: { type: string; status?: string }) => {
  const className = "h-5 w-5 mt-1";
  switch (type) {
    case 'report':
      return <ListChecks className={`${className} text-primary`} />;
    case 'resolve':
      return <CheckCircle className={`${className} text-accent`} />;
    case 'comment':
      return <MessageSquare className={`${className} text-muted-foreground`} />;
    case 'update':
        if (status === 'In Progress') return <LoaderCircle className={`${className} text-primary animate-spin`} />;
        return <Info className={`${className} text-blue-500`} />; // Generic update icon
    default:
      return <Activity className={`${className} text-muted-foreground`} />;
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
  }
};

export default function CitizenProfilePage() {
<<<<<<< HEAD
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
=======
    // Simulate getting the logged-in user's email (in real app, get from auth/session)
    const [userEmail, setUserEmail] = useState<string | null>(null);
    useEffect(() => {
        // Try to get from localStorage (set on login)
        const email = typeof window !== 'undefined' ? localStorage.getItem('citizenUserEmail') : null;
        setUserEmail(email);
    }, []);

    // Load profile for the logged-in user
    const [profile, setProfile] = useState<UserProfile | null>(null);
    useEffect(() => {
        if (userEmail) {
            const loaded = getUserProfile(userEmail);
            if (loaded) setProfile({ ...loaded });
        }
    }, [userEmail]);

    // Editable fields
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const { toast } = useToast();

    // Sync profile fields to state when loaded
    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName || "");
            setPhone(profile.phone || "");
            setLocation(profile.location || "");
            setBio(profile.bio || "");
        }
    }, [profile]);

    const handleEditToggle = () => {
        if (isEditing && profile && userEmail) {
            // Save changes
            const updated: UserProfile = {
                ...profile,
                displayName,
                phone,
                location,
                bio,
            };
            setUserProfile(userEmail, updated);
            setProfile(updated);
            toast({ title: "Profile Updated", description: "Your changes have been saved." });
        }
        setIsEditing(!isEditing);
    };

    const handleChangePassword = () => {
        toast({ title: "Change Password", description: "Password change feature coming soon." });
    };

    const StatItem = ({ value, label }: { value: number | string; label: string }) => (
        <div className="text-center">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );

    if (!profile) {
        return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Info & Stats */}
                <Card className="lg:col-span-1 shadow-lg h-fit">
                    <CardHeader className="items-center text-center">
                        <div className="relative group mb-4">
                            <Avatar className="h-24 w-24 border-2 border-primary ring-4 ring-primary/20">
                                <AvatarImage src={profile.photoURL || undefined} alt={displayName || "User avatar"} data-ai-hint="person face portrait" />
                                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-semibold">{getInitials(displayName)}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 group-hover:opacity-100 opacity-0 transition-opacity bg-background/80 hover:bg-muted" disabled>
                                <Camera className="h-4 w-4" />
                                 <span className="sr-only">Change photo (disabled)</span>
                            </Button>
                        </div>
                        <CardTitle className="text-2xl">{displayName || "User"}</CardTitle>
                        <CardDescription className="text-muted-foreground">{profile.email}</CardDescription>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {(profile.badges || []).map((badge: string) => (
                                <Badge key={badge} variant={badge === "Top Reporter" ? "default" : "secondary"} className="flex items-center gap-1">
                                    {badge === "Active Member" && <CheckCircle className="h-3 w-3" />}
                                    {badge === "Top Reporter" && <Star className="h-3 w-3" />}
                                    {badge}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}
                        </p>
                    </CardHeader>
                    <CardContent className="border-t pt-4">
                        <div className="flex justify-around">
                            <StatItem value={profile.reportsSubmitted ?? 0} label="Reports" />
                            <StatItem value={profile.reportsResolved ?? 0} label="Resolved" />
                            <StatItem value={profile.commentsMade ?? 0} label="Comments" />
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Tabs */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="personal-info">
                        <TabsList className="grid w-full grid-cols-3 mb-6 shadow-inner bg-muted">
                            <TabsTrigger value="personal-info"><User className="mr-1.5 h-4 w-4"/>Personal Info</TabsTrigger>
                            <TabsTrigger value="activity"><Activity className="mr-1.5 h-4 w-4"/>Activity</TabsTrigger>
                            <TabsTrigger value="settings"><Settings className="mr-1.5 h-4 w-4"/>Settings</TabsTrigger>
                        </TabsList>

                        {/* Personal Info Tab */}
                        <TabsContent value="personal-info">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your personal information and contact details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="displayName">Full Name</Label>
                                        <Input
                                            id="displayName"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            disabled={!isEditing}
                                            className="disabled:opacity-70 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" value={profile.email} disabled className="opacity-70 cursor-not-allowed" />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="phone">Phone Number</Label>
                                         <Input
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            disabled={!isEditing}
                                            className="disabled:opacity-70 disabled:cursor-not-allowed"
                                            placeholder="e.g., +91 98765 43210"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="location">Location</Label>
                                         <Input
                                            id="location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            disabled={!isEditing}
                                            className="disabled:opacity-70 disabled:cursor-not-allowed"
                                            placeholder="e.g., City, Country"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            disabled={!isEditing}
                                            className="disabled:opacity-70 disabled:cursor-not-allowed min-h-[100px]"
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t pt-6 flex justify-end">
                                    <Button onClick={handleEditToggle}>
                                        {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Activity Tab - Now with content */}
                         <TabsContent value="activity">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Your recent reports, comments, and issue updates.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {mockActivities.length > 0 ? (
                                        <div className="space-y-4">
                                            {mockActivities.map((activity, index) => (
                                                <React.Fragment key={activity.id}>
                                                    <div className="flex items-start gap-3">
                                                        <ActivityIcon type={activity.type} status={activity.status} />
                                                        <div className="flex-1">
                                                            <p className="text-sm leading-snug">
                                                                {activity.type === 'report' && <>You reported <span className="font-medium">"{activity.title}"</span></>}
                                                                {activity.type === 'resolve' && <>Your report <span className="font-medium">"{activity.title}"</span> was resolved.</>}
                                                                {activity.type === 'comment' && <>You commented on <span className="font-medium">"{activity.title}"</span>: <em className="text-muted-foreground">"{activity.comment}"</em></>}
                                                                 {activity.type === 'update' && <>Update on <span className="font-medium">"{activity.title}"</span>: <span className="text-muted-foreground">{activity.update}</span></>}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {formatDistanceToNowStrict(activity.timestamp, { addSuffix: true })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {index < mockActivities.length - 1 && <Separator />}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">No recent activity found.</p>
                                    )}
                                </CardContent>
                            </Card>
                         </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>Manage your account security and preferences.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold">Security</h3>
                                        <Button variant="outline" onClick={handleChangePassword} className="w-full sm:w-auto">
                                            <KeyRound className="mr-2 h-4 w-4" /> Change Password
                                        </Button>
                                    </div>
                                     <Separator />
                                     <div className="space-y-3">
                                         <h3 className="text-base font-semibold">Preferences</h3>
                                         <p className="text-sm text-muted-foreground">Notification preferences will be available here.</p>
                                     </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
