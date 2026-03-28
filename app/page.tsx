import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-dvh">
      <main className="layout-shell relative z-20 py-10 md:py-14">
        <div className="frosted-panel">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">
            Welcome
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Git Proof
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-300">
            Issue a simple proof for a GitHub username, attach verified projects with
            links and checklist details, then share a read-only page with anyone.
          </p>

          <ol className="mt-8 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-neutral-300">
            <li>
              <span className="font-medium text-white">Create</span> a proof and
              set the issuer name (from your environment).
            </li>
            <li>
              <span className="font-medium text-white">Add projects</span> on the
              manage screen—repository URL, optional live link, status, and checklist
              items.
            </li>
            <li>
              <span className="font-medium text-white">Share</span> the public
              link so others can view the proof without signing in.
            </li>
          </ol>

          <div className="mt-10">
            <Link
              href="/admin/create"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-500/50 backdrop-blur-xs px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Create a proof
            </Link>
          </div>

          <section
            className="mt-12 rounded-xl border border-white/10 bg-white/10 p-6 shadow-sm backdrop-blur-xs"
            aria-labelledby="public-urls-heading"
          >
            <h2
              id="public-urls-heading"
              className="text-sm font-semibold text-white"
            >
              Public URLs
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              Each proof has a shareable page at{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                /proof/[id]
              </code>
              —for example{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                /proof/10
              </code>{" "}
              if the proof&apos;s id is{" "}
              <span className="font-mono text-white">10</span>. Open that path in
              the browser after you create a proof.
            </p>
            <p className="mt-4 text-xs text-neutral-400">
              v1 admin routes are not authenticated; do not expose a production deploy
              without adding protection.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
