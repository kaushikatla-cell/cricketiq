# Deploying CricketIQ

## Vercel (recommended)

1. Push this repository to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Framework preset: **Next.js**. Root directory: repository root.
4. Deploy. No environment variables are required for the MVP.

Optional: set a production domain in the Vercel project settings.

## GitHub Actions

CI runs on every push and pull request to `main`:

- `npm ci`
- `npm run lint`
- `npm run build`

See `.github/workflows/ci.yml`.

## Live demo

A production deployment is available at:

**https://cricketiq-alpha.vercel.app**

(Replace or supplement with your own Vercel project URL after you connect your GitHub repo.)
