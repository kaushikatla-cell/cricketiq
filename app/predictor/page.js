"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { Button, Card, EmptyState } from "@/components/ui";
import { predictMatch } from "@/lib/analytics";
import { useCricketIQData } from "@/lib/useCricketIQ";

export default function PredictorPage() {
  const { playerAnalytics, isReady } = useCricketIQData();
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);

  const prediction = useMemo(() => {
    const a = playerAnalytics.filter((player) => teamA.includes(player.id));
    const b = playerAnalytics.filter((player) => teamB.includes(player.id));
    if (!a.length || !b.length) return null;
    return predictMatch(a, b);
  }, [playerAnalytics, teamA, teamB]);

  if (!isReady) return null;
  if (!playerAnalytics.length) {
    return (
      <AppShell title="Match Predictor" subtitle="Probability engine based on composite team strengths.">
        <EmptyState title="No model input" description="Add players and match stats to activate predictions." />
      </AppShell>
    );
  }

  const togglePlayer = (teamSetter, team, playerId) => {
    if (team.includes(playerId)) {
      teamSetter(team.filter((id) => id !== playerId));
    } else {
      teamSetter([...team, playerId]);
    }
  };

  return (
    <AppShell title="Match Predictor" subtitle="Probability engine based on composite team strengths.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Team A Selection</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {playerAnalytics.map((player) => (
              <Button
                key={player.id}
                className={teamA.includes(player.id) ? "bg-blue-700 hover:bg-blue-600" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}
                onClick={() => togglePlayer(setTeamA, teamA, player.id)}
              >
                {player.name}
              </Button>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Team B Selection</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {playerAnalytics.map((player) => (
              <Button
                key={player.id}
                className={teamB.includes(player.id) ? "bg-emerald-700 hover:bg-emerald-600" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}
                onClick={() => togglePlayer(setTeamB, teamB, player.id)}
              >
                {player.name}
              </Button>
            ))}
          </div>
        </Card>
      </div>
      {prediction ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold">Team A Win Probability</h3>
            <p className="mt-2 text-4xl font-bold text-blue-700">{prediction.teamAWin.toFixed(1)}%</p>
            <p className="text-sm text-slate-600">Batting {prediction.teamA.battingStrength.toFixed(1)} | Bowling {prediction.teamA.bowlingStrength.toFixed(1)}</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Team B Win Probability</h3>
            <p className="mt-2 text-4xl font-bold text-emerald-700">{prediction.teamBWin.toFixed(1)}%</p>
            <p className="text-sm text-slate-600">Batting {prediction.teamB.battingStrength.toFixed(1)} | Bowling {prediction.teamB.bowlingStrength.toFixed(1)}</p>
          </Card>
          <Card className="md:col-span-2">
            <h3 className="font-semibold">Key Advantage</h3>
            <p className="mt-2 text-sm text-slate-600">{prediction.advantage}</p>
            <p className="mt-1 text-sm text-slate-500">
              teamStrength = 0.45*batting + 0.35*bowling + 0.10*fielding + 0.10*consistency
            </p>
          </Card>
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState title="Select two teams" description="Pick at least one player for each team to generate win probability." />
        </div>
      )}
    </AppShell>
  );
}
