import { createDeveloperProof } from "./actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminCreatePage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-8">
      <div>
        <h1 className="text-xl font-semibold">Create developer proof</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Enter a GitHub username. Issuer name comes from{" "}
          <code className="rounded bg-neutral-100 px-1">GIT_PROOF_ISSUER_NAME</code>{" "}
          in <code className="rounded bg-neutral-100 px-1">.env</code>.
        </p>
      </div>

      {error === "empty_username" ? (
        <p className="text-sm text-red-600" role="alert">
          GitHub username cannot be empty.
        </p>
      ) : null}

      <form action={createDeveloperProof} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="githubUsername" className="text-sm font-medium">
            GitHub username
          </label>
          <input
            id="githubUsername"
            name="githubUsername"
            type="text"
            autoComplete="username"
            className="rounded border border-neutral-300 px-3 py-2 text-sm"
            placeholder="octocat"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
        >
          Create proof
        </button>
      </form>
    </main>
  );
}
