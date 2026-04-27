"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import ChartsPanel from "@/components/ChartsPanel";
import { Button, EmptyState, StatCard } from "@/components/ui";
import { downloadCsv } from "@/lib/csv";
import { useCricketIQData } from "@/lib/useCricketIQ";

export default function Home() {
  const { isReady, players, matches, totals, playerAnalytics, loadSample, resetData, storageError, clearStorageError } =
    useCricketIQData();

  if (!isReady) return null;

  const exportPlayerCsv = () => downloadCsv("cricketiq-players.csv", players);
  const exportMatchCsv = () => downloadCsv("cricketiq-matches.csv", matches);

  return (
    <AppShell
      title="CricketIQ"
      subtitle="Moneyball for grassroots cricket."
      storageError={storageError}
      onDismissStorageError={clearStorageError}
      actions={
        <>
          <Button onClick={loadSample}>Load Sample Data</Button>
          <Button className="bg-emerald-700 hover:bg-emerald-600" onClick={resetData}>
            Reset Data
          </Button>
        </>
      }
    >
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="max-w-3xl text-slate-600">
          CricketIQ helps local players turn casual matches into structured performance data, strategy, and community growth.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" href="/players">
            Add Player
          </Link>
          <Link className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" href="/matches">
            Add Match
          </Link>
          <Link className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200" href="/rankings">
            View Rankings
          </Link>
          <Link className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200" href="/best-xi">
            Generate Best XI
          </Link>
          <Link className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200" href="/seasons">
            Seasons
          </Link>
          <Button className="bg-emerald-700 hover:bg-emerald-600" onClick={exportPlayerCsv}>
            Export Player CSV
          </Button>
          <Button className="bg-emerald-700 hover:bg-emerald-600" onClick={exportMatchCsv}>
            Export Match CSV
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Players" value={players.length} />
        <StatCard label="Total Matches" value={matches.length} />
        <StatCard label="Total Runs" value={totals.totalRuns} accent="text-blue-700" />
        <StatCard label="Total Wickets" value={totals.totalWickets} accent="text-emerald-700" />
        <StatCard label="Average Team Score" value={totals.averageTeamScore.toFixed(1)} />
      </section>

      <div className="mt-6">
        {playerAnalytics.length ? (
          <ChartsPanel playerAnalytics={playerAnalytics} matches={matches} />
        ) : (
          <EmptyState
            title="No analytics yet"
            description="Load sample data or add your first player and match to unlock player intelligence and team strategy."
          />
        )}
      </div>
    </AppShell>
  );
}
