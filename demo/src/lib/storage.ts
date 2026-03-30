import type { DemoStateV1 } from "./types";
import { STORAGE_KEY } from "./constants";
import { createSeededState } from "./seedData";

/** Empty baseline (e.g. after “reset demo”). */
export function defaultState(): DemoStateV1 {
  return {
    version: 1,
    nextProofId: 1,
    nextProjectId: 1,
    proofs: [],
    projects: [],
  };
}

export function loadState(): DemoStateV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createSeededState();
    }
    const parsed = JSON.parse(raw) as DemoStateV1;
    if (parsed?.version !== 1 || !Array.isArray(parsed.proofs) || !Array.isArray(parsed.projects)) {
      return createSeededState();
    }
    return parsed;
  } catch {
    return createSeededState();
  }
}

export function saveState(state: DemoStateV1): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
