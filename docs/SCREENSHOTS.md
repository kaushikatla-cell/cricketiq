# Screenshots for README / portfolio

High-quality screenshots make CricketIQ read as a **real shipped product** on GitHub, your personal site, and application materials.

## Recommended captures (minimum set)

1. **Dashboard** — hero, KPI stat cards, and one chart.
2. **Player detail** (`/players/<id>`) — profile + rolling runs chart after sample data is loaded.
3. **Rankings** — one board with badges and role explanations visible.
4. **Seasons** — standings table + weekly MVP list.
5. **Impact Report** — narrative + “Why This Matters” block (use print view if you want a cleaner page).

## How to capture

1. Run `npm run dev` locally (or use the live demo).
2. Click **Load sample data** on the dashboard for consistent visuals.
3. Use your OS screenshot tool at **1280×800** or **1440×900** window size.
4. Save PNG files into `docs/screenshots/` using these names:
   - `dashboard.png`
   - `player-detail.png`
   - `rankings.png`
   - `seasons.png`
   - `impact.png`

## Add to README

After the files exist, add an image gallery section to `README.md`:

```markdown
## Screenshots

| Dashboard | Player detail |
|-----------|---------------|
| ![Dashboard](./docs/screenshots/dashboard.png) | ![Player](./docs/screenshots/player-detail.png) |
```

Commit the images to git so GitHub renders them inline.
