# Git Proof

Small Next.js app for issuing and displaying **developer proofs**: a public page lists verified projects for a GitHub user, with checklist metadata stored in PostgreSQL (via Prisma and Neon).

## Requirements

- [Bun](https://bun.sh)
- A [Neon](https://neon.tech) project (or any PostgreSQL URL compatible with Prisma)

## Setup

1. Clone the repo and install dependencies:

   ```bash
   bun install
   ```

2. Copy the environment template and fill in values:

   ```bash
   cp .env.example .env
   ```

3. In the Neon dashboard, create a project/database and copy the Postgres connection string into `DATABASE_URL` in `.env`.
   - Prefer the **pooled** connection string for app/runtime usage.
   - If you use Neon roles/branches, ensure the URL points to the branch you intend to develop against.

4. Set `GIT_PROOF_ISSUER_NAME` to the name shown as the issuer on proofs (for example your company or your own name).

5. Run the Prisma + Neon flow from the project root:

   - Create/apply migration to Neon:

   ```bash
   bunx prisma migrate dev --name init
   ```

   - Regenerate Prisma Client (safe to run anytime schema changes):

   ```bash
   bunx prisma generate
   ```

   - Optional sanity check:

   ```bash
   bunx prisma studio
   ```

6. Start the app:

   ```bash
   bun run dev
   ```

## Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
bun run build
bun run start
bun run lint
```

## Security note (v1)

Admin routes under `/admin` are **not authenticated**. Anyone who can reach the URL can create or change data. Do not expose this app to the public internet without additional protection if that matters for your use case.

## Stack

- [Next.js](https://nextjs.org) (App Router), TypeScript, Tailwind CSS
- Prisma + Neon PostgreSQL (once configured in the repo)
