"use client";

import { useEffect, useMemo, useState } from "react";
import { buildPlayerAnalytics, buildRankings } from "@/lib/analytics";
import { sampleMatches, samplePlayers, sampleSeasons } from "@/lib/sampleData";
import {
  getMatches,
  getPlayers,
  getSeasons,
  resetAllData,
  saveMatches,
  savePlayers,
  saveSeasons,
} from "@/lib/storage";

function mergeStorageErrors(...results) {
  const failed = results.find((r) => r && !r.ok);
  return failed?.error || null;
}

export function useCricketIQData() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [storageError, setStorageError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const nextPlayers = getPlayers();
    const nextMatches = getMatches();
    const nextSeasons = getSeasons();
    const timer = setTimeout(() => {
      setPlayers(nextPlayers);
      setMatches(nextMatches);
      setSeasons(nextSeasons);
      setIsReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const clearStorageError = () => setStorageError(null);

  const addPlayer = (player) => {
    const next = [...players, { ...player, id: crypto.randomUUID() }];
    setPlayers(next);
    const result = savePlayers(next);
    setStorageError(result.ok ? null : result.error);
  };

  const addMatch = (match) => {
    const next = [...matches, { ...match, id: crypto.randomUUID() }];
    setMatches(next);
    const result = saveMatches(next);
    setStorageError(result.ok ? null : result.error);
  };

  const updateMatch = (matchId, patch) => {
    const next = matches.map((m) => (m.id === matchId ? { ...m, ...patch } : m));
    setMatches(next);
    const result = saveMatches(next);
    setStorageError(result.ok ? null : result.error);
  };

  const addSeason = (season) => {
    const next = [...seasons, { ...season, id: crypto.randomUUID() }];
    setSeasons(next);
    const result = saveSeasons(next);
    setStorageError(result.ok ? null : result.error);
  };

  const loadSample = () => {
    setPlayers(samplePlayers);
    setMatches(sampleMatches);
    setSeasons(sampleSeasons);
    const err = mergeStorageErrors(savePlayers(samplePlayers), saveMatches(sampleMatches), saveSeasons(sampleSeasons));
    setStorageError(err);
  };

  const resetData = () => {
    resetAllData();
    setPlayers([]);
    setMatches([]);
    setSeasons([]);
    setStorageError(null);
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
    seasons,
    playerAnalytics,
    overallRanking,
    totals,
    storageError,
    clearStorageError,
    addPlayer,
    addMatch,
    updateMatch,
    addSeason,
    loadSample,
    resetData,
  };
}
