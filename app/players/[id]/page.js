"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppShell from "@/components/AppShell";
import { addRollingRunAverage, buildPlayerAnalytics, buildPlayerMatchTimeline, getRoleRecommendation } from "@/lib/analytics";
import { Card, EmptyState } from "@/components/ui";
import { useCricketIQData } from "@/lib/useCricketIQ";

export default function PlayerDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { players, matches, isReady, storageError, clearStorageError } = useCricketIQData();

  const player = players.find((p) => p.id === id);
  const analyticsRow = useMemo(() => {
    if (!player) return null;
    const rows = buildPlayerAnalytics([player], matches);
    return rows[0] || null;
  }, [player, matches]);

  const chartData = useMemo(() => {
    if (!player) return [];
    const timeline = buildPlayerMatchTimeline(player.id, matches);
    return addRollingRunAverage(timeline, 3);
  }, [player, matches]);

  if (!isReady) return null;

  if (!player) {
    return (
      <AppShell title="Player not found" subtitle="This player ID is not in your local roster." storageError={storageError} onDismissStorageError={clearStorageError}>
        <EmptyState title="Unknown player" description="Return to the roster and pick a valid player." />
        <Link className="mt-4 inline-block text-sm font-semibold text-blue-700" href="/players">
          Back to players
        </Link>
      </AppShell>
    );
  }

  const role = analyticsRow ? getRoleRecommendation(analyticsRow) : { role: "Needs Data", explanation: "Log matches to unlock recommendations." };

  return (
    <AppShell
      title={player.name}
      subtitle="Match-by-match performance and rolling batting form."
      storageError={storageError}
      onDismissStorageError={clearStorageError}
      actions={
        <Link className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200" href="/players">
          All players
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-slate-600">
            {player.dominantSkill} · {player.battingHand}-hand · {player.bowlingStyle}
            {player.age ? ` · Age ${player.age}` : ""}
          </p>
          {player.notes ? <p className="mt-2 text-sm text-slate-500">{player.notes}</p> : null}
          {analyticsRow ? (
            <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <p>
                CricketIQ: <span className="font-bold">{analyticsRow.overallScore.toFixed(1)}</span>
              </p>
              <p>
                Strike rate: <span className="font-semibold">{analyticsRow.strikeRate.toFixed(1)}</span>
              </p>
              <p>
                Avg runs/match: <span className="font-semibold">{analyticsRow.avgRuns.toFixed(1)}</span>
              </p>
              <p>
                Wickets (total): <span className="font-semibold">{analyticsRow.totalWickets}</span>
              </p>
            </div>
          ) : null}
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{role.role}</p>
            <p className="mt-1 text-slate-600">{role.explanation}</p>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Innings log</h3>
          <div className="mt-2 max-h-64 space-y-2 overflow-y-auto text-sm">
            {chartData.length ? (
              chartData.map((row) => (
                <div key={row.matchId} className="flex justify-between border-b border-slate-100 py-1">
                  <span className="text-slate-600">
                    {row.date} · {row.runs}/{row.ballsFaced}
                  </span>
                  <span className="text-slate-500">{row.wickets}w</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No innings yet.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h3 className="font-semibold">Runs & rolling average (last 3 innings)</h3>
        <div className="mt-4 h-72">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="runs" name="Runs" stroke="#1d4ed8" strokeWidth={2} />
                <Line type="monotone" dataKey="rollingRuns" name="Rolling avg" stroke="#059669" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No chart data" description="Add matches with this player in the lineup to see trends." />
          )}
        </div>
      </Card>
    </AppShell>
  );
}
