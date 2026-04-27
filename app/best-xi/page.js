"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Card, EmptyState } from "@/components/ui";
import { generateBestXI, getRoleRecommendation } from "@/lib/analytics";
import { useCricketIQData } from "@/lib/useCricketIQ";

export default function BestXIPage() {
  const { playerAnalytics, isReady, storageError, clearStorageError } = useCricketIQData();
  if (!isReady) return null;
  if (!playerAnalytics.length) {
    return (
      <AppShell
        title="Best XI Generator"
        subtitle="Automated team composition from player impact profiles."
        storageError={storageError}
        onDismissStorageError={clearStorageError}
      >
        <EmptyState title="No players available" description="Add player and match data to generate your starting XI." />
      </AppShell>
    );
  }

  const bestXI = generateBestXI(playerAnalytics);
  return (
    <AppShell
      title="Best XI Generator"
      subtitle="Automated team composition from player impact profiles."
      storageError={storageError}
      onDismissStorageError={clearStorageError}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold">{bestXI.isBestAvailable ? "Best Available XI" : "Recommended Best XI"}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {bestXI.lineup.map((player, index) => {
              const rec = getRoleRecommendation(player);
              return (
                <div key={player.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="font-semibold">
                    {index + 1}.{" "}
                    <Link className="text-blue-700 hover:underline" href={`/players/${player.id}`}>
                      {player.name}
                    </Link>
                  </p>
                  <p className="text-sm text-slate-600">{rec.role}</p>
                  <p className="text-sm text-slate-500">Score {player.overallScore.toFixed(1)}</p>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Recommended Batting Order</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {bestXI.battingOrder.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ol>
        </Card>
        <Card>
          <h3 className="font-semibold">Bowling Options</h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {bestXI.bowlingOptions.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="font-semibold">Team Balance Explanation</h3>
          <p className="mt-2 text-sm text-slate-600">{bestXI.balanceSummary}</p>
        </Card>
      </div>
    </AppShell>
  );
}
