'use client';

import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import LanguageToggle from '@/components/LanguageToggle';

type HeaderNavItem = {
  href: string;
  label: string;
};

type AppHeaderProps = {
  navItems: HeaderNavItem[];
  extraActions?: ReactNode;
  className?: string;
  showLanguageToggle?: boolean;
};

export default function AppHeader({ navItems, extraActions, className, showLanguageToggle = false }: AppHeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState<'English' | 'Filipino'>('English');

  return (
    <nav className={cn('sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md', className)}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-teal-600 p-2 text-white shadow-lg shadow-teal-200">
            <HeartPulse size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-800">HALIYA</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('transition-colors hover:text-teal-600', active && 'text-teal-600')}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {extraActions ?? (showLanguageToggle ? <LanguageToggle language={language} onToggle={() => setLanguage((current) => (current === 'English' ? 'Filipino' : 'English'))} /> : null)}
          {user ? (
            <>
              <Link
                href={user.role === 'patient' ? '/dashboard/patient' : '/dashboard/facility'}
                className="text-sm font-bold text-slate-600 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-bold text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition-all hover:bg-teal-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
