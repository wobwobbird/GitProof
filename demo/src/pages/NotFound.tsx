import { Link } from "react-router-dom";
import PanelNav from "@/components/PanelNav";
import { DemoShell } from "@/components/DemoShell";

export default function NotFound() {
  return (
    <DemoShell>
      <main className="layout-shell flex min-h-[70dvh] flex-col justify-center py-10 md:py-14">
        <div className="panel-column">
          <PanelNav />
          <div className="frosted-panel">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">404</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Not found
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-300">
              That proof does not exist or the link is invalid.
            </p>
            <p className="mt-6 text-sm text-neutral-400">
              <Link
                to="/"
                className="text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300"
              >
                Home
              </Link>
              <span className="mx-2 text-neutral-500">·</span>
              <Link
                to="/admin/create"
                className="text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300"
              >
                Create a proof
              </Link>
            </p>
          </div>
        </div>
      </main>
    </DemoShell>
  );
}
