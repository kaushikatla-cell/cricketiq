"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/players", label: "Players" },
  { href: "/matches", label: "Matches" },
  { href: "/seasons", label: "Seasons" },
  { href: "/rankings", label: "Rankings" },
  { href: "/best-xi", label: "Best XI" },
  { href: "/predictor", label: "Predictor" },
  { href: "/impact", label: "Impact Report" },
  { href: "/about", label: "About" },
];

function isNavActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppShell({ title, subtitle, actions, storageError, onDismissStorageError, children }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">CricketIQ by Kaushik Atla</p>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
          <nav className="mt-4 flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isNavActive(pathname, item.href) ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {storageError ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 print:hidden">
            <span>{storageError}</span>
            {onDismissStorageError ? (
              <button type="button" className="rounded-lg bg-amber-900 px-3 py-1 text-xs font-semibold text-white" onClick={onDismissStorageError}>
                Dismiss
              </button>
            ) : null}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
