# TheraGift deployment and production plan

## Deploy the fictional static walkthrough

The current project is plain HTML, CSS and JavaScript. It has no build command and requires no runtime environment variables.

### Vercel

1. Import the TheraGift GitHub repository and choose the `theragift-vercel-staging` branch.
2. Set **Root Directory** to `theragift` and **Framework Preset** to `Other`.
3. Leave install and build commands empty. The output directory can remain empty for Vercel's static file hosting.
4. Add no database, payment, email or authentication secrets.
5. Keep this deployment as a fictional, noindex preview. Do not invite clients or therapists to use it for real cases.

The provided `vercel.json` maps `/client`, `/client/portal`, `/therapist`, `/therapist/portal` and `/profile` to their HTML pages. It adds noindex and browser security headers, including a restrictive Content Security Policy that blocks network connections from the demo pages. The homepage contains the fictional demo cases; the separate `profiles-data.js` file supports the profile walkthrough data.

### Cloudflare Pages

The project also includes `_redirects` and `_headers`, which provide the same clean routes and noindex/security headers on Cloudflare Pages. For a later local deployment with Wrangler, from the repository root:

```bash
npx wrangler pages deploy theragift --project-name=theragift-staging --branch=theragift-vercel-staging
```

Wrangler must be authenticated to the Cloudflare account with Pages edit access. This command deploys the fictional preview; it does not configure a database, authentication or payments.

### Local preview

```bash
python3 -m http.server 8000 --directory theragift
```

Open `http://localhost:8000`. Stop the server with `Ctrl+C`.

## Current environment variables and services

There are **no environment variables or external services** in the static walkthrough. No Vercel runtime configuration is needed. This is intentional: the preview has no real sign-in, database, verification, email, donation, payment or payout service.

## Production architecture required

The current files are not a production backend. A real launch should be implemented as a separate TheraGift application and should use a dedicated Supabase project or another isolated backend. Existing Practice Ledger and Clinical Notes databases and applications must remain untouched.

Recommended service boundaries:

| Area | Production component | Access rule |
| --- | --- | --- |
| Public donor browsing | Public, reviewed campaign projection | Only explicitly approved, consented campaign fields are public |
| Client portal | Supabase Auth plus private client tables and server functions | A client can access only their own account, application and sponsorship status |
| Therapist portal | Auth plus therapist profile and verification records | Funding confirmation actions are limited to independently verified professionals |
| Donor account | Auth plus donation and receipt records | A donor sees their own donations and public campaign updates, never private client records |
| Payments and payouts | A regulated payment provider, behind server-side functions | Never expose provider secret keys in browser code; verify webhooks and prevent duplicate actions |
| Email | Transactional email provider, called from server-side functions | Send only minimal notifications; never include appeal text or clinical information |
| Review and moderation | Restricted staff console and audit log | Least-privilege access, documented review reason, timestamps and retention limits |

### Example production environment variables

These are a planning reference only. They are **not used by this source** and must not be added to the static preview.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-side only; never expose to the browser
PAYMENT_PROVIDER_SECRET_KEY=     # server-side only
PAYMENT_WEBHOOK_SECRET=          # server-side only
EMAIL_PROVIDER_API_KEY=          # server-side only
APP_BASE_URL=
```

Use Vercel's encrypted environment-variable settings for deployment secrets. Keep the service-role, payment, webhook and email keys out of `NEXT_PUBLIC_*` variables, source files and browser bundles. Use separate credentials and data for development, preview and production. Configure only after a dedicated TheraGift backend exists and access rules have been reviewed.

## Production readiness gates

Before real users or donations are enabled, implement and review:

1. A dedicated TheraGift database with row-level security and private storage; never reuse credentials or tables from the practice apps.
2. Authentication, account recovery, role checks, staff access controls, consent records, data export/deletion and retention policies.
3. A client application that keeps clinical details to a minimum, defaults to private, and requires explicit human review and consent before anything is published.
4. Therapist identity and professional-register checks, renewal/suspension handling, and auditable session confirmations.
5. Donation terms, restricted-fund accounting, refunds, chargebacks, receipts and verified therapist payout rules with a payment provider.
6. Server-side input validation, rate limits, abuse reporting, audit logs, backups, monitoring, incident response and accessibility review.
7. UK GDPR and Data Protection Act review, a DPIA, privacy notices, safeguarding procedures, charity/fundraising and financial-promotion advice as applicable.

Do not represent the walkthrough's fictional verification, matching or sponsorship statuses as real platform outcomes.
