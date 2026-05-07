"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { AlertCircle, Users, KeyRound, Loader2, ArrowLeft, Sun, Moon } from 'lucide-react';
import Link from "next/link";
import { addUser, userExists, findUser } from "@/lib/mock-users";

const signIn = async (email: string, pass: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const user = findUser(email, pass, "citizen");
  if (user) {
    return { user: { uid: user.email, email: user.email } };
  } else {
    throw new Error("Invalid credentials. Please check your email and password or sign up.");
  }
};

export default function CitizenLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent Hydration mismatch issues by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      if (typeof window !== 'undefined') {
        localStorage.setItem('citizenUserEmail', email);
      }
      toast({
        title: "Login Successful",
        description: "Welcome back to your dashboard!",
      });
      router.push('/citizen/dashboard');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({
        title: "Login Failed",
        description: err.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);
    setSignupLoading(true);
    try {
      if (!signupEmail || !signupPassword) {
        setSignupError("Please enter both email and password.");
        return;
      }
      if (userExists(signupEmail)) {
        setSignupError("User already exists. Please login.");
        return;
      }
      addUser(signupEmail, signupPassword, "citizen");
      if (typeof window !== 'undefined') {
        localStorage.setItem('citizenUserEmail', signupEmail);
      }
      setSignupSuccess("Account created successfully! You can now log in.");
      setSignupEmail("");
      setSignupPassword("");
      toast({
        title: "Success!",
        description: "Your citizen account is ready.",
      });
    } catch (err: any) {
      setSignupError("Failed to create account.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
      
      {/* Background Radial Gradient to match the professional Admin look */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-950/20 pointer-events-none" />

      {/* Embedded Floating Theme Switcher Button */}
      <div className="absolute top-4 right-4 z-50">
        {mounted && (
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:scale-105 active:scale-95"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 animate-in spin-in-90 duration-300" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-amber-500 fill-amber-400 dark:fill-amber-500/20 animate-in spin-in-45 duration-300" />
            )}
          </Button>
        )}
      </div>

      <div className="w-full max-w-[440px] z-10 space-y-6">
        {/* Unified Portal Header block */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 mb-2">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Citizen Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Report local issues, request municipal services, and track community progress
          </p>
        </div>

        {/* Tabbed Login/Signup Card Panel */}
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 dark:bg-slate-950/80 rounded-lg">
                <TabsTrigger value="login" className="rounded-md font-medium">Log In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-md font-medium">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-0 focus-visible:outline-none">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="py-3 px-4 animate-in fade-in duration-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-sm font-semibold">Authentication Error</AlertTitle>
                      <AlertDescription className="text-xs">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-10 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus-visible:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-10 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus-visible:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full h-10 font-medium bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Accessing Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <KeyRound className="h-4 w-4" /> Log In
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="mt-0 focus-visible:outline-none">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  {signupError && (
                    <Alert variant="destructive" className="py-3 px-4 animate-in fade-in duration-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-sm font-semibold">Sign Up Failed</AlertTitle>
                      <AlertDescription className="text-xs">{signupError}</AlertDescription>
                    </Alert>
                  )}

                  {signupSuccess && (
                    <Alert className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/10 text-emerald-950 dark:text-emerald-400 py-3 px-4 animate-in fade-in duration-200">
                      <AlertTitle className="text-sm font-semibold">Success</AlertTitle>
                      <AlertDescription className="text-xs">{signupSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-10 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus-visible:ring-blue-500"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Create Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      className="h-10 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus-visible:ring-blue-500"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full h-10 font-medium bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all" disabled={signupLoading}>
                    {signupLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating Account...
                      </span>
                    ) : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Support & Utility Footnotes */}
        <div className="flex flex-col items-center space-y-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-200/50 dark:bg-slate-900 rounded-full border border-slate-300/30 text-slate-600 dark:text-slate-400">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span>Demo: <strong>citizen@example.com</strong> / <strong>password</strong></span>
          </div>

          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}