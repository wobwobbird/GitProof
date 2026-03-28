# Git Proof — First-time implementation walkthrough

This document expands [git_proof_next_plan.md](git_proof_next_plan.md) into a stage-by-stage guide. Use it when you are implementing the project for the first time: it adds **why** each step exists, **how to verify** progress, and **what often goes wrong**.

**Companion:** The shorter plan file keeps the architecture diagram, todo IDs, and Definition of Done in one place. Follow *this* file for execution order and detail.

---

## Before you start

### What you are building (one paragraph)

A small Next.js app where someone (treated as “admin” with **no login** in v1) creates a **Developer Proof** tied to a GitHub username, attaches **Projects** with metadata and checklist flags, and the public can open `/proof/[id]` to see that information. Data lives in **Neon PostgreSQL** via **Prisma**.

### Skills and tools assumed

| You should be comfortable with | Or plan to learn as you go |
|-------------------------------|----------------------------|
| Terminal: `cd`, env vars, running scripts | Bun’s basics (`bun install`, `bun run`) |
| Git: commit often after each working stage | — |
| TypeScript at a “read and edit” level | Next.js App Router file conventions (`app/`, `page.tsx`, dynamic `[id]`) |

### Repo facts (so you do not chase ghosts)

- The project is already **create-next-app** style: App Router, TypeScript, Tailwind 4, Next 16. There is **no** old Bun SPA to remove.
- **Prisma** packages are already in `package.json`; you still need a schema, migrations, and `lib/db.ts` if those are not present yet.
- This Next major may differ from older tutorials. When something feels “wrong” compared to blog posts, read the in-repo guide: `node_modules/next/dist/docs/` (see [AGENTS.md](../AGENTS.md)).

### Suggested pace

Treat each numbered **stage** below as a unit of work: finish it, commit, run the **Checkpoint** before moving on. If you skip verification, bugs stack up and become harder to trace (especially DB and Server Actions).

---

## Concepts in 60 seconds

- **Prisma:** Describes your tables in `prisma/schema.prisma`, generates a type-safe client, and applies **migrations** so the real database matches the schema.
- **Neon:** Hosted PostgreSQL. You paste a connection string into `.env` as `DATABASE_URL` (use the **pooled** string for serverless if Neon offers it).
- **Server Actions:** Functions marked with `'use server'` that run on the server and can be called from forms—good for mutations without building a separate API.
- **Singleton Prisma client:** In Next dev, hot reload can create many instances of the client; a `globalThis` guard avoids exhausting DB connections.

---

## Stage 0 — Accounts and local sanity

**Goal:** Machine can run the app; you have a database URL ready before Prisma work.

### Steps

1. **Install dependencies** from the repo root (use what the README specifies; typically `bun install`).
2. **Run the dev server:** `bun run dev`. Open the URL Next prints (often `http://localhost:3000`). You should see the current home page with no errors in the terminal.
3. **Create a Neon project** (free tier is fine): create a database, copy the **PostgreSQL connection string**. You will need:
   - `DATABASE_URL` — full URL including user, password, host, database name, and usually `?sslmode=require`.
4. **Create `.env` locally** (never commit secrets). You will add variables in Stage 1; for now, confirm you know where `.env` lives (repo root).

### Checkpoint

- [ ] `bun run dev` works.
- [ ] You have a Neon `DATABASE_URL` saved in a password manager or notes until `.env` is created.

### Common issues

- **Port in use:** Stop other Next processes or pass a different port per Next docs.
- **Wrong Node/Bun:** If scripts fail oddly, check versions against README or team norms.

---

## Stage 1 — Tooling, env contract, and README alignment

**Goal:** Any developer (including future you) knows which env vars exist and how to run the app.

### What to do

1. **Add `.env.example`** at the repo root (committed; no secrets) with at least:
   - `DATABASE_URL` — placeholder comment explaining Neon pooled URL.
   - `GIT_PROOF_ISSUER_NAME` — human-readable name shown on proofs (e.g. your name or org).
2. **Copy to `.env`** and fill real values. `.env` should stay gitignored.
3. **Update `README.md`** with:
   - What Git Proof is (one short paragraph).
   - **Install:** `bun install`
   - **Dev:** `bun run dev`
   - **Database:** set `DATABASE_URL`, then Prisma commands (you will add exact migrate commands after Stage 2).
   - **Security (v1):** explicitly state that `/admin/*` is **not authenticated**—anyone with the URL can create or edit data. Do not deploy publicly without adding protection later.
4. **Optional:** Tweak root `metadata` in `app/layout.tsx` later (Stage 7); you can note that in README as “product name: Git Proof”.

### Checkpoint

