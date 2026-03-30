import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PanelNav from "@/components/PanelNav";
import { DemoShell } from "@/components/DemoShell";
import { useDemo } from "@/context/DemoStore";

const inputClass =
  "rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50";

export default function CreateProof() {
  const navigate = useNavigate();
  const { createProof } = useDemo();
  const [error, setError] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("githubUsername") ?? "");
    const result = createProof(username);
    if (result === "empty_username") {
      setError(true);
      return;
    }
    setError(false);
    navigate(`/admin/proof/${result}`);
  }

  return (
    <DemoShell>
      <main className="layout-shell py-10 md:py-14">
        <div className="panel-column">
          <PanelNav active="create" />
          <div className="frosted-panel">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Create developer proof
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-300">
              Enter a GitHub username. In this demo the issuer is fixed (see banner).
            </p>

            {error ? (
              <p className="mt-6 text-sm text-red-300" role="alert">
                GitHub username cannot be empty.
              </p>
            ) : null}

            <form
              onSubmit={onSubmit}
              className={error ? "mt-4 flex flex-col gap-5" : "mt-8 flex flex-col gap-5"}
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="githubUsername" className="text-sm font-medium text-white/50">
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
                className="inline-flex h-11 w-fit items-center justify-center rounded-lg bg-emerald-500/50 px-6 text-sm font-semibold text-white shadow-sm backdrop-blur-xs transition-colors hover:bg-emerald-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Create proof
              </button>
            </form>
          </div>
        </div>
      </main>
    </DemoShell>
  );
}
