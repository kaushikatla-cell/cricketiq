"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">{error?.message || "An unexpected error occurred in CricketIQ."}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => reset()}>
          Try again
        </button>
        <Link href="/" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
          Home
        </Link>
      </div>
    </div>
  );
}
