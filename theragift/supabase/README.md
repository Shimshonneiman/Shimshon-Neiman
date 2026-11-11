# TheraGift backend foundation

The SQL migration in `migrations/` is the first draft of a dedicated sponsorship database. It is source code only: it has **not** been applied to any Supabase project, and the live TheraGift URL still serves the static prototype.

## Isolation and current blocker

- Never run this migration against Clinical Notes or the Practice Ledger database.
- The connected Supabase account currently shows two active projects, including `Clinical Notes Secure`. Both existing projects are being left unchanged.
- The user has chosen a free tier only. Supabase's free tier currently allows two active projects, so there is no spare active-project slot in this account.
- Continue implementing the site and review the schema locally. Do not create or alter a hosted project unless there is an isolated project available within the user's free-only limit.

## Planned MVP data flows

- Client applications remain private to the client and authorised server-side reviewers.
- Therapist registration details remain private; only the trusted backend can publish a verified therapist directory entry.
- Donors can browse only explicitly published, consented campaign summaries. Public campaign records contain no client account ID or contact details.
- Donor actions are non-payment sponsorship interests. No payment or payout fields are included.
- Clients can share a short context with a selected verified therapist. Therapists report session dates and counts only; clinical notes are out of scope.
- Every table has row-level security. No service-role key belongs in browser code.

## Before using the migration

1. Provision a dedicated TheraGift Supabase project without modifying either existing project.
2. Review the migration and run it only against that project.
3. Verify RLS allow/deny behaviour for anonymous, client, therapist and donor roles, and run Supabase security advisors.
4. Add server-side review functions for client publication and therapist verification. Those functions must keep the service-role key server-side and must never publish client text without explicit consent and human review.
5. Wire account sign-up, sign-in, recovery and the three portals to the verified schema.
6. Configure an isolated staging deployment and environment values only after the backend is available.

Until those steps are complete, do not collect real applications or therapist credentials through the public URL.
