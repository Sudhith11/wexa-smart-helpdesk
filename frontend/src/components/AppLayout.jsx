import { BookOpen, Bot, LayoutDashboard, LogOut, Settings, Sparkles } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import StatusBadge from './StatusBadge';
import { useAuth } from '../store/authStore';

function navLinkClass({ isActive }) {
  return clsx(
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  );
}

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="surface-panel flex flex-col gap-6 rounded-[2rem] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
              <Bot className="h-7 w-7" />
            </div>

            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                <Sparkles className="h-4 w-4" />
                WEXA
              </p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Smart Helpdesk
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                AI-assisted support operations for WEXA, with ticket triage, knowledge base search,
                and transparent audit trails.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge value={user?.role} />
              <div className="text-sm">
                <p className="font-semibold text-slate-900">{user?.name}</p>
                <p className="text-slate-500">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-3">
          <NavLink to="/tickets" className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Tickets
          </NavLink>
          <NavLink to="/kb" className={navLinkClass}>
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </NavLink>
          {isAdmin() && (
            <NavLink to="/settings" className={navLinkClass}>
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
          )}
        </div>

        <main className="mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
