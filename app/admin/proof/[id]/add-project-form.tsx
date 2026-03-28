"use client";

import { useMemo, useState } from "react";

const DEFAULT_GITHUB_REPO_PREFIX = "https://github.com/";

/** Disables submit until the URL is more than the default github.com prefix (owner/repo). */
function isGithubRepoIncomplete(url: string): boolean {
  const trimmed = url.trim();
  if (/^https:\/\/github\.com\/?$/i.test(trimmed)) {
    return true;
  }
  const match = /^https:\/\/github\.com\/(.+)$/i.exec(trimmed);
  if (!match) {
    return false;
  }
  const pathPart = match[1].replace(/\/+$/, "");
  return pathPart === "" || !pathPart.includes("/");
}

type AddProjectFormProps = {
  proofId: number;
  action: (formData: FormData) => void | Promise<void>;
};

export default function AddProjectForm({ proofId, action }: AddProjectFormProps) {
  const [repoUrl, setRepoUrl] = useState(DEFAULT_GITHUB_REPO_PREFIX);

  const repoUrlBlocksSubmit = useMemo(
    () => isGithubRepoIncomplete(repoUrl),
    [repoUrl],
  );

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900">Add project</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Required fields are marked. Checklist items are optional attestations.
      </p>

      <form
        action={action}
        suppressHydrationWarning
        className="mt-6 flex flex-col gap-5"
      >
        <input type="hidden" name="developerProofId" value={String(proofId)} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-neutral-800">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="Project name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-neutral-800">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="resize-y rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="What this project is"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="repoUrl" className="text-sm font-medium text-neutral-800">
            Repository URL <span className="text-red-600">*</span>
          </label>
          <input
            id="repoUrl"
            name="repoUrl"
            type="text"
            inputMode="url"
            autoComplete="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="owner/repo"
          />
          {repoUrlBlocksSubmit ? (
            <p className="text-xs text-neutral-500">
              Add owner/repo after the GitHub prefix to enable Add project.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="liveUrl" className="text-sm font-medium text-neutral-800">
            Live URL <span className="text-neutral-400">(optional)</span>
          </label>
          <input
            id="liveUrl"
            name="liveUrl"
            type="text"
            inputMode="url"
            autoComplete="off"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="https://…"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-neutral-800">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue="revoked"
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          >
            <option value="verified">Verified</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        <fieldset className="rounded-md border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-medium text-neutral-800">Checklist</legend>
          <ul className="mt-3 flex flex-col gap-3">
            <li className="flex items-center gap-2">
              <input
                id="liveDemoChecked"
                name="liveDemoChecked"
                type="checkbox"
                className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
              />
              <label htmlFor="liveDemoChecked" className="text-sm text-neutral-800">
                Live demo checked
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                id="repositoryPublic"
                name="repositoryPublic"
                type="checkbox"
                className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
              />
              <label htmlFor="repositoryPublic" className="text-sm text-neutral-800">
                Repository public
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                id="documentationComplete"
                name="documentationComplete"
                type="checkbox"
                className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
              />
              <label htmlFor="documentationComplete" className="text-sm text-neutral-800">
                Documentation complete
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                id="testsVerified"
                name="testsVerified"
                type="checkbox"
                className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
              />
              <label htmlFor="testsVerified" className="text-sm text-neutral-800">
                Tests verified
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input
                id="licenseClear"
                name="licenseClear"
                type="checkbox"
                className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
              />
              <label htmlFor="licenseClear" className="text-sm text-neutral-800">
                License clear
              </label>
            </li>
          </ul>
        </fieldset>

        <button
          type="submit"
          disabled={repoUrlBlocksSubmit}
          className="mt-1 w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add project
        </button>
      </form>
    </section>
  );
}
