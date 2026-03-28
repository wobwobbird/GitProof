import Link from "next/link";
import {
  IconHome,
  IconManage,
  IconNewProof,
  IconPublic,
} from "@/app/components/ui-icons";

export type PanelNavActive = "home" | "create" | "manage" | "public";

type PanelNavProps = {
  /** Highlights the matching pill with aria-current; omit when no page matches (e.g. 404). */
  active?: PanelNavActive;
  /** When set, Manage + Public links are shown; otherwise those slots are hidden. */
  proofId?: number;
};

const pillLink =
  "inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-200 transition hover:border-emerald-400/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const pillCurrent =
  "inline-flex cursor-default items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/25 px-3 py-1.5 text-xs font-semibold text-emerald-100";

export default function PanelNav({ active, proofId }: PanelNavProps) {
  const hasProof = proofId != null && proofId >= 1;

  return (
    <div className="panel-nav-shell">
      <nav aria-label="Git Proof pages">
        <ul className="flex flex-wrap items-center justify-center gap-2">
          <li>
            {active === "home" ? (
              <span className={pillCurrent} aria-current="page">
                <IconHome />
                Home
              </span>
            ) : (
              <Link href="/" className={pillLink}>
                <IconHome />
                Home
              </Link>
            )}
          </li>
          <li>
            {active === "create" ? (
              <span className={pillCurrent} aria-current="page">
                <IconNewProof />
                New proof
              </span>
            ) : (
              <Link href="/admin/create" className={pillLink}>
                <IconNewProof />
                New proof
              </Link>
            )}
          </li>
          {hasProof ? (
            <li>
              {active === "manage" ? (
                <span className={pillCurrent} aria-current="page">
                  <IconManage />
                  Manage
                </span>
              ) : (
                <Link href={`/admin/proof/${proofId}`} className={pillLink}>
                  <IconManage />
                  Manage
                </Link>
              )}
            </li>
          ) : null}
          {hasProof ? (
            <li>
              {active === "public" ? (
                <span className={pillCurrent} aria-current="page">
                  <IconPublic />
                  Public
                </span>
              ) : (
                <Link href={`/proof/${proofId}`} className={pillLink}>
                  <IconPublic />
                  Public
                </Link>
              )}
            </li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
}
