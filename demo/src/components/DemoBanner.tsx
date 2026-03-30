import { Link } from "react-router-dom";
import { SEED_PROOF_LORD_ID, SEED_PROOF_TROPICAL_ID } from "@/lib/seedData";

/**
 * Demo-only strip: localStorage notice + quick links to seeded proofs.
 * Composed above the panel nav so it matches nav width inside `panel-column`.
 */
export function DemoBanner() {
  return (
    <div className="demo-banner-panel text-center">
      <p className="text-xs font-medium text-orange-200/70">
        Demo mode — data stays in this browser only (localStorage). Not connected to a server.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Link
          to={`/proof/${SEED_PROOF_LORD_ID}`}
          className="demo-banner-link text-orange-200/70"
        >
          Lord Marshy
        </Link>
        <Link
          to={`/proof/${SEED_PROOF_TROPICAL_ID}`}
          className="demo-banner-link text-orange-200/70"
        >
          Tropical Bastos
        </Link>
      </div>
    </div>
  );
}