- [ ] `.env.example` documents every variable the app will read.
- [ ] README would let a stranger run `bun install` and `bun run dev` (DB steps can say “after migrations” until Stage 2 is done).

### Common issues

- Forgetting `sslmode` or Neon-specific params—Neon’s dashboard usually gives a complete string; use that.
- Putting secrets in `.env.example`—only placeholders there.

---

## Stage 2 — Prisma schema, Neon, first migration

**Goal:** Database tables match your product: `DeveloperProof`, `Project`, enums, indexes.

### What to know before editing

- **Models:** `DeveloperProof` is the parent; `Project` rows point to it via `developerProofId`.
- **Checklist:** Five booleans on `Project`; **one** corresponds to “live demo verified” (or your chosen label). The **public page** must **hide** the “live demo checked” row unless that boolean is `true`—pick field names you will reuse in UI (e.g. `liveDemoChecked` or match names from your brief consistently everywhere).
- **Status:** Enum `verified` | `revoked` on projects.

### Steps (in order)

1. **Open or create** `prisma/schema.prisma`.
2. Set `datasource db { provider = "postgresql" url = env("DATABASE_URL") }` and a `generator` for the client.
3. Define `DeveloperProof`: `id` (cuid or uuid string), `githubUsername`, `issuerName`, `createdAt`, relation to `projects Project[]`.
4. Define `ProjectStatus` enum and `Project` with all fields from the short plan, plus `@@index([developerProofId])` on `Project`.
5. **Validate:** `bunx prisma validate`
6. **Create migration:** `bunx prisma migrate dev --name init` (name can vary). This applies SQL to Neon and creates migration files—**commit those files**.
7. **Generate client:** usually part of migrate; if needed `bunx prisma generate`.

### Checkpoint

- [ ] `bunx prisma studio` opens and shows empty tables (optional but very reassuring).
- [ ] No Prisma errors; migration folder exists under `prisma/migrations`.

### Common issues

- **Connection refused / timeout:** Wrong `DATABASE_URL`, firewall, or IP allowlist—Neon is often open; double-check copy-paste.
- **Drift:** If you hand-edit the DB in the UI, Prisma may complain—prefer migrations as the source of truth.
- **Prisma 7:** If the project uses newer Prisma config patterns, follow Prisma’s message text and the repo’s existing files—do not assume Prisma 4 tutorials.

---

## Stage 3 — Data access: `lib/db.ts`

**Goal:** One shared Prisma client for server code, safe with Next hot reload.

### Steps

1. Add `lib/db.ts` exporting a singleton `prisma` instance.
2. Use the standard pattern: create `new PrismaClient()`, in development attach it to `globalThis` so reloads reuse the same instance; in production use a single module-level instance.
3. **Import rule:** Server Components and Server Actions import `prisma` only from this file—never `new PrismaClient()` scattered in the codebase.

### Checkpoint

- [ ] Starting `bun run dev` and loading a page that uses `prisma` does not spam “too many connections” warnings.

### Common issues

- Importing the DB client in **client** components by accident—Prisma must run on the server. If you see bundler errors about Node APIs, you put it in the wrong layer.

---

## Stage 4 — Admin: create proof (`/admin/create`)

**Goal:** Form submits → new `DeveloperProof` row → redirect to `/admin/proof/[id]`.

### Steps

1. Create `app/admin/create/page.tsx` with a form (at minimum `githubUsername`).
2. Add a **Server Action** (same file with `'use server'` or `actions.ts` beside it):
   - Trim input; reject empty.
   - Read `GIT_PROOF_ISSUER_NAME` from `process.env` with a clear fallback only if you explicitly want one.
   - `prisma.developerProof.create({ data: { ... } })` (use your actual model name casing).
   - `redirect(\`/admin/proof/${id}\`)` from `next/navigation`.
3. Show validation errors for empty fields; optionally a generic error if the DB fails.

### How to verify manually

1. Open `/admin/create`, submit a username, land on `/admin/proof/...`.
2. Confirm row in Prisma Studio or SQL.

### Checkpoint

- [ ] Second submission creates a **second** proof (unless you intentionally block duplicates—v1 usually allows multiple).

### Common issues

- **Redirect not working:** Forgot `redirect` from `next/navigation` or threw before redirect.
- **Server Action not running:** Missing `'use server'`, or form `action` not wired correctly—check Next 16 docs for the exact pattern you use.

---

## Stage 5 — Admin: manage proof (`/admin/proof/[id]`)

**Goal:** List projects for this proof; add new projects with full fields; optional status toggle.

### Steps

