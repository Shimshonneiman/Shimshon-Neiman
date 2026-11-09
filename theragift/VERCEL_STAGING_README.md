# TheraGift — Vercel staging deployment

**Status:** GitHub staging branch prepared, NOT yet deployed to Vercel. Vercel account access is blocked by missing/unauthorised workspace. This branch is kept separate from the repository default `main` branch.

## Import this repository into Vercel

- GitHub repository: `Shimshonneiman/Shimshon-Neiman`
- Branch for TheraGift: `theragift-vercel-staging`
- Root Directory: `theragift`
- Framework preset: `Other` (static HTML), no build or install commands
- Project name: `theragift-staging`
- Production Branch: **`theragift-vercel-staging`**; change in Project → Settings → Environments/Git if it defaults to `main`
- Do not add database secrets. The deployed pages must remain a public **fictional-data staging preview** without real payments, sign-in or clinical records.

## Vercel account access blocker

The connected Vercel user reports `defaultTeamId: null`, zero accessible teams and a `401 missing_team_param` error when creating or listing projects. The previously known scope `seenconsultanceltd-8453` returns 403 and cannot be authorised through the currently connected account. The user must choose or create a Vercel workspace, set it as their Default Team at https://vercel.com/account/settings and ensure the ChatGPT Vercel connection has access to that scope. No paid upgrade was approved.

## Security constraints

- No real client, donor, therapist or health information is stored in the static preview.
- Real Supabase Auth integration is NOT live. A separate TheraGift database is required; current Supabase free account has reached its two-project cap.
- Secure FastAPI code and PostgreSQL migrations are available separately in `TheraGift-Real-Development-v0.11.zip`, not part of this branch's public staging build.
- The existing Practice Ledger and Clinical Notes apps/databases must remain untouched.
- Current static preview already has cause browsing, fictional profiles and client/therapist demonstration pathways; this GitHub branch is a deploy source, not a verified Vercel URL.

## Verify after deploying

Check `/`, `/client`, `/therapist`, `/profile` and an example link opened from `/`. Test mobile navigation and donor keyword match results. Confirm static noindex response headers. Do not enable real signup or payment collection.
