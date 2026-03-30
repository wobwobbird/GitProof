import type { ComponentType, FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  IconDocs,
  IconLicense,
  IconLiveDemo,
  IconRepoPublic,
  IconRevokedBadge,
  IconTests,
  IconVerifiedBadge,
} from "@/components/ui-icons";
import { useDemo } from "@/context/DemoStore";
import { isGithubRepoIncomplete } from "@/lib/repoValidation";
import type { ProjectStatus } from "@/lib/types";

const DEFAULT_GITHUB_REPO_PREFIX = "https://github.com/";

const inputClass =
  "rounded-md border border-white/20 bg-white/0 px-2.5 py-1.5 text-sm text-white placeholder:text-white/50 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50";

const labelClass = "text-sm font-medium text-neutral-200";

function OptionalMark() {
  return <span className="text-white/50"> (optional)</span>;
}

type ChecklistIcon = ComponentType<{ className?: string }>;

const CHECKLIST_TOGGLES: readonly {
  name: string;
  label: string;
  title: string;
  Icon: ChecklistIcon;
}[] = [
  { name: "liveDemoChecked", label: "Live demo", title: "Live demo checked", Icon: IconLiveDemo },
  {
    name: "repositoryPublic",
    label: "Repo public",
    title: "Repository publicly accessible",
    Icon: IconRepoPublic,
  },
  { name: "documentationComplete", label: "Docs", title: "Documentation complete", Icon: IconDocs },
  { name: "testsVerified", label: "Tests", title: "Tests verified", Icon: IconTests },
  { name: "licenseClear", label: "License", title: "License clear", Icon: IconLicense },
];

const toggleBtnClass =
  "inline-flex cursor-pointer select-none items-center rounded-full border border-white/20 bg-white/5 px-2.5 py-1.5 text-sm font-medium text-neutral-300 transition has-[:checked]:border-emerald-400/50 has-[:checked]:bg-emerald-500/25 has-[:checked]:text-emerald-100 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-emerald-400 has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-transparent";

const fieldGap = "flex flex-col gap-1";

type Props = {
  proofId: number;
  onAdded: () => void;
};

export default function AddProjectForm({ proofId, onAdded }: Props) {
  const { addProject } = useDemo();
  const [repoUrl, setRepoUrl] = useState(DEFAULT_GITHUB_REPO_PREFIX);

  const repoUrlBlocksSubmit = useMemo(() => isGithubRepoIncomplete(repoUrl), [repoUrl]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (repoUrlBlocksSubmit) {
      return;
    }
    const fd = new FormData(e.currentTarget);
    const status = String(fd.get("status") ?? "revoked") as ProjectStatus;
    const safeStatus = status === "verified" ? "verified" : "revoked";

    addProject(proofId, {
      name: String(fd.get("name") ?? ""),
      description: String(fd.get("description") ?? ""),
      repoUrl: String(fd.get("repoUrl") ?? ""),
      liveUrl: String(fd.get("liveUrl") ?? ""),
      status: safeStatus,
      liveDemoChecked: fd.get("liveDemoChecked") === "on",
      repositoryPublic: fd.get("repositoryPublic") === "on",
      documentationComplete: fd.get("documentationComplete") === "on",
      testsVerified: fd.get("testsVerified") === "on",
      licenseClear: fd.get("licenseClear") === "on",
    });
    onAdded();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-white">Add project</h2>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={fieldGap}>
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
          <div className={fieldGap}>
            <label htmlFor="repoUrl" className={labelClass}>
              Repo URL <span className="text-red-300">*</span>
            </label>
            <input
              id="repoUrl"
              name="repoUrl"
              type="text"
              inputMode="url"
              autoComplete="url"
              value={repoUrl}
              onChange={(ev) => setRepoUrl(ev.target.value)}
              className={inputClass}
              placeholder="https://github.com/owner/repo"
            />
            {repoUrlBlocksSubmit ? (
              <p className="text-[11px] leading-snug text-white/50">Add owner/repo after github.com/…</p>
            ) : null}
          </div>
        </div>

        <div className={fieldGap}>
          <label htmlFor="description" className={labelClass}>
            Description <span className="text-red-300">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={2}
            className={`${inputClass} resize-y`}
            placeholder="Short summary"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 pt-0.5 sm:grid-cols-2 sm:gap-4">
          <div className={`${fieldGap} min-w-0`}>
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
            <legend className={`${labelClass} mb-1 block w-full`}>
              Status
              <OptionalMark />
            </legend>
            <div className="flex flex-row gap-1.5">
              <label className={`${toggleBtnClass} w-fit`} title="Mark project as verified">
                <input type="radio" name="status" value="verified" className="sr-only" />
                <span className="inline-flex items-center gap-1">
                  <IconVerifiedBadge />
                  Verified
                </span>
              </label>
              <label className={`${toggleBtnClass} w-fit`} title="Mark project as revoked">
                <input
                  type="radio"
                  name="status"
                  value="revoked"
                  className="sr-only"
                  defaultChecked
                />
                <span className="inline-flex items-center gap-1">
                  <IconRevokedBadge />
                  Revoked
                </span>
              </label>
            </div>
          </fieldset>
        </div>

        <fieldset className="min-w-0 w-full border-0 p-0">
          <legend className={`${labelClass} mb-1 block w-full`}>
            Checklist
            <span className="text-white/50"> (optional)</span>
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {CHECKLIST_TOGGLES.map(({ name, label, title, Icon }) => (
              <label key={name} className={toggleBtnClass} title={title}>
                <input type="checkbox" name={name} className="sr-only" />
                <span className="inline-flex items-center gap-1">
                  <Icon />
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={repoUrlBlocksSubmit}
          className="mt-0.5 inline-flex h-11 w-fit items-center justify-center rounded-lg bg-emerald-500/50 px-6 text-sm font-semibold text-white shadow-sm backdrop-blur-xs transition-colors hover:bg-emerald-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add project
        </button>
      </form>
    </div>
  );
}