1. `app/admin/proof/[id]/page.tsx` as a **Server Component**: load proof by `params.id`, `include: { projects: { orderBy: { issuedAt: 'desc' } } } }` (adjust to your schema).
2. If no proof: `notFound()`.
3. Render a table or list of projects (name, status, dates, links).
4. **Add project form** with: name, description, repo URL, optional live URL, status, five booleans. On create, set `issuedAt` to `new Date()` unless your product says otherwise.
5. **Server Action(s)** to insert `Project` linked to `developerProofId`.
6. **Optional:** button + action to flip `verified` ↔ `revoked`.
7. After mutations, use `revalidatePath` (or equivalent) so the UI refreshes without a manual reload—check Next 16 docs for the recommended helper.

### Checkpoint

- [ ] Two projects on the same proof both appear and survive refresh.
- [ ] Ordering matches spec (e.g. newest first).

### Common issues

- **Wrong id:** `params` in App Router may be async in your Next version—follow the pattern in `node_modules/next/dist/docs/` for dynamic routes.
- **Form not clearing / stale list:** Missing revalidation.

---

## Stage 6 — Public proof page (`/proof/[id]`)

**Goal:** Read-only, shareable page; 404 if id unknown; checklist UX matches spec.

### Steps

1. `app/proof/[id]/page.tsx`: load proof + projects; `notFound()` if missing.
2. **Header:** GitHub username, issuer, proof id, created date (human-readable).
3. **Cards:** project name, description, repo link, live link if set, status badge (not color-only—include text), issued date.
4. **Checklist:** Map each boolean to a **human label**. Implement the rule: **do not render** the “live demo” row unless that boolean is true (exact label text can match your brief).
5. **Footer:** issuer line, “Generated via Git Proof”, proof id, dates.
6. **Accessibility:** semantic headings, visible focus on links, status conveyed with text.

### Checkpoint

- [ ] Bad id → 404 page.
- [ ] Toggle live-demo boolean in admin and confirm public row appears/disappears correctly.

### Common issues

- Confusing **proof** `createdAt` with project `issuedAt`—keep labels clear for readers.

---

## Stage 7 — Landing page, metadata, styling

**Goal:** Replace default marketing boilerplate; coherent look; optional shadcn.

### Steps

1. **`app/page.tsx`:** Short explanation of Git Proof; link to `/admin/create`; note how public URLs look (`/proof/[id]`).
2. **`app/layout.tsx`:** `title` / `description` for “Git Proof”.
3. **Styling choice:**
   - **Fast path:** Tailwind + native elements only.
   - **Design system:** Add shadcn per your stack’s supported init, then use Button, Card, Input, etc. consistently—do not mix random one-off components.
4. Polish badges for verified/revoked and empty states (“No projects yet”).

### Checkpoint

- [ ] Home and proof pages feel like one product (spacing, typography).
- [ ] Reasonable on mobile widths.

---

## Stage 8 — QA, lint, build, and “done”

**Goal:** Confidence the v1 scope is actually complete.

### Manual QA script (walk through once)

1. Create proof → redirected to manage.
2. Add two projects with different statuses and checklist combinations.
3. Open public `/proof/[id]` in a fresh tab; confirm all fields and the live-demo visibility rule.
4. Restart dev server; data still in Neon (persistence).
5. Invalid proof URL → 404.

### Commands

- `bun run lint`
- `bun run build`

### Definition of Done (copy from short plan)

- Create proof → manage; multiple projects; Neon persistence; public page with checklist rule and badges; `bun run dev` works; Prisma via `bunx`; README and `.env.example` accurate; security limitation stated.

---

## File map (expected)

Use this as a checklist while you create files:

| Path | Purpose |
|------|---------|
| `prisma/schema.prisma` | Models and enums |
| `prisma/migrations/*` | Applied SQL history (commit these) |
| `lib/db.ts` | Prisma singleton |
| `app/admin/create/page.tsx` | Create form |
| `app/admin/create/actions.ts` | Optional: server actions only |
| `app/admin/proof/[id]/page.tsx` | Manage proof |
| `app/admin/proof/[id]/actions.ts` | Optional: actions |
| `app/proof/[id]/page.tsx` | Public proof |
| `app/page.tsx` | Landing |
| `app/layout.tsx` | Metadata |
| `.env.example` | Documented env vars |
| `README.md` | Setup + security note |

---

## When you are stuck

1. Read the error **top to bottom**—Prisma and Next usually say what is null or mis-imported.
2. Check **server vs client** boundaries for Prisma and secrets.
3. Open `node_modules/next/dist/docs/` for App Router, Server Actions, and `notFound`/`redirect` behavior for **your** Next version.
4. Commit a small working slice before experimental refactors so you can revert cleanly.

You can keep [git_proof_next_plan.md](git_proof_next_plan.md) open for the architecture diagram and todo IDs while executing this walkthrough stage by stage.
