"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  ShieldAlert, 
  UserCircle, 
  Camera 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AiAnalysisComponent from "@/components/shared/ai-analysis";
import { getUserProfile, UserProfile } from "@/lib/mock-users";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface NavbarProps {
  navItems: NavItem[];
  userType: "Citizen" | "Admin";
  sticky?: boolean;
  className?: string;
}

// Mock logout function
const mockSignOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log("User logged out");
};

export function Navbar({ navItems, userType, sticky = true, className }: NavbarProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  // Set mounted state
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch role-specific user profile to prevent key collisions
  React.useEffect(() => {
    let email: string | null = null;
    if (typeof window !== 'undefined') {
      email = localStorage.getItem(userType === 'Citizen' ? 'citizenUserEmail' : 'adminUserEmail');
    }
    if (email) {
      const p = getUserProfile(email, userType === "Citizen" ? "citizen" : "admin");
      if (p) setProfile(p);
    }
  }, [userType]);

  const handleLogout = async () => {
    try {
      await mockSignOut();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('citizenUserEmail');
        localStorage.removeItem('adminUserEmail');
      }
      toast({
        title: "Logged Out Successfully",
        description: "Redirecting to home page...",
      });
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = useCallback((name: string | null | undefined): string => {
    if (!name) return "?";
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() ?? "?";
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
  }, []);

  const profileHref = userType === 'Admin' ? '/admin/profile' : '/citizen/profile';

  return (
    <nav
      className={cn(
        "border-b border-slate-200/60 bg-white/75 shadow-xl shadow-slate-200/20 backdrop-blur-lg dark:border-slate-800/50 dark:bg-slate-900/50 dark:shadow-none z-50",
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* LOGO */}
        <Link 
          href={userType === 'Citizen' ? '/citizen/dashboard' : '/admin/dashboard'} 
          className="text-xl font-bold text-primary flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <ShieldAlert className="h-6 w-6" />
          <span>FixIt</span>
          <span className="text-sm font-normal text-muted-foreground ml-1">({userType})</span>
        </Link>

        {/* NAVIGATION ITEMS & PROFILE ACTIONS */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={item.isActive ? "secondary" : "ghost"}
              className={cn(
                "text-sm font-medium rounded-xl transition-colors duration-150",
                item.isActive ? "text-primary bg-primary/10" : "text-foreground hover:text-primary hover:bg-accent/50"
              )}
              size="sm"
              asChild
            >
              <Link href={item.href}>
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                {item.label}
              </Link>
            </Button>
          ))}

          {/* AI Analysis Camera Dialog (Citizen Only) */}
          {userType === 'Citizen' && (
            <Dialog open={isAnalysisDialogOpen} onOpenChange={setIsAnalysisDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 ml-2 text-muted-foreground hover:text-primary hover:bg-accent/50 rounded-full" 
                  title="Analyze Issue with AI Camera"
                >
                  <Camera className="h-5 w-5" />
                  <span className="sr-only">AI Camera Analysis</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md p-0">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle>AI Camera Analysis</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <AiAnalysisComponent onClose={() => setIsAnalysisDialogOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* User Profile Dropdown Menu */}
          {isMounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.photoURL || undefined} alt={profile?.displayName || "User avatar"} data-ai-hint="person face portrait" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{getInitials(profile?.displayName)}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={profileHref}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-3" disabled>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">...</AvatarFallback>
              </Avatar>
            </Button>
          )}

          {/* Theme Switcher Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="ml-1 rounded-xl h-9 w-9"
            disabled={!isMounted}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span className="flex items-center justify-center h-5 w-5 text-base leading-none transition-transform duration-300 hover:rotate-12">
              {isMounted && theme === "dark" ? "🌙" : "☀️"}
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
}