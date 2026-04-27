"use client";

import ImpactReportBody from "@/components/ImpactReportBody";
import { EmptyState } from "@/components/ui";
import { useCricketIQData } from "@/lib/useCricketIQ";

export default function ImpactPrintPage() {
  const { players, matches, playerAnalytics, totals, isReady } = useCricketIQData();

  if (!isReady) return null;

  if (!players.length && !matches.length) {
    return (
      <div className="min-h-screen bg-white p-8">
        <EmptyState title="No data" description="Add matches first, then return to this print view." />
      </div>
    );
  }

  const trendLeader = [...playerAnalytics].sort((a, b) => b.consistencyScore - a.consistencyScore)[0];
  const improved = [...playerAnalytics].sort((a, b) => b.clutchScore - a.clutchScore)[0];

  return (
    <div className="min-h-screen bg-white p-8 text-slate-900 print:p-6">
      <h1 className="text-2xl font-bold">CricketIQ — Impact Report</h1>
      <p className="mt-1 text-sm text-slate-600">Moneyball for grassroots cricket · Kaushik Atla</p>
      <div className="mt-6">
        <ImpactReportBody
          playersCount={players.length}
          matchesCount={matches.length}
          totals={totals}
          trendLeaderName={trendLeader?.name}
          improvedName={improved?.name}
          showActions
          onPrint={() => window.print()}
        />
      </div>
    </div>
  );
}
