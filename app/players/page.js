"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Button, Card, EmptyState } from "@/components/ui";
import { getRoleRecommendation } from "@/lib/analytics";
import { useCricketIQData } from "@/lib/useCricketIQ";

const initialForm = {
  name: "",
  age: "",
  dominantSkill: "batting",
  battingHand: "right",
  bowlingStyle: "none",
  notes: "",
};

export default function PlayersPage() {
  const { players, addPlayer, playerAnalytics, isReady } = useCricketIQData();
  const [form, setForm] = useState(initialForm);

  if (!isReady) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    addPlayer({ ...form, age: Number(form.age) || 0 });
    setForm(initialForm);
  };

  return (
    <AppShell title="Player Management" subtitle="Add and manage player profiles for grassroots scouting intelligence.">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Add Player</h2>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <input className="w-full rounded-xl border border-slate-200 p-2" placeholder="Player name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="w-full rounded-xl border border-slate-200 p-2" placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <select className="w-full rounded-xl border border-slate-200 p-2" value={form.dominantSkill} onChange={(e) => setForm({ ...form, dominantSkill: e.target.value })}>
              <option value="batting">Batting</option>
              <option value="bowling">Bowling</option>
              <option value="all-rounder">All-Rounder</option>
              <option value="wicketkeeper">Wicketkeeper</option>
            </select>
            <select className="w-full rounded-xl border border-slate-200 p-2" value={form.battingHand} onChange={(e) => setForm({ ...form, battingHand: e.target.value })}>
              <option value="right">Right hand</option>
              <option value="left">Left hand</option>
            </select>
            <select className="w-full rounded-xl border border-slate-200 p-2" value={form.bowlingStyle} onChange={(e) => setForm({ ...form, bowlingStyle: e.target.value })}>
              <option value="pace">Pace</option>
              <option value="spin">Spin</option>
              <option value="none">None</option>
            </select>
            <textarea className="w-full rounded-xl border border-slate-200 p-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button type="submit">Save Player</Button>
          </form>
        </Card>
        <div className="lg:col-span-3">
          {players.length ? (
            <Card>
              <h2 className="mb-4 text-lg font-semibold">Player Dashboards</h2>
              <div className="space-y-3">
                {players.map((player) => (
                  <div key={player.id} className="rounded-xl border border-slate-200 p-3">
                    {(() => {
                      const row = playerAnalytics.find((item) => item.id === player.id);
                      const recommendation = row ? getRoleRecommendation(row) : { role: "Needs Data", explanation: "Add matches for analytics." };
                      return (
                        <>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-sm text-slate-500">Age {player.age || "-"}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {player.dominantSkill} | {player.battingHand}-hand | {player.bowlingStyle}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      CricketIQ: <span className="font-semibold">{row ? row.overallScore.toFixed(1) : "0.0"}</span> | Role:{" "}
                      <span className="font-semibold">{recommendation.role}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{player.notes}</p>
                    <p className="mt-1 text-xs text-slate-500">{recommendation.explanation}</p>
                        </>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <EmptyState title="No players added" description="Add your first player profile to start tracking grassroots performance." />
          )}
        </div>
      </div>
    </AppShell>
  );
}
