'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Redirect unauthenticated requests to login with a return path
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (adminOnly && user.role !== 'admin') {
      // Kick non-admin users trying to access admin panels back to home/dashboard
      router.replace('/dashboard');
    }
  }, [user, loading, adminOnly, router, pathname]);

  if (loading || !user || (adminOnly && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-bold text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5c0000] mr-3"></div>
        Verifying security clearance...
      </div>
    );
  }

  return children;
}