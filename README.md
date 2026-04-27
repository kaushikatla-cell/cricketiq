# CricketIQ

[![CI](https://github.com/kaushikatla-cell/cricketiq/actions/workflows/ci.yml/badge.svg)](https://github.com/kaushikatla-cell/cricketiq/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Demo-Vercel-000000?logo=vercel)](https://cricketiq-alpha.vercel.app)

**Moneyball for grassroots cricket.**

CricketIQ is a **tier-1 extracurricular–grade** full-stack product: a serious analytics and strategy platform for **amateur and student-run cricket**, not a toy school demo. It turns informal matches into **structured stats**, **rankings**, **role intelligence**, **Best XI** composition, **match win probability**, and an **admissions-ready impact narrative**.

**Author:** [Kaushik Atla](https://github.com/kaushikatla-cell)

**Live demo:** [cricketiq-alpha.vercel.app](https://cricketiq-alpha.vercel.app)

**Repository:** [github.com/kaushikatla-cell/cricketiq](https://github.com/kaushikatla-cell/cricketiq)

---

## Why this project exists (problem statement)

Most grassroots cricketers never see **objective performance feedback**. Selection can feel arbitrary, improvement is hard to measure, and communities lose momentum when play becomes irregular. CricketIQ gives student leaders a **credible, data-backed** way to run squads, run seasons, and tell a **measurable community story**—the kind of work that reads well to **admissions**, **hackathons**, **clubs**, and **mentors**.

## What you get (features)

| Area | Capability |
|------|----------------|
| **Operations** | Add players, log matches, per-player batting / bowling / fielding lines |
| **Intelligence** | CricketIQ score (0–100), consistency, clutch-style signals, role recommendations with explanations |
| **Competition** | Sortable rankings, badges (Elite, Rising, Specialist, Needs Data), Best XI + batting order |
| **Strategy** | Two-side match predictor from composite team strength |
| **Storytelling** | Impact report page + CSV exports (players, matches, rankings) |
| **Product** | Modern dashboard UI (Tailwind), Recharts visualizations, strong empty states |
| **MVP constraints** | **No login**, **no paid APIs**, **no database**—`localStorage` first, Vercel-ready |

## Technical stack

- **Next.js** App Router
- **JavaScript only** (no TypeScript)
- **Tailwind CSS**
- **Recharts**
- **localStorage** persistence (`lib/storage.js`)
- **CI** on GitHub Actions (`lint` + `build`)

## Project structure

```
app/              # Routes: dashboard, players, matches, rankings, best-xi, predictor, impact, about
components/       # AppShell, UI primitives, ChartsPanel
lib/
  analytics.js    # Scoring, rankings, roles, Best XI, predictor
  storage.js      # localStorage read/write
  sampleData.js   # Seed data for instant demos
  csv.js          # CSV export
  useCricketIQ.js # Client data hook
docs/
  ARCHITECTURE.md # Data flow and module map
  DEPLOYMENT.md   # Vercel + CI notes
```

## Scoring methodology (summary)

- **Batting:** runs, average per match, strike rate, boundary share, batting impact (weighted blend).
- **Bowling:** wickets, economy, wickets per match, bowling impact.
- **Fielding:** catches, run outs, fielding impact.
- **Overall CricketIQ (0–100):**

  `0.40 × battingImpact + 0.35 × bowlingImpact + 0.15 × fieldingImpact + 0.10 × consistencyScore`

  Raw signals are **normalized across the squad** so scores stay comparable. Full logic and comments live in [`lib/analytics.js`](./lib/analytics.js).

## Run locally

```bash
git clone https://github.com/kaushikatla-cell/cricketiq.git
cd cricketiq
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Load sample data** on the dashboard for an immediate demo.

## Quality bar

- `npm run lint` — ESLint (Next config)
- `npm run build` — production build
- Same checks run on **every push/PR to `main`** via GitHub Actions

## Deploy your fork

Connect the repo to [Vercel](https://vercel.com/new); no env vars required for the MVP. Details: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

## Community impact (how to talk about it)

CricketIQ supports **fairer selection**, **clearer development goals**, and **stronger group cohesion** when a student club treats cricket like a real program—not just pickup games. It combines **computer science**, **sports analytics**, and **community leadership** in one shipped product.

## Roadmap (honest next steps)

- Optional cloud sync (multi-device, club accounts)
- Season / tournament views and automated recap PDFs
- Deeper trend models (form curves, phase-of-innings priors)
- Optional auth for school/club workspaces

## License

[MIT](./LICENSE) — Copyright (c) 2026 Kaushik Atla.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
