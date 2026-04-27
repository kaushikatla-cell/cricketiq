"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { buildSeasonStandings, computeWeeklyMvp } from "@/lib/analytics";
import { Button, Card, EmptyState } from "@/components/ui";
import { useCricketIQData } from "@/lib/useCricketIQ";

export default function SeasonsPage() {
  const { seasons, matches, players, addSeason, updateMatch, isReady, storageError, clearStorageError } = useCricketIQData();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [activeSeasonId, setActiveSeasonId] = useState("");

  const standings = useMemo(
    () => (activeSeasonId ? buildSeasonStandings(matches, activeSeasonId) : []),
    [matches, activeSeasonId]
  );
  const weeklyMvp = useMemo(
    () => (activeSeasonId ? computeWeeklyMvp(matches, players, activeSeasonId) : []),
    [matches, players, activeSeasonId]
  );

  if (!isReady) return null;

  const createSeason = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    addSeason({ name: name.trim(), notes: notes.trim() });
    setName("");
    setNotes("");
  };

  const seasonOptions = seasons.length ? seasons : [];
  const selectedSeason = seasonOptions.find((s) => s.id === activeSeasonId) || null;

  return (
    <AppShell
      title="Seasons & Tournaments"
      subtitle="Group matches, standings, and weekly MVP for structured seasons."
      storageError={storageError}
      onDismissStorageError={clearStorageError}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="text-lg font-semibold">Create season</h2>
          <form className="mt-3 space-y-3" onSubmit={createSeason}>
            <input className="w-full rounded-xl border border-slate-200 p-2" placeholder="Season name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea className="w-full rounded-xl border border-slate-200 p-2" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Button type="submit">Save season</Button>
          </form>
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase text-slate-500">Active season</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm"
              value={activeSeasonId}
              onChange={(e) => setActiveSeasonId(e.target.value)}
            >
              <option value="">Select a season</option>
              {seasonOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {!seasonOptions.length ? (
            <EmptyState title="No seasons yet" description="Create a season, then assign matches from the list below or when entering new matches." />
          ) : !activeSeasonId ? (
            <EmptyState title="Pick a season" description="Select an active season to view standings and weekly MVP." />
          ) : (
            <>
              <Card>
                <h3 className="font-semibold">Standings — {selectedSeason?.name}</h3>
                {standings.length ? (
                  <table className="mt-3 w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2 pr-2">Team</th>
                        <th className="py-2 pr-2">Wins</th>
                        <th className="py-2">Played</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row) => (
                        <tr key={row.team} className="border-b border-slate-100">
                          <td className="py-2 font-medium">{row.team}</td>
                          <td className="py-2">{row.wins}</td>
                          <td className="py-2">{row.played}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">No matches tagged to this season yet.</p>
                )}
              </Card>
              <Card>
                <h3 className="font-semibold">Weekly MVP (contribution index)</h3>
                {weeklyMvp.length ? (
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {weeklyMvp.map((row) => (
                      <li key={row.weekKey}>
                        <span className="font-mono text-xs text-slate-500">{row.weekKey}</span> — {row.playerName}{" "}
                        <span className="text-slate-500">({row.score})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">No weekly winners yet for this season.</p>
                )}
              </Card>
            </>
          )}

          <Card>
            <h3 className="font-semibold">Assign matches to season</h3>
            <p className="mt-1 text-sm text-slate-600">Update which season each logged match belongs to.</p>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
              {matches.length ? (
                matches.map((match) => (
                  <div key={match.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-2 text-sm">
                    <span className="text-slate-700">
                      {match.date} — {match.teamA} vs {match.teamB}
                    </span>
                    <select
                      className="rounded-lg border border-slate-200 p-1 text-xs"
                      value={match.seasonId || ""}
                      onChange={(e) => updateMatch(match.id, { seasonId: e.target.value || undefined })}
                    >
                      <option value="">Unassigned</option>
                      {seasonOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No matches logged yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
