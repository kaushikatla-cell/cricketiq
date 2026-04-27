import { describe, expect, it } from "vitest";
import {
  addRollingRunAverage,
  buildPlayerAnalytics,
  buildSeasonStandings,
  filterMatchesBySeason,
  predictMatch,
} from "../lib/analytics.js";

describe("filterMatchesBySeason", () => {
  it("returns all matches when seasonId is falsy", () => {
    const matches = [{ id: "1", seasonId: "a" }, { id: "2" }];
    expect(filterMatchesBySeason(matches, null).length).toBe(2);
    expect(filterMatchesBySeason(matches, "").length).toBe(2);
    expect(filterMatchesBySeason(matches, undefined).length).toBe(2);
  });

  it("filters by seasonId", () => {
    const matches = [{ id: "1", seasonId: "s1" }, { id: "2", seasonId: "s2" }];
    expect(filterMatchesBySeason(matches, "s1").map((m) => m.id)).toEqual(["1"]);
  });
});

describe("buildSeasonStandings", () => {
  it("counts wins and games played", () => {
    const matches = [
      { teamA: "A", teamB: "B", winner: "A", seasonId: "s1" },
      { teamA: "A", teamB: "B", winner: "B", seasonId: "s1" },
    ];
    const rows = buildSeasonStandings(matches, "s1");
    const byName = Object.fromEntries(rows.map((r) => [r.team, r]));
    expect(byName.A.played).toBe(2);
    expect(byName.B.played).toBe(2);
    expect(byName.A.wins).toBe(1);
    expect(byName.B.wins).toBe(1);
  });
});

describe("predictMatch", () => {
  it("returns win probabilities that sum to ~100", () => {
    const teamA = [
      { battingImpact: 80, bowlingImpact: 70, fieldingImpact: 60, consistencyScore: 70 },
    ];
    const teamB = [
      { battingImpact: 50, bowlingImpact: 50, fieldingImpact: 50, consistencyScore: 50 },
    ];
    const out = predictMatch(teamA, teamB);
    expect(out.teamAWin + out.teamBWin).toBeCloseTo(100, 5);
    expect(out.teamAWin).toBeGreaterThan(out.teamBWin);
  });
});

describe("buildPlayerAnalytics", () => {
  it("scopes stats to a season when seasonId is passed", () => {
    const players = [
      { id: "p1", name: "Test", dominantSkill: "batting", battingHand: "right", bowlingStyle: "none", notes: "" },
    ];
    const matches = [
      {
        id: "m1",
        seasonId: "s1",
        winner: "X",
        stats: [{ playerId: "p1", runs: 50, ballsFaced: 30, fours: 5, sixes: 1, wickets: 0, oversBowled: 0, runsConceded: 0, catches: 0, runOuts: 0 }],
      },
      {
        id: "m2",
        seasonId: "s2",
        winner: "Y",
        stats: [{ playerId: "p1", runs: 0, ballsFaced: 5, fours: 0, sixes: 0, wickets: 0, oversBowled: 0, runsConceded: 0, catches: 0, runOuts: 0 }],
      },
    ];
    const all = buildPlayerAnalytics(players, matches);
    const s1only = buildPlayerAnalytics(players, matches, { seasonId: "s1" });
    expect(all[0].totalRuns).toBe(50);
    expect(s1only[0].totalRuns).toBe(50);
    expect(s1only[0].matchesPlayed).toBe(1);
  });
});

describe("addRollingRunAverage", () => {
  it("computes trailing mean of runs", () => {
    const timeline = [{ runs: 10 }, { runs: 20 }, { runs: 30 }];
    const out = addRollingRunAverage(timeline, 2);
    expect(out[0].rollingRuns).toBe(10);
    expect(out[1].rollingRuns).toBe(15);
    expect(out[2].rollingRuns).toBe(25);
  });
});
