# TheraGift — Give the Gift of Therapy

An independent, static-first TheraGift website for exploring psychotherapy sponsorship. This source is designed as a fictional public walkthrough: donor browsing and story matching work in the browser; client and therapist journeys are demonstrable with invented examples. It does not create real accounts, transmit or save client application text, contact therapists, verify credentials or process donations. The walkthrough is not for real health information.

## What is included

- Donor homepage with cause browsing, fictional sample profiles, profile details and local-only story suggestions.
- Client story application walkthrough with privacy prompts, fictional story examples, visibility choices, therapist lookup and a tab-session request flow; plus a separate fictional client dashboard.
- Therapist registration and portal walkthrough with fictional verification, connection requests and session confirmation examples; plus a separate therapist dashboard.
- TheraGift's original wordmark and colours, responsive page layouts, and Vercel clean routes.
- Deployment and production architecture notes in `DEPLOYMENT.md`.

## Folder structure

```text
theragift/
├── index.html                     Donor homepage and fictional profile catalogue
├── profile.html                   Fictional profile detail page
├── client.html                    Client application and portal walkthrough
├── client-portal.html             Fictional client dashboard
├── therapist.html                 Therapist registration and portal walkthrough
├── therapist-portal.html          Fictional therapist dashboard
├── portal.css                     Shared dashboard styles
├── discovery-v09.css              Donor cause discovery styles
├── donor-story-match.js           Local-only story suggestion logic
├── profiles-data.js               Fictional profile catalogue
├── init-profiles.js               Profile rendering helpers
├── v08-donor.js                   Donor homepage interactions
├── v08-profiles.js                Profile detail interactions
├── vercel.json                    Clean routes and preview response headers
├── _redirects                     Clean routes for Cloudflare Pages
├── _headers                       Noindex and browser security headers on Cloudflare Pages
├── README.md                      Project and local setup
└── DEPLOYMENT.md                  Hosting instructions and production requirements
```

## Run locally

No package installation, build step or environment variables are needed for this static walkthrough.

From the repository root:

```bash
python3 -m http.server 8000 --directory theragift
```

Then open `http://localhost:8000`. The pages can also be opened as files, but a local server better matches hosted routes. Use `/client`, `/client/portal`, `/therapist`, `/therapist/portal` and `/profile#TG-101` on Vercel or Cloudflare Pages; local preview can use the matching `.html` pages and `/profile.html#TG-101`.

## Demo privacy and limits

- All people, cases, balances, therapist details and statuses shown are fictional.
- Donor matching is performed locally in the page. The matching text is not sent to a server or stored by this source.
- The client story draft stays in page memory. A fictional therapist-request status is stored in `sessionStorage` for the current browser tab only, to connect the client and therapist walkthroughs. It does not contain the story or situation tags.
- Therapist registration examples are cleared from the form and are not sent or saved.
- Therapist invitations accept only the reserved `example.test` domain in this walkthrough; no email is sent.
- There is no authentication, database, administrator review, real verification, donation, payout or email service.
- Do not enter real client, therapist, donor or health information.

## Before a real launch

Read `DEPLOYMENT.md`. The production app needs a separate TheraGift backend and database, real authentication, privacy and consent workflows, independent professional verification, moderation, payment provider integration, operational monitoring and legal review. Do not connect this static preview to Practice Ledger or Clinical Notes.
