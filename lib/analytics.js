function safeNumber(value) {
  return Number(value) || 0;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values) {
  if (values.length < 2) return 0;
  const mean = average(values);
  const variance = average(values.map((v) => (v - mean) ** 2));
  return Math.sqrt(variance);
}

function normalizeMetrics(rows, field) {
  const values = rows.map((row) => safeNumber(row[field]));
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  return rows.map((row) => {
    if (max === min) return { ...row, [field]: 0 };
    const normalized = ((safeNumber(row[field]) - min) / (max - min)) * 100;
    return { ...row, [field]: Math.max(0, Math.min(100, normalized)) };
  });
}

export function buildPlayerAnalytics(players, matches) {
  const rows = players.map((player) => {
    const innings = [];
    const overs = [];
    const conceded = [];
    let fours = 0;
    let sixes = 0;
    let ballsFaced = 0;
    let wickets = 0;
    let catches = 0;
    let runOuts = 0;
    let clutchRaw = 0;

    matches.forEach((match) => {
      const stat = (match.stats || []).find((entry) => entry.playerId === player.id);
      if (!stat) return;
      innings.push(safeNumber(stat.runs));
      overs.push(safeNumber(stat.oversBowled));
      conceded.push(safeNumber(stat.runsConceded));
      fours += safeNumber(stat.fours);
      sixes += safeNumber(stat.sixes);
      ballsFaced += safeNumber(stat.ballsFaced);
      wickets += safeNumber(stat.wickets);
      catches += safeNumber(stat.catches);
      runOuts += safeNumber(stat.runOuts);

      if (match.winner) {
        clutchRaw += safeNumber(stat.runs) * 0.5 + safeNumber(stat.wickets) * 12;
      }
    });

    const matchesPlayed = innings.length;
    const totalRuns = innings.reduce((sum, runs) => sum + runs, 0);
    const totalOvers = overs.reduce((sum, value) => sum + value, 0);
    const totalConceded = conceded.reduce((sum, value) => sum + value, 0);
    const avgRuns = matchesPlayed ? totalRuns / matchesPlayed : 0;
    const strikeRate = ballsFaced ? (totalRuns / ballsFaced) * 100 : 0;
    const boundaryPct = ballsFaced ? ((fours + sixes) / ballsFaced) * 100 : 0;
    const wicketsPerMatch = matchesPlayed ? wickets / matchesPlayed : 0;
    const economy = totalOvers ? totalConceded / totalOvers : 0;
    const stdDev = standardDeviation(innings);
    const consistencyRaw = matchesPlayed < 2 ? (matchesPlayed === 1 ? 55 : 0) : Math.max(0, 100 - stdDev * 3.5);

    // Weighted batting impact tuned for T10/T20 grassroots game phases.
    const battingImpactRaw = avgRuns * 0.45 + strikeRate * 0.35 + boundaryPct * 0.2;
    // Bowling impact rewards wickets heavily while still valuing economy control.
    const bowlingImpactRaw = wicketsPerMatch * 35 + Math.max(0, 10 - economy) * 5 + wickets * 1.5;
    const fieldingImpactRaw = catches * 8 + runOuts * 10;

    return {
      ...player,
      matchesPlayed,
      totalRuns,
      avgRuns,
      strikeRate,
      boundaryPct,
      totalWickets: wickets,
      wicketsPerMatch,
      economy,
      catches,
      runOuts,
      battingImpact: battingImpactRaw,
      bowlingImpact: bowlingImpactRaw,
      fieldingImpact: fieldingImpactRaw,
      clutchScore: clutchRaw,
      consistencyScore: consistencyRaw,
    };
  });

  let scored = normalizeMetrics(rows, "battingImpact");
  scored = normalizeMetrics(scored, "bowlingImpact");
  scored = normalizeMetrics(scored, "fieldingImpact");
  scored = normalizeMetrics(scored, "clutchScore");
  scored = normalizeMetrics(scored, "consistencyScore");

  return scored.map((row) => {
    const allRounderScore = row.battingImpact * 0.5 + row.bowlingImpact * 0.5;
    const overallScore =
      row.battingImpact * 0.4 +
      row.bowlingImpact * 0.35 +
      row.fieldingImpact * 0.15 +
      row.consistencyScore * 0.1;

    return {
      ...row,
      allRounderScore,
      overallScore: Math.max(0, Math.min(100, overallScore)),
    };
  });
}

