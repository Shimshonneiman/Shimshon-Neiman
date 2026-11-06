# TheraGift · Next UX implementation specification
Version: 0.8 design handoff · 6 November 2026
Status: Proposed copy and UI/logic contract. **Not a claim that these functions are deployed.**

## Non-negotiable foundations

- TheraGift's public donor-first home stays public without sign-in. Client and therapist features are separate authenticated experiences at production launch.
- The official uploaded TheraGift wordmark must remain unchanged. Use design tokens: deep teal #173D42, warm ivory #F8F5EE, honey #C48A55 and soft honey #E2B88D.
- No live financial transaction, real personal data, real patient case, live therapist verification or actual email is permitted in the public demonstration. Fictional case profiles must be marked clearly as examples.
- Donor inputs must not be treated as an assessment or diagnosis. Avoid implying that TheraGift has personally matched donors with real patients.
- Only verified, appropriately registered and competent professionals can confirm a sponsorship or completed session. A therapist cannot write or edit the client's fundraising story.
- Client case visibility defaults to private. Publishing must include an explicit consent and human privacy review; anonymisation is not assured by hiding the name alone.

## Screen A — Therapist registration and verification

**Route:** /therapist/register (authenticated workflow, production); a labelled fictional walkthrough may be on /therapist.html in static staging.

**Header:** “TheraGift for therapists”
**Title:** “Join the professionals making therapy possible.”
**Intro:** “Register your professional details so TheraGift can confirm your eligibility to provide sponsored therapy. We verify professional registration before you can confirm client funding requests.”
**Trust note:** “Your registration details are reviewed privately. Your clinical records and clients' fundraising stories are never made available to donors.”

### Form structure
1. Professional identity: legal first name, legal last name, practice display name (optional), practice email, location and geographic service area.
2. Professional register (select, required):
   - UK Council for Psychotherapy (UKCP)
   - British Psychoanalytic Council (BPC)
   - British Association for Counselling and Psychotherapy (BACP)
   - National Counselling and Psychotherapy Society (NCPS)
   - CBT Register UK / BABCP (relevant practitioner category)
   - Health and Care Professions Council (HCPC, matching protected professional title)
   - Association of Child Psychotherapists (ACP)
   - British Association of Play Therapists (BAPT)
   - Play Therapy UK (PTUK)
   - COSCA (Counselling & Psychotherapy in Scotland)
   - Association of Christians in Counselling and Linked Professions (ACC)
   - Human Givens Institute (HGI)
   - Other / review required (no automatic acceptance)
3. Registration or membership number *as recorded in the professional register* (required); registration category/grade (required); public register profile URL (optional); professional title (required); date last checked (staff-owned).
4. Practice scope: psychotherapy/counselling modality; works with adults / couples / families / children and young people; in person / online; UK location; specialist training and experience if working with minors or particular modalities.
5. Optional practice administration settings: fee range, session duration, payment details **only in secure authenticated settings**, never a public register lookup.
6. Confirmation checkbox: “I confirm that my registration is current, the details are accurate, and I consent to TheraGift checking my professional registration and eligibility.”

**Primary button:** “Submit for verification”
**Secondary:** “Save draft” (when authenticated).

### Status states and exact copy
- Pending: “Your registration is awaiting verification. You can prepare your profile, but cannot confirm funding requests yet.”
- Verified: “Your professional registration has been verified. You can now respond to client connection requests.”
- Review required: “We need to check additional details about your professional registration. No client confirmation requests can be completed until verification is finished.”
- Expired/suspended: “Your ability to confirm sponsored therapy is temporarily paused while we review your registration.”
- Register mismatch: “We could not confirm this registration under the name and category supplied. Please check your details or request a manual review.”

### Behaviour and validation
- Never treat raw membership alone as proof of current entry on a qualifying practitioner register. Verify register status, category, public listing where available, and practice scope.
- HCPC must match relevant registered profession/protected title; protected psychologist titles require their appropriate HCPC designation. BPS membership alone is not sufficient.
- BABCP membership alone is insufficient where specific CBT accreditation is required.
- Multiple registrations supported: each has its own verification status and verification history.
- Admin review records who checked, when, register URL/method and outcome; periodic re-checks and suspensions are supported.
- The app must not disclose an unverified therapist's claimed status to clients as verified.

## Screen B — Client therapist connection request

