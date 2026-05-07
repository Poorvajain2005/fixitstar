// src/app/auth/login/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to FixIt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Link href="/auth/login/citizen">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <User className="h-6 w-6" />
                <span>Citizen Login</span>
              </Button>
            </Link>
            <Link href="/auth/login/admin">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Building className="h-6 w-6" />
                <span>Admin Login</span>
              </Button>
            </Link>
          </div>
          <div className="text-center text-sm mt-4">
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}