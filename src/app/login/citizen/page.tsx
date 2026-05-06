"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import Link from "next/link";
import { addUser, userExists, findUser } from "@/lib/mock-users";

// Use signIn for login
const signIn = async (email: string, pass: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
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
        description: "Welcome back!",
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
      setSignupSuccess("Account created! You can now log in.");
      setSignupEmail("");
      setSignupPassword("");
    } catch (err: any) {
      setSignupError("Failed to create account.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Citizen Login</CardTitle>
          <CardDescription>Access your dashboard to report and track issues.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Login Form */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          {/* Signup Panel */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">New User? Create an Account</h3>
            {signupError && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{signupError}</AlertDescription>
              </Alert>
            )}
            {signupSuccess && (
              <Alert variant="default" className="mb-2">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{signupSuccess}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  disabled={signupLoading}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={signupLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={signupLoading}>
                {signupLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">(Use citizen@example.com / password)</span>
          </div>
          <div className="mt-2 text-center text-sm">
            <Link href="/" className="underline text-primary">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
