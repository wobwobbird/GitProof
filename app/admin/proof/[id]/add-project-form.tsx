"use client";

import { useMemo, useState } from "react";

const DEFAULT_GITHUB_REPO_PREFIX = "https://github.com/";

const inputClass =
  "rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50";

const labelClass = "text-sm font-medium text-neutral-200";

function OptionalMark() {
  return <span className="text-neutral-500"> (optional)</span>;
}

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

const CHECKLIST_TOGGLES = [
  {
    name: "liveDemoChecked",
    label: "Live demo",
    title: "Live demo checked",
  },
  {
    name: "repositoryPublic",
    label: "Repo public",
    title: "Repository publicly accessible",
  },
  {
    name: "documentationComplete",
    label: "Docs",
    title: "Documentation complete",
  },
  {
    name: "testsVerified",
    label: "Tests",
    title: "Tests verified",
  },
  {
    name: "licenseClear",
    label: "License",
    title: "License clear",
  },
] as const;

const toggleBtnClass =
  "inline-flex cursor-pointer select-none rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 transition has-[:checked]:border-emerald-400/50 has-[:checked]:bg-emerald-500/25 has-[:checked]:text-emerald-100 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-emerald-400 has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-transparent";

export default function AddProjectForm({ proofId, action }: AddProjectFormProps) {
  const [repoUrl, setRepoUrl] = useState(DEFAULT_GITHUB_REPO_PREFIX);

  const repoUrlBlocksSubmit = useMemo(
    () => isGithubRepoIncomplete(repoUrl),
    [repoUrl],
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Add project</h2>
        <p className="mt-0.5 text-xs text-neutral-400">
          <span className="text-red-300">*</span> required · checklist toggles are optional
        </p>
      </div>

      <form
        action={action}
        suppressHydrationWarning
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="developerProofId" value={String(proofId)} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-red-300">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={inputClass}
            placeholder="Project name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className={labelClass}>
            Description <span className="text-red-300">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            className={`${inputClass} resize-y`}
            placeholder="What this project is"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="repoUrl" className={labelClass}>
            Repository URL <span className="text-red-300">*</span>
          </label>
          <input
            id="repoUrl"
            name="repoUrl"
            type="text"
            inputMode="url"
            autoComplete="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className={inputClass}
            placeholder="owner/repo"
          />
          {repoUrlBlocksSubmit ? (
            <p className="text-xs text-neutral-400">
              Add owner/repo after the GitHub prefix to enable Add project.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="liveUrl" className={labelClass}>
            Live URL
            <OptionalMark />
          </label>
          <input
            id="liveUrl"
            name="liveUrl"
            type="text"
            inputMode="url"
            autoComplete="off"
            className={inputClass}
            placeholder="https://…"
          />
        </div>

        <fieldset className="min-w-0 border-0 p-0">
          <legend className={`${labelClass} mb-2 block w-full`}>
            Status
            <OptionalMark />
          </legend>
          <div className="flex flex-wrap gap-2">
            <label className={toggleBtnClass} title="Mark project as verified">
              <input
                type="radio"
                name="status"
                value="verified"
                className="sr-only"
              />
              <span>Verified</span>
            </label>
            <label className={toggleBtnClass} title="Mark project as revoked">
              <input
                type="radio"
                name="status"
                value="revoked"
                className="sr-only"
                defaultChecked
              />
              <span>Revoked</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="min-w-0 border-0 p-0">
          <legend className={`${labelClass} mb-2 block w-full`}>
            Checklist
            <OptionalMark />
          </legend>
          <div className="flex flex-wrap gap-2">
            {CHECKLIST_TOGGLES.map((item) => (
              <label key={item.name} className={toggleBtnClass} title={item.title}>
                <input
                  type="checkbox"
                  name={item.name}
                  className="sr-only"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={repoUrlBlocksSubmit}
          className="mt-1 w-fit rounded-lg bg-emerald-500/50 px-4 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-xs transition-colors hover:bg-emerald-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add project
        </button>
      </form>
    </div>
  );
}
