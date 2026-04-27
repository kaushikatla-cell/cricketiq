"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Button, Card, EmptyState } from "@/components/ui";
import { useCricketIQData } from "@/lib/useCricketIQ";

const createBlankStat = (playerId) => ({
  playerId,
  runs: 0,
  ballsFaced: 0,
  fours: 0,
  sixes: 0,
  wickets: 0,
  oversBowled: 0,
  runsConceded: 0,
  catches: 0,
  runOuts: 0,
});

export default function MatchesPage() {
  const { players, matches, addMatch, isReady } = useCricketIQData();
  const [meta, setMeta] = useState({
    date: "",
    teamA: "",
    teamB: "",
    winner: "",
    venue: "",
    matchType: "T20",
  });
  const [stats, setStats] = useState([]);

  if (!isReady) return null;

  const updateStat = (playerId, key, value) => {
    setStats((prev) => {
      const exists = prev.some((row) => row.playerId === playerId);
      if (!exists) {
        return [...prev, { ...createBlankStat(playerId), [key]: Number(value) || 0 }];
      }
      return prev.map((row) => (row.playerId === playerId ? { ...row, [key]: Number(value) || 0 } : row));
    });
  };

  const submitMatch = (event) => {
    event.preventDefault();
    if (!meta.date || !meta.teamA || !meta.teamB) return;
    const normalizedStats = players.map((player) => stats.find((row) => row.playerId === player.id) || createBlankStat(player.id));
    addMatch({
      ...meta,
      stats: normalizedStats,
    });
    setMeta({ date: "", teamA: "", teamB: "", winner: "", venue: "", matchType: "T20" });
    setStats([]);
  };

  return (
    <AppShell title="Match Entry" subtitle="Capture detailed batting, bowling, and fielding match logs.">
      {!players.length ? (
        <EmptyState title="Players needed first" description="Add players before entering a match so individual stats can be mapped." />
      ) : (
        <form onSubmit={submitMatch} className="space-y-6">
          <Card>
            <div className="grid gap-3 md:grid-cols-3">
              <input className="rounded-xl border border-slate-200 p-2" type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} />
              <input className="rounded-xl border border-slate-200 p-2" placeholder="Team A name" value={meta.teamA} onChange={(e) => setMeta({ ...meta, teamA: e.target.value })} />
              <input className="rounded-xl border border-slate-200 p-2" placeholder="Team B name" value={meta.teamB} onChange={(e) => setMeta({ ...meta, teamB: e.target.value })} />
              <input className="rounded-xl border border-slate-200 p-2" placeholder="Winner" value={meta.winner} onChange={(e) => setMeta({ ...meta, winner: e.target.value })} />
              <input className="rounded-xl border border-slate-200 p-2" placeholder="Venue" value={meta.venue} onChange={(e) => setMeta({ ...meta, venue: e.target.value })} />
              <select className="rounded-xl border border-slate-200 p-2" value={meta.matchType} onChange={(e) => setMeta({ ...meta, matchType: e.target.value })}>
                <option value="T10">T10</option>
                <option value="T20">T20</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </Card>
          <Card>
            <h2 className="mb-4 text-lg font-semibold">Player Stats</h2>
            <div className="space-y-4">
              {players.map((player) => {
                const row = stats.find((entry) => entry.playerId === player.id) || createBlankStat(player.id);
                return (
                  <div key={player.id} className="rounded-xl border border-slate-200 p-3">
                    <p className="mb-2 font-semibold">{player.name}</p>
                    <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
                      {["runs", "ballsFaced", "fours", "sixes", "wickets", "oversBowled", "runsConceded", "catches", "runOuts"].map((key) => (
                        <label key={key} className="text-xs text-slate-600">
                          {key}
                          <input
                            className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm"
                            type="number"
                            step={key === "oversBowled" ? "0.1" : "1"}
                            value={row[key]}
                            onChange={(e) => updateStat(player.id, key, e.target.value)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button className="mt-4" type="submit">
              Save Match
            </Button>
          </Card>
          <Card>
            <h3 className="font-semibold">Recent Matches</h3>
            <div className="mt-2 space-y-2">
              {matches.slice(-5).reverse().map((match) => (
                <p key={match.id} className="text-sm text-slate-600">
                  {match.date} - {match.teamA} vs {match.teamB} ({match.matchType}) at {match.venue}
                </p>
              ))}
            </div>
          </Card>
        </form>
      )}
    </AppShell>
  );
}
