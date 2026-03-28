import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Welcome
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Git Proof
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-600">
          Issue a simple proof for a GitHub username, attach verified projects with
          links and checklist details, then share a read-only page with anyone.
        </p>

        <ol className="mt-8 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-neutral-700">
          <li>
            <span className="font-medium text-neutral-800">Create</span> a proof and
            set the issuer name (from your environment).
          </li>
          <li>
            <span className="font-medium text-neutral-800">Add projects</span> on the
            manage screen—repository URL, optional live link, status, and checklist
            items.
          </li>
          <li>
            <span className="font-medium text-neutral-800">Share</span> the public
            link so others can view the proof without signing in.
          </li>
        </ol>

        <div className="mt-10">
          <Link
            href="/admin/create"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
          >
            Create a proof
          </Link>
        </div>

        <section
          className="mt-12 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
          aria-labelledby="public-urls-heading"
        >
          <h2
            id="public-urls-heading"
            className="text-sm font-semibold text-neutral-900"
          >
            Public URLs
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Each proof has a shareable page at{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-800">
              /proof/[id]
            </code>
            —for example{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-800">
              /proof/10
            </code>{" "}
            if the proof&apos;s id is{" "}
            <span className="font-mono text-neutral-800">10</span>. Open that path in
            the browser after you create a proof.
          </p>
          <p className="mt-4 text-xs text-neutral-500">
            v1 admin routes are not authenticated; do not expose a production deploy
            without adding protection.
          </p>
        </section>
      </main>
    </div>
  );
}
