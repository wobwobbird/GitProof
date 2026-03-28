import Link from "next/link";
import PanelNav from "@/app/components/panel-nav";

export default function NotFound() {
  return (
    <main className="layout-shell flex min-h-dvh flex-col justify-center py-10 md:py-14">
      <div className="panel-column">
        <PanelNav />
        <div className="frosted-panel">
          <h1 className="text-xl font-semibold text-white">Not found</h1>
          <p className="mt-2 text-sm text-neutral-300">
            That proof does not exist or the link is invalid.
          </p>
          <p className="mt-6 text-sm text-neutral-400">
            <Link
              href="/"
              className="text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300"
            >
              Home
            </Link>
            <span className="mx-2 text-neutral-500">·</span>
            <Link
              href="/admin/create"
              className="text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300"
            >
              Create a proof
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
