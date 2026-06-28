"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, HelpCircle, LayoutDashboard, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '~/features/auth/context/AuthContext.jsx';
import { useTheme } from '~/features/auth/context/ThemeContext.jsx';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/quiz', label: 'Quiz', icon: HelpCircle },
  { to: '/contact', label: 'Contact', icon: Activity },
];

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

function SidebarContent({ user, logout, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const initials = getInitials(user?.username ?? user?.email ?? '?');
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/25">
            <Activity size={17} strokeWidth={2.5} aria-hidden="true" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-slate-800">DevPulse</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 cursor-pointer md:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2 mt-1 text-slate-400">
          Navigation
        </p>
        {NAV_LINKS.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to || pathname.startsWith(`${to}/`);
          return (
            <Link
              key={to}
              href={to}
              onClick={onClose}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150',
                isActive
                  ? theme === 'light'
                    ? 'bg-blue-100 text-blue-800 shadow-sm shadow-blue-200'
                    : 'bg-blue-900/40 text-blue-400 shadow-sm shadow-blue-900/20'
                  : theme === 'light'
                    ? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200',
              ].join(' ')}
            >
              <span
                className={`w-0.5 h-5 rounded-full shrink-0 transition-all duration-150 ${
                  isActive ? 'bg-blue-500' : 'bg-transparent'
                }`}
                aria-hidden="true"
              />
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100 dark:border-slate-700 shrink-0">
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors duration-150 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 select-none shadow-sm">
              {initials}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide leading-none mb-0.5 text-slate-400">
                Signed in
              </span>
              <span className="text-sm font-semibold truncate leading-tight text-slate-700">
                {user.username ?? user.email}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-slate-100 transition-all duration-150 cursor-pointer opacity-60 hover:opacity-100 active:scale-90"
            >
              {theme === 'light' ? <Moon size={14} aria-hidden="true" /> : <Sun size={14} aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition-all duration-150 cursor-pointer opacity-60 hover:opacity-100"
            >
              <LogOut size={14} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SidebarLayout({ children }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const openSidebar = useCallback(() => setMobileOpen(true), []);
  const closeSidebar = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 h-screen sticky top-0"
        aria-label="Application sidebar"
      >
        <SidebarContent user={user} logout={logout} onClose={null} />
      </aside>

      {mobileOpen && <div className="sidebar-overlay md:hidden" onClick={closeSidebar} aria-hidden="true" />}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col',
          'md:hidden transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0 dp-slide-in' : '-translate-x-full',
        ].join(' ')}
        aria-label="Mobile sidebar"
        aria-hidden={!mobileOpen}
      >
        <SidebarContent user={user} logout={logout} onClose={closeSidebar} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
          <button
            type="button"
            onClick={openSidebar}
            aria-label="Open sidebar"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <Activity size={13} className="text-white" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-slate-800">DevPulse</span>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8 overflow-y-auto dp-fade-in">{children}</main>
      </div>
    </div>
  );
}