export function getRoleRecommendation(player) {
  if (player.dominantSkill === "wicketkeeper") {
    return {
      role: "Wicketkeeper",
      explanation: "Recommended as Wicketkeeper due to dominant keeping profile and fielding value.",
    };
  }
  if (player.battingImpact > 70 && player.strikeRate > 140 && player.boundaryPct > 22) {
    return {
      role: "Power Hitter",
      explanation: "Recommended as Power Hitter because this player has a high strike rate and boundary rate.",
    };
  }
  if (player.battingImpact > 65 && player.consistencyScore > 65 && player.avgRuns > 25) {
    return {
      role: "Anchor",
      explanation: "Recommended as Anchor because this player combines run volume with strong consistency.",
    };
  }
  if (player.totalWickets > 4 && player.wicketsPerMatch >= 1.5) {
    return {
      role: "Strike Bowler",
      explanation: "Recommended as Strike Bowler because this player consistently takes wickets per match.",
    };
  }
  if (player.economy > 0 && player.economy < 6.5 && player.bowlingImpact > 55) {
    return {
      role: "Economy Bowler",
      explanation: "Recommended as Economy Bowler because this player controls run flow with a low economy rate.",
    };
  }
  if (player.battingImpact > 52 && player.bowlingImpact > 52) {
    return {
      role: "All-Rounder",
      explanation: "Recommended as All-Rounder due to balanced batting and bowling impact.",
    };
  }
  if (player.battingImpact > 50 && player.strikeRate > 120 && player.matchesPlayed > 1) {
    return {
      role: "Finisher",
      explanation: "Recommended as Finisher based on high-tempo batting profile suited to late overs.",
    };
  }
  return {
    role: "Utility Player",
    explanation: "Recommended as Utility Player because this player contributes across phases without one dominant metric yet.",
  };
}

export function getBadge(player) {
  if (player.matchesPlayed < 2) return "Needs Data";
  if (player.overallScore >= 80) return "Elite";
  if (player.overallScore >= 62) return "Rising";
  return player.bowlingImpact > 70 || player.battingImpact > 70 || player.fieldingImpact > 70
    ? "Specialist"
    : "Rising";
}

export function buildRankings(playersWithScores, metric = "overallScore") {
  return [...playersWithScores]
    .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
    .map((player, index) => ({
      ...player,
      rank: index + 1,
      ...getRoleRecommendation(player),
      badge: getBadge(player),
    }));
}

export function generateBestXI(playersWithScores) {
  const selected = new Map();
  const pickFrom = (sortedPlayers, count) => {
    sortedPlayers.forEach((player) => {
      if (selected.size >= 11) return;
      if (selected.has(player.id)) return;
      if ([...selected.values()].length >= count && count !== 11) return;
      selected.set(player.id, player);
    });
  };

  pickFrom([...playersWithScores].sort((a, b) => b.battingImpact - a.battingImpact), 4);
  pickFrom([...playersWithScores].sort((a, b) => b.bowlingImpact - a.bowlingImpact), 7);
  pickFrom([...playersWithScores].sort((a, b) => b.allRounderScore - a.allRounderScore), 9);

  const keepers = playersWithScores.filter((p) => p.dominantSkill === "wicketkeeper");
  if (keepers.length) {
    const bestKeeper = keepers.sort((a, b) => b.overallScore - a.overallScore)[0];
    if (!selected.has(bestKeeper.id) && selected.size < 11) selected.set(bestKeeper.id, bestKeeper);
  }

  pickFrom([...playersWithScores].sort((a, b) => b.overallScore - a.overallScore), 11);

  const xi = [...selected.values()];
  const battingOrder = [...xi].sort((a, b) => b.battingImpact - a.battingImpact).map((p) => p.name);
  const bowlingOptions = [...xi]
    .filter((p) => p.bowlingImpact > 20 || p.dominantSkill === "bowling" || p.dominantSkill === "all-rounder")
    .sort((a, b) => b.bowlingImpact - a.bowlingImpact)
    .map((p) => p.name);

  return {
    lineup: xi,
    battingOrder,
    bowlingOptions,
    balanceSummary:
      "Lineup prioritizes top batting impact, wicket-taking bowlers, and dual-skill all-rounders while avoiding duplicates.",
    isBestAvailable: xi.length < 11,
  };
}

export function predictMatch(teamAPlayers, teamBPlayers) {
  const strength = (team) => {
    const battingStrength = average(team.map((p) => p.battingImpact));
    const bowlingStrength = average(team.map((p) => p.bowlingImpact));
    const fieldingStrength = average(team.map((p) => p.fieldingImpact));
    const consistency = average(team.map((p) => p.consistencyScore));
    const teamStrength = battingStrength * 0.45 + bowlingStrength * 0.35 + fieldingStrength * 0.1 + consistency * 0.1;
    return { battingStrength, bowlingStrength, fieldingStrength, consistency, teamStrength };
  };

  const a = strength(teamAPlayers);
  const b = strength(teamBPlayers);
  const total = Math.max(a.teamStrength + b.teamStrength, 1);
  const teamAWin = (a.teamStrength / total) * 100;
  const teamBWin = 100 - teamAWin;

  const advantage =
    a.teamStrength > b.teamStrength ? "Team A has the stronger composite profile." : "Team B has the stronger composite profile.";

  return { teamA: a, teamB: b, teamAWin, teamBWin, advantage };
}
