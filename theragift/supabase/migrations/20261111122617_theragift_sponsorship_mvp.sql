-- TheraGift's isolated MVP schema.
-- This migration is source only; it has not been applied to any Supabase project.
-- No payment data, clinical notes, Practice Ledger data, or Clinical Notes data belongs here.

create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  preferred_name text not null check (char_length(preferred_name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_applications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  preferred_public_name text check (preferred_public_name is null or char_length(preferred_public_name) <= 80),
  support_category text not null check (support_category in (
    'bereavement', 'relationship-change', 'family-stress', 'work-and-finances',
    'anxiety-and-low-mood', 'life-transition', 'other'
  )),
  circumstances text not null check (char_length(circumstances) between 20 and 800),
  funding_type text not null check (funding_type in ('full', 'partial')),
  requested_sessions integer not null check (requested_sessions between 1 and 24),
  consent_to_private_review boolean not null check (consent_to_private_review),
  consent_to_public_campaign boolean not null default false,
  status text not null default 'submitted' check (status in ('submitted', 'under-review', 'approved', 'declined', 'withdrawn')),
  created_at timestamptz not null default now()
);

create table public.therapist_applications (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  registration_body text not null check (char_length(registration_body) between 2 and 120),
  registration_number text not null check (char_length(registration_number) between 2 and 120),
  professional_email text not null check (char_length(professional_email) <= 254),
  status text not null default 'submitted' check (status in ('submitted', 'under-review', 'verified', 'declined', 'suspended', 'withdrawn')),
  created_at timestamptz not null default now()
);

-- Trusted verification records are written only by a future server-side review function.
create table public.therapist_verifications (
  therapist_id uuid primary key references auth.users (id) on delete cascade,
  is_verified boolean not null default false,
  is_active boolean not null default false,
  verified_at timestamptz,
  updated_at timestamptz not null default now(),
  check (not is_active or (is_verified and verified_at is not null))
);

-- A minimal public directory. Registration numbers, emails, and evidence remain private.
-- Only the trusted review backend may add or edit directory entries.
create table public.public_therapist_directory (
  therapist_id uuid primary key references auth.users (id) on delete cascade,
  public_name text not null check (char_length(public_name) between 2 and 100),
  registration_body text not null check (char_length(registration_body) between 2 and 120),
  public_summary text not null check (char_length(public_summary) between 20 and 500),
  is_active boolean not null default true,
  verified_since date not null default current_date,
  created_at timestamptz not null default now()
);

-- Every column in this table is intended for public display after consent and review.
-- It deliberately contains no client account ID, contact details, or application text.
create table public.public_campaigns (
  id uuid primary key default gen_random_uuid(),
  public_name text not null check (char_length(public_name) between 2 and 80),
  support_category text not null check (support_category in (
    'bereavement', 'relationship-change', 'family-stress', 'work-and-finances',
    'anxiety-and-low-mood', 'life-transition', 'other'
  )),
  public_summary text not null check (char_length(public_summary) between 30 and 800),
  target_sessions integer not null check (target_sessions between 1 and 24),
  sponsored_sessions integer not null default 0 check (sponsored_sessions between 0 and target_sessions),
  status text not null default 'draft' check (status in ('draft', 'published', 'paused', 'complete')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  check (status <> 'published' or published_at is not null)
);

create table public.sponsorship_interests (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references auth.users (id) on delete cascade,
  campaign_id uuid not null references public.public_campaigns (id) on delete restrict,
  sessions integer not null check (sessions between 1 and 24),
  status text not null default 'interested' check (status in ('interested', 'withdrawn', 'matched')),
  created_at timestamptz not null default now(),
  unique (donor_id, campaign_id)
);

create table public.therapist_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete cascade,
  therapist_id uuid not null references auth.users (id) on delete cascade,
  client_shared_context text check (client_shared_context is null or char_length(client_shared_context) <= 800),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'closed')),
  created_at timestamptz not null default now(),
  therapist_responded_at timestamptz,
  check (client_id <> therapist_id)
);

create table public.session_reports (
  id uuid primary key default gen_random_uuid(),
  therapist_request_id uuid not null references public.therapist_requests (id) on delete restrict,
  session_date date not null check (session_date <= current_date),
  session_number integer not null check (session_number between 1 and 24),
  created_at timestamptz not null default now(),
  unique (therapist_request_id, session_number)
);

alter table public.user_profiles enable row level security;
alter table public.client_applications enable row level security;
alter table public.therapist_applications enable row level security;
alter table public.therapist_verifications enable row level security;
alter table public.public_therapist_directory enable row level security;
alter table public.public_campaigns enable row level security;
alter table public.sponsorship_interests enable row level security;
alter table public.therapist_requests enable row level security;
alter table public.session_reports enable row level security;