**Route:** /client/therapist (authenticated).
**Title:** “Ask your therapist to confirm your sessions.”
**Intro:** “Your therapist can confirm the professional relationship and factual details needed for sponsorship. They will not be asked to write your appeal.”
**Search label:** “Find your therapist”
**Search placeholder:** “Search by therapist name, register or location”
**Directory detail:** verified display name, register, relevant practice modality; no confidential or unnecessary personal contact details.
**Search no result:** “Can't find your therapist? You can invite them securely.”
**Invite fields:** therapist professional email, name (optional), qualifying register (optional), explicit client consent.
**Consent text:** “I authorise TheraGift to contact this professional to ask them to confirm our therapy relationship. My fundraising story and private situation tags will not be included.”
**Primary buttons:** “Request confirmation” and, as an alternative, “Invite my therapist.”
**Success:** “Your request is ready. We’ll notify you when your therapist responds.”
**Pending invite:** “Invitation pending. Your therapist must register and be verified before they can confirm sessions.”
**Therapist decline:** “This professional could not confirm the request. You can correct their details or ask for support.”
**Privacy:** Never send campaign text, sensitive tags, clinical notes, donor identities or unnecessary treatment history in the invitation. A recognisable client identifier should be shared only inside the authenticated relationship-establishment process.

## Screen C — Therapist request inbox

**Route:** /therapist/confirmations (authenticated and verified therapist only).
**Title:** “Client confirmation requests”
**Intro:** “Respond only to clients whose professional relationship you can verify. Fundraising stories and donor details are not shown here.”
**Request card:** confidential client reference, date received, proposed session fee and duration where appropriate, requested factual verification. It must provide a secure minimal way to identify the requesting client; a random reference alone is not enough to know whether the person is an existing client.
**Actions:** “Confirm therapeutic relationship”, “Not my client”, “Request clarification”.
**Confirmation step:** consent and declaration that the relationship is current and the professional is eligible to provide the proposed treatment. If clinical service already completed, separately verify service date or attendance via an authorised mechanism.
**After confirmation:** “Thank you. Only the confirmation status and approved factual details will be shared with the TheraGift funding team. No clinical notes are required.”
**Session action:** “Confirm a completed session”, with fee, service date and already-billed checks. Implement idempotency and prevent duplicate claims.
**No therapist access:** donation preferences, donor identity (unless payment processing demonstrably requires), unpublished fundraising copy, clinical narrative, and other practices' records.

## Screen D — Donor match-finder, inserted on public homepage

**Placement:** immediately after the first row of causes and the leading “People you could help” carousel, before “Ways to give”.
**Eyebrow:** “A MORE PERSONAL WAY TO GIVE”
**Title:** “Find a cause that speaks to you.”
**Body:** “Is there a particular experience or situation you’d like to support? Describe it in a few words and we’ll suggest causes and example therapy funds that feel relevant.”
**Input label:** “What kind of situation matters to you?”
**Placeholder:** “For example: I'd like to support someone working through bereavement, loneliness or a difficult family change…”
**Supporting hint:** “You can describe a cause without telling us anything personal about yourself.”
**Primary button:** “Find related causes”
**Secondary:** “Browse all causes”
**Privacy reassurance displayed directly below:** “Private by design. Your words are used only to find suggestions on this page. They are not sent to TheraGift, added to your account or saved.” **Use this exact claim only after verifying all matching happens in-browser and analytics, error tracking, form-autofill persistence, URL query strings and logs do not capture the text.**
**Safe alternative before those controls pass:** “Please avoid entering names, contact details or private experiences. This is a demo search of fictional examples.”

### Match result states
- Strong keyword/category match: “We found some promising matches.” Subcopy: “Here are causes and example therapy funds related to what you described.”
- Partial match: “Here are a few close possibilities.” Subcopy: “These examples may connect with the kind of support you have in mind.”
- No match: “No close match yet — but there are still ways to help.” Offer “Browse all causes” and “Support the general therapy fund.”
- Empty query: “Describe a cause or choose a category to begin.”
- Too-specific/private text: “For privacy, please remove names, phone numbers, addresses or other identifying details.”

### Matching v1 requirements
- Local-only deterministic normalisation, curated synonyms and keyword-to-cause mapping: e.g., “lost someone” ↔ bereavement, “separation” ↔ family change, “school worry” ↔ young people's mental wellbeing.
- Show 1–3 ranked causes and 3–6 fictional case profiles; explain the cause, not a pseudo-medical diagnosis.
- V1 input and results are not sent over any network; avoid third-party analytics on this field, localStorage, sessionStorage, URLs, form submissions or server-side telemetry.
- Clear button deletes input/results from the browser UI. Input is not shared with the patient, therapist or other donors.
- No claim of matching to real people until a real, consent-based, independently tested directory exists.
- No automated eligibility or care decisions derived from donor descriptions.

