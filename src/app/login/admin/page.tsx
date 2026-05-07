"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ShieldCheck, KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { addUser, userExists, findUser } from "@/lib/mock-users";

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = findUser(email, password, "admin");
      if (!user) {
        throw new Error("Invalid credentials or insufficient permissions.");
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('adminUserEmail', email);
        localStorage.setItem('adminUserRole', 'admin');
      }

      toast({
        title: "Success",
        description: "Redirecting to admin dashboard...",
      });

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Login Failed",
        description: err.message,
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
        throw new Error("Please enter both email and password.");
      }

      if (userExists(signupEmail)) {
        throw new Error("User already exists. Please login instead.");
      }

      addUser(signupEmail, signupPassword, "admin");

      if (typeof window !== 'undefined') {
        localStorage.setItem('adminUserEmail', signupEmail);
        localStorage.setItem('adminUserRole', 'admin');
      }

      setSignupSuccess("Admin account created successfully! You can now login.");
      setSignupEmail("");
      setSignupPassword("");

      toast({
        title: "Account Created",
        description: "Your admin account has been created successfully.",
      });
    } catch (err: any) {
      setSignupError(err.message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial accent for a high-end SaaS feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-950/20 pointer-events-none" />

      <div className="w-full max-w-[440px] z-10 space-y-6">
        {/* Portal Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 mb-2">
            <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Admin Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage system services and access administrative analytics
          </p>
        </div>

        <Card className="border-slate-200/80 dark:border-slate-850 shadow-xl shadow-slate-100/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 dark:bg-slate-950/80 rounded-lg">
                <TabsTrigger value="login" className="rounded-md font-medium">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-md font-medium">Create Admin</TabsTrigger>
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
                      placeholder="admin@example.com"
                      className="h-10 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus-visible:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Password
                      </Label>
                    </div>
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

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full h-10 font-medium bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Authenticating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <KeyRound className="h-4 w-4" /> Sign In to Dashboard
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
                      <AlertTitle className="text-sm font-semibold">Setup Error</AlertTitle>
                      <AlertDescription className="text-xs">{signupError}</AlertDescription>
                    </Alert>
                  )}

                  {signupSuccess && (
                    <Alert className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/10 text-emerald-900 dark:text-emerald-400 py-3 px-4 animate-in fade-in duration-200">
                      <AlertTitle className="text-sm font-semibold">Verification Complete</AlertTitle>
                      <AlertDescription className="text-xs">{signupSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Admin Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="newadmin@example.com"
                      className="h-10 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus-visible:ring-blue-500"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Security Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Min. 8 characters"
                      className="h-10 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus-visible:ring-blue-500"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full h-10 font-medium bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all" disabled={signupLoading}>
                    {signupLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating Account...
                      </span>
                    ) : "Register Administrator"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Support & Navigation Footer */}
        <div className="flex flex-col items-center space-y-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-200/50 dark:bg-slate-900 rounded-full border border-slate-300/30 text-slate-600 dark:text-slate-400">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span>Demo credentials: <strong>admin@example.com</strong> / <strong>password</strong></span>
          </div>
          
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}