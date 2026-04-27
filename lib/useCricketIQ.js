"use client";

import { useEffect, useMemo, useState } from "react";
import { buildPlayerAnalytics, buildRankings } from "@/lib/analytics";
import { sampleMatches, samplePlayers } from "@/lib/sampleData";
import { getMatches, getPlayers, resetAllData, saveMatches, savePlayers } from "@/lib/storage";

export function useCricketIQData() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const nextPlayers = getPlayers();
    const nextMatches = getMatches();
    const timer = setTimeout(() => {
      setPlayers(nextPlayers);
      setMatches(nextMatches);
      setIsReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const addPlayer = (player) => {
    const next = [...players, { ...player, id: crypto.randomUUID() }];
    setPlayers(next);
    savePlayers(next);
  };

  const addMatch = (match) => {
    const next = [...matches, { ...match, id: crypto.randomUUID() }];
    setMatches(next);
    saveMatches(next);
  };

  const loadSample = () => {
    setPlayers(samplePlayers);
    setMatches(sampleMatches);
    savePlayers(samplePlayers);
    saveMatches(sampleMatches);
  };

  const resetData = () => {
    resetAllData();
    setPlayers([]);
    setMatches([]);
  };

  const playerAnalytics = useMemo(() => buildPlayerAnalytics(players, matches), [players, matches]);
  const overallRanking = useMemo(() => buildRankings(playerAnalytics, "overallScore"), [playerAnalytics]);

  const totals = useMemo(() => {
    const allStats = matches.flatMap((match) => match.stats || []);
    const totalRuns = allStats.reduce((sum, stat) => sum + (Number(stat.runs) || 0), 0);
    const totalWickets = allStats.reduce((sum, stat) => sum + (Number(stat.wickets) || 0), 0);
    const totalBalls = allStats.reduce((sum, stat) => sum + (Number(stat.ballsFaced) || 0), 0);
    const averageTeamScore = matches.length
      ? matches.reduce((sum, match) => {
          const matchRuns = (match.stats || []).reduce((r, stat) => r + (Number(stat.runs) || 0), 0);
          return sum + matchRuns / 2;
        }, 0) / matches.length
      : 0;
    return { totalRuns, totalWickets, totalBalls, averageTeamScore };
  }, [matches]);

  return {
    isReady,
    players,
    matches,
    playerAnalytics,
    overallRanking,
    totals,
    addPlayer,
    addMatch,
    loadSample,
    resetData,
  };
}
