# Git Proof — Extended Implementation Plan (Specific Task Breakdown)

Date: 2026-03-25  
Scope: Planning only. No implementation changes in this step.

---

## 1. Project Goal

Build a Next.js app where:
1. An admin creates a "Developer Proof" for a GitHub username.
2. The admin adds one or more projects to that proof.
3. A public proof page displays the verified/revoked projects and checklist metadata.
4. Data is persisted in PostgreSQL (Neon) via Prisma.

---

## 2. Confirmed Current State (from repo)

1. Next.js app exists (App Router + TypeScript).
2. Tailwind is configured.
3. Prisma packages exist in dependencies.
4. Base app files are present in app/.
5. docs/ already exists and contains prior planning docs.

This means implementation should focus on:
1. Prisma schema correctness and migrations.
2. Data access layer.
3. Admin flows.
4. Public proof rendering.
5. Documentation alignment and verification.

---

## 3. Work Phases (Execution Order)

## Phase 0: Prep and Documentation Alignment

### Tasks
1. Verify `.env.example` includes:
   1. `DATABASE_URL`
   2. `GIT_PROOF_ISSUER_NAME`
2. Update README setup section for Bun + Prisma + Neon flow.
3. Confirm security note in README:
   1. `/admin` routes are unauthenticated in v1.
4. Define naming conventions for checklist booleans and keep consistent across schema/UI.

### Deliverables
1. Clear onboarding instructions.
2. Stable env variable contract.

### Acceptance Criteria
1. A new dev can follow README and run app locally.
2. Required env vars are explicitly documented.

---

## Phase 1: Prisma Data Model and DB Initialization

### Tasks
1. Define `datasource`:
   1. Provider: `postgresql`
   2. URL from `env("DATABASE_URL")`
2. Define `DeveloperProof` model:
   1. `id` (string id, cuid/uuid)
   2. `githubUsername` (string, required)
   3. `issuerName` (string, required)
   4. `createdAt` (datetime default now)
   5. relation to `Project[]`
3. Define `ProjectStatus` enum:
   1. `verified`
   2. `revoked`
4. Define `Project` model:
   1. `id`
   2. `developerProofId`
   3. relation back to `DeveloperProof`
   4. `name`
   5. `description`
   6. `repoUrl`
   7. `liveUrl` (optional)
   8. `status` (enum, default verified)
   9. `issuedAt` (default now)
   10. checklist booleans (5 total), including live-demo flag
5. Add index:
   1. `@@index([developerProofId])`
6. Run migration:
   1. `bunx prisma migrate dev`
7. Generate client:
   1. `bunx prisma generate`

### Deliverables
1. Valid Prisma schema.
2. Initial migration files.
3. Generated Prisma client.

### Acceptance Criteria
1. Prisma validate passes.
2. Migration applies cleanly to Neon DB.
3. Tables and enum match expected schema.

---

## Phase 2: Data Access Layer (Prisma Client Singleton)

### Tasks
1. Create `lib/db.ts` (or equivalent):
   1. Export a singleton Prisma client.
   2. Use `globalThis` guard in dev to avoid multiple instances during HMR.
2. Ensure import path consistency:
   1. All server code imports from this single module.

### Deliverables
1. Centralized DB client file.

### Acceptance Criteria
1. No repeated Prisma instantiation warnings during dev.
2. Server components/actions read/write through the singleton.

---

## Phase 3: Admin Flow A — Create Proof

### Route
1. `/admin/create`

### Tasks
1. Build page UI:
   1. Header/title.
   2. Form with `githubUsername`.
2. Add server action for create:
   1. Read and trim username.
   2. Validate non-empty.
   3. Create `DeveloperProof` with `issuerName` from env.
   4. Redirect to `/admin/proof/[id]`.
3. Add basic error handling:
   1. Validation message for empty input.
   2. Generic fallback error state for DB failure.

### Deliverables
1. Working create-proof form and action.

### Acceptance Criteria
1. Submitting valid username creates a DB record.
2. User is redirected to matching manage page.
3. Invalid submissions do not create records.

---

## Phase 4: Admin Flow B — Manage Proof and Add Projects

### Route
1. `/admin/proof/[id]`

### Tasks
1. Load proof by id:
   1. If missing, render not-found state.
2. Query associated projects:
   1. Order by `issuedAt desc`.
3. Render current project list:
   1. Name, status, dates, key links.
4. Add "Create Project" form with fields:
   1. `name`
   2. `description`
   3. `repoUrl`
   4. `liveUrl` (optional)
   5. `status` (verified/revoked)
   6. five checklist booleans
5. Add server action to create project:
   1. Validate required fields.
   2. Normalize URLs if needed.
   3. Insert project for current proof.
   4. Revalidate/refresh route.
6. Optional enhancement:
   1. Action/button to toggle status verified ↔ revoked.

### Deliverables
1. Working proof management page.
2. Working project creation for existing proof.

### Acceptance Criteria
1. Multiple projects can be added to same proof.
2. New projects appear immediately after submission.
3. Data persists after refresh.

---

## Phase 5: Public Proof Page

### Route
1. `/proof/[id]`

### Tasks
1. Load proof and projects by id server-side.
2. If proof missing:
   1. Call `notFound()` and show 404 page.
3. Render page sections:
   1. Header:
      1. GitHub username
      2. Issuer name
      3. Proof id
      4. Created date
   2. Projects list/cards:
      1. Name
      2. Description
      3. Repo link
      4. Live link if present
      5. Status badge (verified/revoked)
      6. Issued date
   3. Checklist section:
      1. Human-readable labels for all booleans
      2. Special rule: hide "Live demo checked" row unless true
   4. Footer:
      1. Issued by
      2. "Generated via Git Proof"
      3. Proof id/date
