import Link from "next/link";

export default function NotFound() {
  return (
    <main className="layout-shell flex min-h-dvh flex-col justify-center py-10 md:py-14">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xs">
        <h1 className="text-xl font-semibold text-white">Not found</h1>
        <p className="mt-2 text-sm text-neutral-300">
          That proof does not exist or the link is invalid.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300"
        >
          Home
        </Link>
        <span className="mx-2 text-neutral-500">·</span>
        <Link
          href="/admin/create"
          className="inline-block text-sm text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300"
        >
          Create a proof
        </Link>
      </div>
    </main>
  );
}
