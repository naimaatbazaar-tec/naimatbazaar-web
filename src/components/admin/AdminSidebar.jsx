'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Store,
  FolderTree,
  BarChart3,
  Ticket,
  Star,
  HelpCircle,
  Video
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/users', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'FAQ', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Reels', href: '/admin/reels', icon: Video },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Profile & Settings', href: '/admin/profile', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
          <Store className="w-6 h-6 text-[#5c0000]" />
          <span className="font-black text-lg text-gray-900 tracking-tight">Naimat Admin</span>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                  isActive
                    ? 'bg-[#5c0000] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout & Storefront Return */}
      <div className="p-4 border-t border-gray-100 space-y-2 bg-white">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
        >
          <Store className="w-4 h-4" />
          <span>Go to Storefront</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}