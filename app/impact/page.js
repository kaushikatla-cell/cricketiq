"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import ImpactReportBody from "@/components/ImpactReportBody";
import { EmptyState } from "@/components/ui";
import { useCricketIQData } from "@/lib/useCricketIQ";

export default function ImpactPage() {
  const { players, matches, playerAnalytics, totals, isReady, storageError, clearStorageError } = useCricketIQData();

  if (!isReady) return null;
  if (!players.length && !matches.length) {
    return (
      <AppShell
        title="Impact Report"
        subtitle="Community and player development outcomes generated from real match data."
        storageError={storageError}
        onDismissStorageError={clearStorageError}
      >
        <EmptyState title="No impact data yet" description="Load sample data or add your own matches to generate an admissions-ready report." />
      </AppShell>
    );
  }

  const trendLeader = [...playerAnalytics].sort((a, b) => b.consistencyScore - a.consistencyScore)[0];
  const improved = [...playerAnalytics].sort((a, b) => b.clutchScore - a.clutchScore)[0];

  return (
    <AppShell
      title="Impact Report"
      subtitle="Community and player development outcomes generated from real match data."
      storageError={storageError}
      onDismissStorageError={clearStorageError}
      actions={
        <Link className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200" href="/impact/print">
          Minimal print page
        </Link>
      }
    >
      <ImpactReportBody
        playersCount={players.length}
        matchesCount={matches.length}
        totals={totals}
        trendLeaderName={trendLeader?.name}
        improvedName={improved?.name}
        showActions
        onPrint={() => window.print()}
      />
    </AppShell>
  );
}
