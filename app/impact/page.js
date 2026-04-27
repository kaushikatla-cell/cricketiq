"use client";

import AppShell from "@/components/AppShell";
import { Card, EmptyState } from "@/components/ui";
import { useCricketIQData } from "@/lib/useCricketIQ";

export default function ImpactPage() {
  const { players, matches, playerAnalytics, totals, isReady } = useCricketIQData();
  if (!isReady) return null;
  if (!players.length && !matches.length) {
    return (
      <AppShell title="Impact Report" subtitle="Community and player development outcomes generated from real match data.">
        <EmptyState title="No impact data yet" description="Load sample data or add your own matches to generate an admissions-ready report." />
      </AppShell>
    );
  }

  const trendLeader = [...playerAnalytics].sort((a, b) => b.consistencyScore - a.consistencyScore)[0];
  const improved = [...playerAnalytics].sort((a, b) => b.clutchScore - a.clutchScore)[0];

  return (
    <AppShell title="Impact Report" subtitle="Community and player development outcomes generated from real match data.">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Players tracked</p><p className="text-3xl font-bold">{players.length}</p></Card>
        <Card><p className="text-sm text-slate-500">Matches recorded</p><p className="text-3xl font-bold">{matches.length}</p></Card>
        <Card><p className="text-sm text-slate-500">Balls analyzed</p><p className="text-3xl font-bold">{totals.totalBalls}</p></Card>
        <Card><p className="text-sm text-slate-500">Runs analyzed</p><p className="text-3xl font-bold">{totals.totalRuns}</p></Card>
        <Card><p className="text-sm text-slate-500">Wickets analyzed</p><p className="text-3xl font-bold">{totals.totalWickets}</p></Card>
        <Card><p className="text-sm text-slate-500">Strongest trend</p><p className="text-xl font-bold">{trendLeader?.name || "N/A"}</p></Card>
      </div>
      <Card className="mt-4">
        <h3 className="text-lg font-semibold">Narrative</h3>
        <p className="mt-2 text-sm text-slate-700">
          CricketIQ was built to revive and modernize a grassroots cricket community by turning informal games into structured data, feedback, and strategy.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Most improved player indicator: <span className="font-semibold">{improved?.name || "N/A"}</span> based on clutch contribution growth.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Community impact statement: This project created accountability, role clarity, and merit-based team selection in a student-run cricket environment.
        </p>
      </Card>
      <Card className="mt-4">
        <h3 className="text-lg font-semibold">Why This Matters</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Many amateur cricket players have no access to performance analytics.</li>
          <li>Organized data improves fairness, motivation, and team-building.</li>
          <li>CricketIQ combines computer science, sports analytics, and community leadership.</li>
        </ul>
      </Card>
    </AppShell>
  );
}