grant select, insert, update on public.user_profiles to authenticated;
grant select, insert on public.client_applications to authenticated;
grant update (status) on public.client_applications to authenticated;
grant select, insert on public.therapist_applications to authenticated;
grant update (status) on public.therapist_applications to authenticated;
grant select on public.therapist_verifications to authenticated;
grant select on public.public_therapist_directory to anon, authenticated;
grant select on public.public_campaigns to anon, authenticated;
grant select, insert on public.sponsorship_interests to authenticated;
grant update (status) on public.sponsorship_interests to authenticated;
grant select, insert on public.therapist_requests to authenticated;
grant update (status, therapist_responded_at) on public.therapist_requests to authenticated;
grant select, insert on public.session_reports to authenticated;

create policy "profile owner reads own profile"
  on public.user_profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "profile owner creates own profile"
  on public.user_profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "profile owner updates own profile"
  on public.user_profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "client reads own applications"
  on public.client_applications for select to authenticated
  using ((select auth.uid()) = client_id);
create policy "client submits own application"
  on public.client_applications for insert to authenticated
  with check ((select auth.uid()) = client_id and status = 'submitted');
create policy "client withdraws own unreviewed application"
  on public.client_applications for update to authenticated
  using ((select auth.uid()) = client_id and status = 'submitted')
  with check ((select auth.uid()) = client_id and status = 'withdrawn');

create policy "therapist reads own application"
  on public.therapist_applications for select to authenticated
  using ((select auth.uid()) = therapist_id);
create policy "therapist submits own application"
  on public.therapist_applications for insert to authenticated
  with check ((select auth.uid()) = therapist_id and status = 'submitted');
create policy "therapist withdraws own unreviewed registration"
  on public.therapist_applications for update to authenticated
  using ((select auth.uid()) = therapist_id and status = 'submitted')
  with check ((select auth.uid()) = therapist_id and status = 'withdrawn');

create policy "therapist reads own verification result"
  on public.therapist_verifications for select to authenticated
  using ((select auth.uid()) = therapist_id);

create policy "anyone reads active verified therapist directory"
  on public.public_therapist_directory for select to anon, authenticated
  using (is_active);

create policy "anyone reads published campaigns"
  on public.public_campaigns for select to anon, authenticated
  using (status = 'published' and published_at is not null);

create policy "donor reads own sponsorship interests"
  on public.sponsorship_interests for select to authenticated
  using ((select auth.uid()) = donor_id);
create policy "donor records own non-payment interest"
  on public.sponsorship_interests for insert to authenticated
  with check (
    (select auth.uid()) = donor_id
    and status = 'interested'
    and exists (
      select 1 from public.public_campaigns c
      where c.id = campaign_id and c.status = 'published'
    )
  );
create policy "donor withdraws own sponsorship interest"
  on public.sponsorship_interests for update to authenticated
  using ((select auth.uid()) = donor_id and status = 'interested')
  with check ((select auth.uid()) = donor_id and status = 'withdrawn');

create policy "client reads own therapist requests"
  on public.therapist_requests for select to authenticated
  using ((select auth.uid()) = client_id);
create policy "therapist reads assigned requests"
  on public.therapist_requests for select to authenticated
  using ((select auth.uid()) = therapist_id);
create policy "client requests a verified therapist"
  on public.therapist_requests for insert to authenticated
  with check (
    (select auth.uid()) = client_id
    and status = 'pending'
    and exists (
      select 1 from public.public_therapist_directory d
      where d.therapist_id = therapist_requests.therapist_id and d.is_active
    )
  );
create policy "verified therapist responds to own requests"
  on public.therapist_requests for update to authenticated
  using (
    (select auth.uid()) = therapist_id
    and status = 'pending'
    and exists (
      select 1 from public.public_therapist_directory d
      where d.therapist_id = therapist_requests.therapist_id and d.is_active
    )
  )
  with check (
    (select auth.uid()) = therapist_id
    and status in ('accepted', 'declined')
    and exists (
      select 1 from public.public_therapist_directory d
      where d.therapist_id = therapist_requests.therapist_id and d.is_active
    )
  );

create policy "therapist reads own session reports"
  on public.session_reports for select to authenticated
  using (
    exists (
      select 1 from public.therapist_requests r
      where r.id = therapist_request_id and r.therapist_id = (select auth.uid())
    )
  );
create policy "client reads session reports shared with them"
  on public.session_reports for select to authenticated
  using (
    exists (
      select 1 from public.therapist_requests r
      where r.id = therapist_request_id and r.client_id = (select auth.uid())
    )
  );
create policy "verified therapist reports completed sessions"
  on public.session_reports for insert to authenticated
  with check (
    exists (
      select 1 from public.therapist_requests r
      join public.therapist_verifications v on v.therapist_id = r.therapist_id
      where r.id = therapist_request_id
        and r.therapist_id = (select auth.uid())
        and r.status = 'accepted'
        and v.is_verified
        and v.is_active
    )
  );

create index client_applications_owner_created_idx
  on public.client_applications (client_id, created_at desc);
create index sponsorship_interests_donor_created_idx
  on public.sponsorship_interests (donor_id, created_at desc);
create index therapist_requests_client_created_idx
  on public.therapist_requests (client_id, created_at desc);
create index therapist_requests_therapist_created_idx
  on public.therapist_requests (therapist_id, created_at desc);
create index public_campaigns_public_status_idx
  on public.public_campaigns (status, published_at desc);

