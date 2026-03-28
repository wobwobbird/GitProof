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
  /** When set, Create (proof) + Public links are shown; otherwise those slots are hidden. */
  proofId?: number;
};

/** Shared metrics so active and inactive pills stay the same visual size */
const pillBase =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium leading-snug";

const pillLink =
  `${pillBase} border-white/20 bg-white/5 text-neutral-200 transition hover:border-emerald-400/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`;

const pillCurrent =
  `${pillBase} cursor-default border-emerald-400/50 bg-emerald-500/25 text-emerald-100`;

export default function PanelNav({ active, proofId }: PanelNavProps) {
  const hasProof = proofId != null && proofId >= 1;

  return (
    <div className="panel-nav-shell">
      <nav
        aria-label="Git Proof pages"
        className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2"
      >
        <ul className="flex flex-wrap items-center gap-2">
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
        </ul>
        {hasProof ? (
          <ul className="flex flex-wrap items-center justify-end gap-2">
            <li>
              {active === "manage" ? (
                <span className={pillCurrent} aria-current="page">
                  <IconManage />
                  Create
                </span>
              ) : (
                <Link href={`/admin/proof/${proofId}`} className={pillLink}>
                  <IconManage />
                  Create
                </Link>
              )}
            </li>
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
          </ul>
        ) : null}
      </nav>
    </div>
  );
}
