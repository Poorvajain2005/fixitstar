// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Loading from '@/components/Loading';

import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'FixIt',
  description: 'Report and track local issues in your community.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
