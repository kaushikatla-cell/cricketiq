"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Card } from "@/components/ui";

const PIE_COLORS = ["#0f172a", "#1d4ed8", "#059669", "#0ea5e9", "#6366f1", "#f59e0b"];

export default function ChartsPanel({ playerAnalytics, matches }) {
  const topOverall = [...playerAnalytics]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 6)
    .map((p) => ({ name: p.name, score: Number(p.overallScore.toFixed(1)) }));

  const compare = [...playerAnalytics]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 4)
    .map((p) => ({
      name: p.name.split(" ")[0],
      Batting: Number(p.battingImpact.toFixed(1)),
      Bowling: Number(p.bowlingImpact.toFixed(1)),
      Fielding: Number(p.fieldingImpact.toFixed(1)),
    }));

  const runsTrend = matches.map((match) => ({
    date: match.date,
    runs: (match.stats || []).reduce((sum, stat) => sum + (Number(stat.runs) || 0), 0),
  }));

  const roleCountMap = playerAnalytics.reduce((map, player) => {
    const role = player.dominantSkill;
    map[role] = (map[role] || 0) + 1;
    return map;
  }, {});

  const roleDist = Object.entries(roleCountMap).map(([role, count]) => ({ role, count }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="mb-4 font-semibold">Top Players by CricketIQ Score</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topOverall}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 font-semibold">Batting vs Bowling vs Fielding</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={compare}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <Radar name="Batting" dataKey="Batting" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
              <Radar name="Bowling" dataKey="Bowling" stroke="#059669" fill="#059669" fillOpacity={0.3} />
              <Radar name="Fielding" dataKey="Fielding" stroke="#0f172a" fill="#0f172a" fillOpacity={0.2} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 font-semibold">Runs Over Matches</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={runsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="runs" stroke="#0f766e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 font-semibold">Player Role Distribution</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={roleDist} dataKey="count" nameKey="role" outerRadius={90} label>
                {roleDist.map((entry, index) => (
                  <Cell key={entry.role} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
