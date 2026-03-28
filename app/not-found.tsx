import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-xl font-semibold">Not found</h1>
      <p className="mt-2 text-sm text-neutral-600">
        That proof does not exist or the link is invalid.
      </p>
      <Link href="/admin/create" className="mt-4 inline-block text-sm underline">
        Create a proof
      </Link>
    </main>
  );
}