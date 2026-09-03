'use client';

import { useAuth } from '@/context/AuthContext';
import { User, Bell } from 'lucide-react';
import Link from 'next/link';

export default function AdminTopbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <span className="text-xs font-bold uppercase tracking-wider bg-rose-100 text-[#5c0000] px-3 py-1 rounded-full">
          Super Admin Mode
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
          <div className="w-9 h-9 bg-[#5c0000] text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-gray-800">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-gray-500">{user?.email || 'admin@naimatbazaar.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}