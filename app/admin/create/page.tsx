import PanelNav from "@/app/components/panel-nav";
import { createDeveloperProof } from "./actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const inputClass =
  "rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50";

export default async function AdminCreatePage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="min-h-dvh">
      <main className="layout-shell py-10 md:py-14">
        <div className="panel-column">
          <PanelNav active="create" />
          <div className="frosted-panel">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">
            Admin
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Create developer proof
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            Enter a GitHub username. Issuer name comes from{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
              GIT_PROOF_ISSUER_NAME
            </code>{" "}
            in{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
              .env
            </code>
            .
          </p>

          {error === "empty_username" ? (
            <p className="mt-6 text-sm text-red-300" role="alert">
              GitHub username cannot be empty.
            </p>
          ) : null}

          <form
            action={createDeveloperProof}
            className={
              error === "empty_username"
                ? "mt-4 flex flex-col gap-5"
                : "mt-8 flex flex-col gap-5"
            }
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="githubUsername"
                className="text-sm font-medium text-neutral-200"
              >
                GitHub username
              </label>
              <input
                id="githubUsername"
                name="githubUsername"
                type="text"
                autoComplete="username"
                className={inputClass}
                placeholder="octocat"
              />
            </div>
            <button
              type="submit"
              className="w-fit rounded-lg bg-emerald-500/50 px-4 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-xs transition-colors hover:bg-emerald-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Create proof
            </button>
          </form>
          </div>
        </div>
      </main>
    </div>
  );
}
