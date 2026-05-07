// src/components/auth/ProtectedRoute.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ 
  children,
  requiredRole
}: {
  children: React.ReactNode,
  requiredRole?: 'admin' | 'citizen'
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (requiredRole && role !== requiredRole) {
        router.push(role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard');
      }
    }
  }, [user, loading, role, requiredRole, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}