4. Ensure accessibility:
   1. Semantic heading structure
   2. Visible focus styles for links/buttons
   3. Status text not color-only

### Deliverables
1. Public proof page with project cards and checklist.

### Acceptance Criteria
1. Public URL renders full proof details.
2. Missing proof id returns 404.
3. "Live demo checked" visibility rule works exactly.

---

## Phase 6: Home/Landing and Metadata Polish

### Tasks
1. Replace default scaffold home content with Git Proof intro.
2. Add links:
   1. `/admin/create`
   2. short guidance on public proof URLs
3. Update app metadata:
   1. app title
   2. description
4. Optional:
   1. OG metadata placeholders for later branding.

### Deliverables
1. Non-boilerplate landing page.
2. Clear product framing.

### Acceptance Criteria
1. Visiting `/` clearly explains purpose and next action.
2. Browser title/description reflect Git Proof.

---

## Phase 7: Styling and UX Consistency

### Tasks
1. Decide UI approach:
   1. Tailwind-only primitives, or
   2. shadcn components (if chosen, initialize and use consistently)
2. Standardize reusable UI patterns:
   1. Form field spacing
   2. Button variants
   3. Card layout
   4. Badge styles for status
3. Ensure responsive behavior:
   1. Admin forms usable on mobile
   2. Project cards stack cleanly
4. Improve empty states:
   1. No projects yet
   2. Invalid proof id
   3. Error fallback copy

### Deliverables
1. Coherent visual system across admin/public pages.

### Acceptance Criteria
1. No obvious style mismatch between routes.
2. Layout is usable desktop + mobile.

---

## Phase 8: Validation, QA, and Reliability

### Tasks
1. Functional flow test:
   1. Create proof
   2. Add 2+ projects
   3. Visit public proof URL
2. Edge-case checks:
   1. Empty username
   2. Missing required project fields
   3. Missing/invalid proof id
3. Data checks:
   1. Status values saved correctly
   2. Checklist booleans map correctly
   3. issuedAt/createdAt display as expected
4. Dev/build checks:
   1. `bun run lint`
   2. `bun run build`

### Deliverables
1. Verified end-to-end working v1.
2. Known issue list (if any).

### Acceptance Criteria
1. No blocking runtime errors in key flows.
2. Build succeeds.
3. Core flows pass manual QA.

---

## 4. Task-Level Implementation Checklist (Concrete)

1. Schema
   1. Finalize models/enums/relations/index.
   2. Generate migration.
2. DB Client
   1. Add singleton module.
3. Admin Create
   1. Add page.
   2. Add server action.
   3. Add redirect.
4. Admin Manage
   1. Add dynamic route page.
   2. Add project form.
   3. Add insert action.
5. Public Proof
   1. Add dynamic route page.
   2. Add notFound handling.
   3. Add checklist conditional row logic.
6. Landing/Metadata
   1. Update page and layout metadata.
7. Docs
   1. Finalize README setup + security note.
8. QA
   1. Run lint/build/manual flow.

---

## 5. Suggested File Map (Expected)

1. `prisma/schema.prisma`
2. `lib/db.ts`
3. `app/admin/create/page.tsx`
4. `app/admin/create/actions.ts` (optional split)
5. `app/admin/proof/[id]/page.tsx`
6. `app/admin/proof/[id]/actions.ts` (optional split)
7. `app/proof/[id]/page.tsx`
8. `app/page.tsx`
9. `app/layout.tsx` (metadata updates)
10. `README.md`
11. `.env.example`

---

## 6. Validation Rules (Recommended)

1. Username
   1. Required, trim whitespace.
   2. Optional: GitHub username format regex.
2. Project
   1. `name`, `description`, `repoUrl` required.
   2. `liveUrl` optional and URL-validated if present.
   3. `status` restricted to enum values.
3. IDs
   1. Dynamic route id must map to existing proof or 404.
4. Dates
   1. Use DB defaults unless explicit override needed.

---

## 7. Risks and Mitigations

1. Risk: Prisma schema drift/migration mismatch.
   1. Mitigation: run `migrate dev` from clean state and commit migration files.
2. Risk: Route-level server action errors not surfaced clearly.
   1. Mitigation: explicit action error return states in forms.
3. Risk: Unauthenticated admin endpoints.
   1. Mitigation: documented v1 limitation; do not deploy publicly without protection.
4. Risk: Inconsistent checklist naming between DB and UI.
   1. Mitigation: define one mapping constant and reuse it.

---

## 8. Definition of Done (v1)

1. Admin can create a proof and is redirected to manage route.
2. Admin can add multiple projects to a proof.
3. Public proof page renders proof + projects from DB.
4. Status badges and checklist booleans display correctly.
5. "Live demo checked" row appears only when true.
6. Neon persistence works across restarts/refreshes.
7. Lint and build complete successfully.
8. README accurately documents setup and limitations.

---

## 9. Out of Scope (for this phase)

1. Authentication/authorization.
2. Multi-tenant admin permissions.
3. File uploads/media hosting.
4. Analytics/audit logs.
5. PDF export or signed proofs.
6. API rate limiting and advanced security hardening.

---

## 10. Next-Step Execution Sequence (Practical)

1. Finalize Prisma schema and migration.
2. Add DB singleton.
3. Implement `/admin/create`.
4. Implement `/admin/proof/[id]`.
5. Implement `/proof/[id]`.
6. Replace home/metadata.
7. Run QA checklist and fix issues.
8. Update docs and close v1 scope.
