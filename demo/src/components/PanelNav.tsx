import { NavLink } from "react-router-dom";
import { DemoBanner } from "@/components/DemoBanner";
import {
  IconHome,
  IconManage,
  IconNewProof,
  IconPublic,
} from "@/components/ui-icons";

export type PanelNavActive = "home" | "create" | "manage" | "public";

type PanelNavProps = {
  active?: PanelNavActive;
  proofId?: number;
};

const pillBase =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium leading-snug";

const pillLink =
  `${pillBase} border-white/20 bg-white/5 text-neutral-200 transition hover:border-emerald-400/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`;

const pillCurrent =
  `${pillBase} cursor-default border-emerald-400/50 bg-emerald-500/25 text-emerald-100`;

export default function PanelNav({ active, proofId }: PanelNavProps) {
  const hasProof = proofId != null && proofId >= 1;

  return (
    <div className="flex w-full flex-col gap-3">
      <DemoBanner />
      <div className="panel-nav-shell mt-1">
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
                <NavLink to="/" className={pillLink} end>
                  <IconHome />
                  Home
                </NavLink>
              )}
            </li>
            <li>
              {active === "create" ? (
                <span className={pillCurrent} aria-current="page">
                  <IconNewProof />
                  New proof
                </span>
              ) : (
                <NavLink to="/admin/create" className={pillLink}>
                  <IconNewProof />
                  New proof
                </NavLink>
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
                  <NavLink to={`/admin/proof/${proofId}`} className={pillLink}>
                    <IconManage />
                    Create
                  </NavLink>
                )}
              </li>
              <li>
                {active === "public" ? (
                  <span className={pillCurrent} aria-current="page">
                    <IconPublic />
                    Public
                  </span>
                ) : (
                  <NavLink to={`/proof/${proofId}`} className={pillLink}>
                    <IconPublic />
                    Public
                  </NavLink>
                )}
              </li>
            </ul>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