## Screen E — Expanded anonymous fictional profile system

**Public components:** six clickable cause tiles; “People you could help” carousel on the main homepage; each cause has an adjacent “Related example profiles” horizontal carousel; full individual profile page or accessible dialog.

**Card copy template:**
- Tag: “[Cause] · Fictional example”
- Title: “[Gentle, non-identifying headline]”
- Body: 1–3 sentences about why continuing therapy matters, not a diagnosis or trauma disclosure.
- Funding: “£[raised] of £[goal] in this example”
- CTA: “Explore this story”
- Entire card is a click target with an accessible label, pointer hover lift, clear focus ring and keyboard activation.

**Profile detail copy:**
- Header: “Help [anonymous headline] continue therapy.”
- “About this request” — the individual's approved, non-identifying appeal only.
- “What sponsorship could cover” — session count or funded goal, subject to programme rules.
- “How we protect privacy” — “The client's name, identifying details and therapy notes are not shared publicly.”
- “Professional verification” — show only a genuine verified status when checked; fictional profiles must always be clearly marked “Example — not a real funding request”.
- Primary CTA for live state: “Sponsor therapy”; **preview state:** disabled “Donations open at launch”.
- Secondary: “See similar requests” returning to filtered carousel.
- Do not include photos, locations, dates or detailed stories that could indirectly identify an individual.
- Funding totals in demos are explicitly fictional, not fabricated real-world impact.

**Mock content inventory:** at least 60 fictional profiles, 10 per cause. Subjects include anxiety, low mood, burnout, grief, trauma recovery, family conflict, parenting, divorce, school stress, young adult change, chronic illness, identity and culturally sensitive therapy. Each has stable internal example ID, one primary cause, 1–3 tags, title, anonymised copy, target, example progress, and one approved symbolic avatar style. Avoid repetitive urgency or sensational storytelling.

**Interaction:** opening any cause filters adjacent examples immediately; narrower tags show matched examples first, with a clear broader-category fallback. Next/previous carousel controls, scroll snap and reduced-motion support. The whole card, not a small link, must be clickable and keyboard accessible.

## Screen F — Client avatar selector

**Route:** /client/profile/avatar (authenticated), also accessible during appeal editing.
**Title:** “Choose how you'd like to appear.”
**Intro:** “Use a simple illustrated avatar instead of a photograph. Your avatar does not need to match your real age, gender or appearance.”
**Options:** boy, girl, young man, young woman, adult man, adult woman, older man, older woman; also gender-neutral child/young person, adult and older adult, and an abstract privacy-first default.
**Primary CTA:** “Use this avatar”
**Secondary CTA:** “Keep the neutral avatar”
**Privacy guidance:** “Your choice is only an illustration. You do not need to share a photograph, real name, age or gender.”
**Safety:** Never infer demographics from avatar selection, never use it to determine eligibility, and never automatically disclose a minor's status. Child-related requests require dedicated guardian, consent and safeguarding policy before launch.
**Assets:** original vector or approved illustrated avatars, with consistent stroke, soft ivory/teal/honey palette, no recognisable real faces, equal visual weight and accessible labels. Store only a safe preset avatar ID, not biometric image data.

## Acceptance criteria and staging checks

1. Donors browse without login; causes, 60+ clearly fictional profiles and entire cards work on mobile and desktop.
2. A donor match search with ordinary synonyms returns sensible cause suggestions; no network request, console logging, analytics, URL mutation or browser storage of entered text.
3. Example profile pages cannot trigger real payment or reveal private client data.
4. Client account defaults to private; selected avatar cannot expose a real age or identity and is optional.
5. A verified therapist can accept/decline only their own authenticated client's request; registered-but-unverified therapist cannot confirm it.
6. Professional register and registration category are checked independently before eligibility; no blanket auto-verification based on association membership.
7. Client email invitation is not sent until secure email provider and verification protocols are ready; public demo must never collect real contact details.
8. Session confirmations and sponsorship allocations are idempotent and have a tamper-evident audit record.
9. Keyboard navigation, screen-reader labels, high contrast and reduced-motion support pass accessibility review.
10. No modifications whatsoever to the original Practice Ledger or Clinical Notes applications.
11. Database and authentication security checks pass before opening the production site to real clinical information.

### External reference guidance
- NHS England, September 2026: psychological professions registration and scope requirements.
- Professional Standards Authority: Accredited Registers and practitioner verification.
- HCPC: protected titles and registration.
- ICO: UK GDPR special-category health data rules.

This document is an implementation specification for the existing TheraGift codebase, not a separate website, live sign-in or guarantee of regulatory compliance.
