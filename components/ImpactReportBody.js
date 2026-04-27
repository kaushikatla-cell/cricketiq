import { Card } from "@/components/ui";

export default function ImpactReportBody({
  playersCount,
  matchesCount,
  totals,
  trendLeaderName,
  improvedName,
  showActions = false,
  onPrint,
}) {
  return (
    <div className="space-y-4">
      {showActions && onPrint ? (
        <div className="no-print flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={onPrint}
          >
            Print / Save as PDF
          </button>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Players tracked</p>
          <p className="text-3xl font-bold">{playersCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Matches recorded</p>
          <p className="text-3xl font-bold">{matchesCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Balls analyzed</p>
          <p className="text-3xl font-bold">{totals.totalBalls}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Runs analyzed</p>
          <p className="text-3xl font-bold">{totals.totalRuns}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Wickets analyzed</p>
          <p className="text-3xl font-bold">{totals.totalWickets}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Strongest trend</p>
          <p className="text-xl font-bold">{trendLeaderName || "N/A"}</p>
        </Card>
      </div>
      <Card>
        <h3 className="text-lg font-semibold">Narrative</h3>
        <p className="mt-2 text-sm text-slate-700">
          CricketIQ was built to revive and modernize a grassroots cricket community by turning informal games into structured data, feedback, and strategy.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Most improved player indicator: <span className="font-semibold">{improvedName || "N/A"}</span> based on clutch contribution growth.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Community impact statement: This project created accountability, role clarity, and merit-based team selection in a student-run cricket environment.
        </p>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold">Why This Matters</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Many amateur cricket players have no access to performance analytics.</li>
          <li>Organized data improves fairness, motivation, and team-building.</li>
          <li>CricketIQ combines computer science, sports analytics, and community leadership.</li>
        </ul>
      </Card>
      <p className="text-center text-xs text-slate-500">CricketIQ — by Kaushik Atla</p>
    </div>
  );
}
