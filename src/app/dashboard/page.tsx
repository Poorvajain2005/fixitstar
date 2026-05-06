'use client';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
        {/* Dashboard content goes here */}
      </div>
    </ProtectedRoute>
  );
}