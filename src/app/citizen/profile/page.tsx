"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion"; // Retained the motion wrapper from your HEAD design
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  Save, 
  KeyRound, 
  User, 
  Mail, 
  ListChecks, 
  Star, 
  CheckCircle, 
  MessageSquare, 
  Camera, 
  Phone, 
  MapPin, 
  Settings, 
  Activity, 
  Info, 
  LoaderCircle 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNowStrict } from 'date-fns';
import { getUserProfile, setUserProfile, updateUserPassword, UserProfile } from "@/lib/mock-users";

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
    comment: "Any updates on this? It's still dark.",
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
    type: 'update',
    title: 'Broken Park Bench',
    update: 'Assigned to parks department. Status changed to In Progress.',
    timestamp: new Date(2024, 6, 9, 11, 0),
  },
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

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
      return <CheckCircle className={`${className} text-emerald-500`} />;
    case 'comment':
      return <MessageSquare className={`${className} text-muted-foreground`} />;
    case 'update':
      if (status === 'In Progress') return <LoaderCircle className={`${className} text-primary animate-spin`} />;
      return <Info className={`${className} text-blue-500`} />;
    default:
      return <Activity className={`${className} text-muted-foreground`} />;
  }
};

export default function CitizenProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { toast } = useToast();

  // Load user session
  useEffect(() => {
    const email = typeof window !== "undefined" ? localStorage.getItem("citizenUserEmail") : null;
    setUserEmail(email);
  }, []);

  // Fetch Profile data
  useEffect(() => {
    if (userEmail) {
      const loaded = getUserProfile(userEmail, "citizen");
      if (loaded) {
        setProfile({ ...loaded });
      }
    }
  }, [userEmail]);

  // Sync state with loaded profile
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
      const updated: UserProfile = {
        ...profile,
        displayName,
        phone,
        location,
        bio,
      };

      setUserProfile(userEmail, updated, "citizen");
      setProfile(updated);

      toast({
        title: "Profile Updated",
        description: "Changes saved successfully.",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleChangePassword = () => {
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
      toast({ 
        title: "Profile Photo Updated", 
        description: "Your profile photo has been updated successfully." 
      });
    };
    reader.readAsDataURL(file);
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-[32px] border border-black/5 bg-white/80 p-10 shadow-xl backdrop-blur-2xl text-center dark:bg-slate-900/80 dark:border-white/5">
          <h2 className="text-2xl font-black mb-3">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            User session could not be loaded. Please log in again.
          </p>
          <Button
            onClick={() => {
              window.location.href = "/login/citizen";
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

      {/* HERO BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="ui-glass relative overflow-hidden rounded-[32px] p-8 md:p-10 border border-slate-200/60 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/20 backdrop-blur-2xl"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* LEFT: User Identity */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-2 border-slate-200/60 ring-4 ring-primary/20 shadow-xl shadow-slate-200/30 dark:border-slate-850 dark:shadow-none">
                <AvatarImage src={profile.photoURL || undefined} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white text-4xl font-black">
                  {getInitials(displayName)}
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

            <div className="text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 px-4 py-1">
                  Verified Citizen
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-slate-200 dark:border-white/10 bg-background/40 backdrop-blur-xl px-4 py-1"
                >
                  AI Governance Member
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{displayName}</h1>
              <p className="text-muted-foreground text-lg mt-2">Civic Intelligence Contributor</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {phone || "Not Added"}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {location || "Unknown"}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Stats Grid */}
          <div className="grid grid-cols-3 gap-4 min-w-[320px]">
            {[
              { value: profile.reportsSubmitted || 0, label: "Reports" },
              { value: profile.reportsResolved || 0, label: "Resolved" },
              { value: profile.commentsMade || 0, label: "Comments" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200/60 bg-background/50 backdrop-blur-md dark:border-slate-800/50 p-5 text-center"
              >
                <div className="text-3xl font-black">{item.value}</div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mt-2">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* DETAILED SECTIONS */}
      <Tabs defaultValue="personal-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/50 backdrop-blur-md p-1 h-auto">
          <TabsTrigger value="personal-info" className="rounded-xl py-3 flex items-center justify-center gap-2">
            <User className="h-4 w-4" /> Personal Info
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-xl py-3 flex items-center justify-center gap-2">
            <Activity className="h-4 w-4" /> Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl py-3 flex items-center justify-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* PERSONAL INFO TAB */}
        <TabsContent value="personal-info">
          <Card className="rounded-[32px] border-slate-200/60 dark:border-slate-800/50 shadow-md">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your public profile information and civic identity.</CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!isEditing}
                  className="h-12 rounded-2xl border-slate-200/60 dark:border-slate-800/50 bg-background/50 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input
                  id="phoneNo"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  className="h-12 rounded-2xl border-slate-200/60 dark:border-slate-800/50 bg-background/50 disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="e.g., +91 98765 43210"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Location</Label>
                <Input
                  id="address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={!isEditing}
                  className="h-12 rounded-2xl border-slate-200/60 dark:border-slate-800/50 bg-background/50 disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="e.g., City, Country"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="biography">Bio</Label>
                <Textarea
                  id="biography"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  className="min-h-[140px] rounded-2xl border-slate-200/60 dark:border-slate-800/50 bg-background/50 disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-200/60 dark:border-slate-800/50 pt-6 flex justify-end">
              <Button
                onClick={handleEditToggle}
                className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-medium px-6 transition-all"
              >
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ACTIVITY TAB */}
        <TabsContent value="activity">
          <Card className="rounded-[32px] border-slate-200/60 dark:border-slate-800/50 shadow-md">
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Real-time log of your contributions and feedback.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {mockActivities.length > 0 ? (
                mockActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-2xl bg-background/50 border border-slate-200/60 dark:border-slate-800/50 flex items-center justify-center shrink-0">
                        <ActivityIcon type={activity.type} status={activity.status} />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm leading-relaxed text-foreground">
                          {activity.type === 'report' && <>You submitted a report for <span className="font-semibold">"{activity.title}"</span></>}
                          {activity.type === 'resolve' && <>Your report <span className="font-semibold">"{activity.title}"</span> was marked as <span className="text-emerald-500 font-medium">Resolved</span></>}
                          {activity.type === 'comment' && <>You commented on <span className="font-semibold">"{activity.title}"</span>: <em className="text-muted-foreground">"{activity.comment}"</em></>}
                          {activity.type === 'update' && <>Update received for <span className="font-semibold">"{activity.title}"</span>: <span className="text-muted-foreground">{activity.update}</span></>}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNowStrict(activity.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {index < mockActivities.length - 1 && <Separator className="border-slate-100 dark:border-slate-800" />}
                  </React.Fragment>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No recent activity logged.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings">
          <Card className="rounded-[32px] border-slate-200/60 dark:border-slate-800/50 shadow-md">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage security and view credentials profile data.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Security Form */}
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-background/50 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="w-full space-y-1">
                  <h3 className="font-semibold">Password & Security</h3>
                  <p className="text-sm text-muted-foreground">Update your account access credentials securely.</p>
                  
                  <div className="mt-4 grid gap-3 md:grid-cols-2 max-w-xl">
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="rounded-xl"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleChangePassword}
                  className="rounded-2xl h-11 shrink-0 self-end md:self-center border-slate-200 dark:border-slate-700"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Update Access
                </Button>
              </div>

              {/* Trust Score */}
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-background/50 p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">AI Trust Score</h3>
                  <p className="text-sm text-muted-foreground mt-1">Calculated based on positive contributions and valid reports.</p>
                </div>
                <Badge className="rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-1 font-semibold text-xs tracking-wider uppercase">
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