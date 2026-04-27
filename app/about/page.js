"use client";

import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui";

export default function AboutPage() {
  return (
    <AppShell title="About CricketIQ" subtitle="Founder-level student product built for grassroots cricket intelligence.">
      <div className="grid gap-4">
        <Card>
          <h3 className="text-lg font-semibold">Mission</h3>
          <p className="mt-2 text-sm text-slate-600">
            CricketIQ helps local players turn casual matches into structured performance data, strategy, and community growth.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Origin Story</h3>
          <p className="mt-2 text-sm text-slate-600">
            This project began after a group of friends who played cricket in middle school stopped playing consistently in high school. CricketIQ was created to rebuild that community through technology, data, and competition.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Technical Architecture</h3>
          <p className="mt-2 text-sm text-slate-600">
            The MVP runs on Next.js App Router with Tailwind CSS, Recharts visualizations, and a localStorage-first data layer. A custom analytics engine computes batting, bowling, fielding, consistency, clutch, and overall CricketIQ scores from raw match events.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Future Vision</h3>
          <p className="mt-2 text-sm text-slate-600">
            Future releases will add innings-by-innings trend models, team chemistry metrics, authenticated club workspaces, and cloud-hosted datasets for inter-school leagues.
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-700">Built by Kaushik Atla.</p>
        </Card>
      </div>
    </AppShell>
  );
}
