"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = findUser(email, password, "admin");
      if (!user) {
        throw new Error("Invalid credentials or insufficient permissions.");
      }

      // Store session
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminUserEmail', email);
        localStorage.setItem('adminUserRole', 'admin');
      }

      toast({
        title: "Login Successful",
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

      // Add new admin user
      addUser(signupEmail, signupPassword, "admin");

      // Store session
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>
            Access the administrative dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Login Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Existing Admin</h3>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : "Login"}
              </Button>
            </form>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          {/* Signup Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">New Admin</h3>
            
            {signupError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{signupError}</AlertDescription>
              </Alert>
            )}
            
            {signupSuccess && (
              <Alert>
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{signupSuccess}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignup} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="newadmin@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  disabled={signupLoading}
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
                  required
                  disabled={signupLoading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={signupLoading}>
                {signupLoading ? "Creating account..." : "Create Admin Account"}
              </Button>
            </form>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground">
            <Link href="/" className="underline hover:text-primary">
              ← Back to Home
            </Link>
            <div className="text-center">
              Demo credentials: admin@example.com / password
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}