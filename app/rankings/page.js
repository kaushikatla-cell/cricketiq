"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { Button, Card, EmptyState } from "@/components/ui";
import { buildRankings } from "@/lib/analytics";
import { downloadCsv } from "@/lib/csv";
import { useCricketIQData } from "@/lib/useCricketIQ";

const metricOptions = [
  { value: "overallScore", label: "Overall Ranking", keyStat: "overallScore" },
  { value: "battingImpact", label: "Batting Ranking", keyStat: "strikeRate" },
  { value: "bowlingImpact", label: "Bowling Ranking", keyStat: "totalWickets" },
  { value: "fieldingImpact", label: "Fielding Ranking", keyStat: "catches" },
  { value: "consistencyScore", label: "Consistency Ranking", keyStat: "consistencyScore" },
];

export default function RankingsPage() {
  const { playerAnalytics, isReady } = useCricketIQData();
  const [metric, setMetric] = useState("overallScore");
  const selectedMeta = metricOptions.find((opt) => opt.value === metric);

  const rankings = useMemo(() => buildRankings(playerAnalytics, metric), [playerAnalytics, metric]);
  if (!isReady) return null;

  const exportRankings = () => {
    downloadCsv(
      "cricketiq-rankings.csv",
      rankings.map((row) => ({
        rank: row.rank,
        name: row.name,
        role: row.role,
        badge: row.badge,
        overallScore: row.overallScore.toFixed(1),
        battingImpact: row.battingImpact.toFixed(1),
        bowlingImpact: row.bowlingImpact.toFixed(1),
        fieldingImpact: row.fieldingImpact.toFixed(1),
        consistencyScore: row.consistencyScore.toFixed(1),
      }))
    );
  };

  return (
    <AppShell
      title="Rankings"
      subtitle="Sortable player intelligence boards with role recommendations and badges."
      actions={<Button onClick={exportRankings}>Export Rankings CSV</Button>}
    >
      {!rankings.length ? (
        <EmptyState title="Not enough data yet" description="Add players and matches to generate CricketIQ rankings." />
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex flex-wrap gap-2">
              {metricOptions.map((option) => (
                <button
                  key={option.value}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ${
                    metric === option.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => setMetric(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {rankings.map((player) => (
              <Card key={player.id}>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">#{player.rank} {player.name}</p>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">{player.badge}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{player.role}</p>
                <p className="mt-2 text-sm text-slate-600">
                  CricketIQ Score: <span className="font-semibold">{player.overallScore.toFixed(1)}</span>
                </p>
                <p className="text-sm text-slate-600">
                  Key Stat: <span className="font-semibold">{selectedMeta.keyStat === "strikeRate" ? player.strikeRate.toFixed(1) : player[selectedMeta.keyStat].toFixed(1)}</span>
                </p>
                <p className="mt-2 text-sm text-slate-500">{player.explanation}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
