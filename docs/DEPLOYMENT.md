# Deploying CricketIQ

## Connect GitHub → Vercel (auto-deploy on every push)

This is the standard “tier‑1” setup: **main branch = production**.

1. Push this repository to GitHub (see the repo root `README.md` for the canonical URL).
2. Sign in at [vercel.com](https://vercel.com) and click **Add New… → Project**.
3. **Import** your GitHub repository (`cricketiq`).
4. Leave defaults:
   - **Framework Preset:** Next.js  
   - **Root Directory:** `./` (repository root)  
   - **Build Command:** `npm run build` (default)  
   - **Output:** Next.js default  
5. Click **Deploy**. No environment variables are required for the MVP.
6. After the first deploy, open **Project → Settings → Git** and confirm:
   - **Production Branch** is `main`
   - **Pull Request Comments / Preview Deployments** are enabled if you want PR previews (optional).

Every push to `main` triggers a new production deployment. Pull requests can receive preview URLs (useful for reviewers and mentors).

### Custom domain (optional)

In **Project → Settings → Domains**, add your domain and follow Vercel’s DNS instructions.

### Linking an existing Vercel project from the CLI

If you previously deployed with `vercel` from your laptop, you can **link** the same project to GitHub in the dashboard so future deploys are continuous instead of CLI-only.

---

## GitHub Actions (quality gate)

CI runs on every push and pull request to `main`:

- `npm ci`
- `npm run lint`
- `npm run test` (Vitest unit tests for `lib/analytics.js`)
- `npm run build`

See `.github/workflows/ci.yml`.

---

## Live demo

**https://cricketiq-alpha.vercel.app**

Update your `README.md` and `app/layout.js` `metadataBase` if you switch to a custom production domain.
