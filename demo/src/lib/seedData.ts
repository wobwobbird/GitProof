import { DEMO_ISSUER_NAME } from "./constants";
import type { DemoStateV1, DeveloperProof, Project } from "./types";

/** Preset demo proofs — match quick links in the demo banner. */
export const SEED_PROOF_LORD_ID = 100;
export const SEED_PROOF_TROPICAL_ID = 101;

function p(
  partial: Omit<Project, "id" | "developerProofId"> & { developerProofId: number },
  id: number,
): Project {
  return {
    id,
    developerProofId: partial.developerProofId,
    name: partial.name,
    description: partial.description,
    repoUrl: partial.repoUrl,
    liveUrl: partial.liveUrl ?? null,
    status: partial.status,
    issuedAt: partial.issuedAt,
    liveDemoChecked: partial.liveDemoChecked,
    repositoryPublic: partial.repositoryPublic,
    documentationComplete: partial.documentationComplete,
    testsVerified: partial.testsVerified,
    licenseClear: partial.licenseClear,
  };
}

export function createSeededState(): DemoStateV1 {
  const proofs: DeveloperProof[] = [
    {
      id: SEED_PROOF_LORD_ID,
      githubUsername: "LordMarshy",
      issuerName: DEMO_ISSUER_NAME,
      createdAt: "2025-01-15T12:00:00.000Z",
    },
    {
      id: SEED_PROOF_TROPICAL_ID,
      githubUsername: "TropicalBastos",
      issuerName: DEMO_ISSUER_NAME,
      createdAt: "2025-02-01T12:00:00.000Z",
    },
  ];

  const projects: Project[] = [
    p(
      {
        developerProofId: SEED_PROOF_LORD_ID,
        name: "Mood_Tracker_CLI",
        description:
          "Mental Health Tracker CLI tool, record mood and review results.",
        repoUrl: "https://github.com/wobwobbird/Mood_Tracker",
        liveUrl: null,
        status: "verified",
        issuedAt: "2025-03-01T10:00:00.000Z",
        liveDemoChecked: false,
        repositoryPublic: true,
        documentationComplete: true,
        testsVerified: false,
        licenseClear: true,
      },
      1,
    ),
    p(
      {
        developerProofId: SEED_PROOF_LORD_ID,
        name: "Tap 'O' Matic",
        description: "A React Native TypeScript random number generator app.",
        repoUrl: "https://github.com/wobwobbird/Tap-O-Matic",
        liveUrl: null,
        status: "verified",
        issuedAt: "2025-02-20T14:30:00.000Z",
        liveDemoChecked: true,
        repositoryPublic: true,
        documentationComplete: true,
        testsVerified: true,
        licenseClear: true,
      },
      2,
    ),
    p(
      {
        developerProofId: SEED_PROOF_LORD_ID,
        name: "Super Connect",
        description:
          "A two-player turn-based Connect 4–style game built in Unity 6 (URP).",
        repoUrl: "https://github.com/wobwobbird/Super-Connect-Game",
        liveUrl: null,
        status: "verified",
        issuedAt: "2025-02-10T09:15:00.000Z",
        liveDemoChecked: false,
        repositoryPublic: true,
        documentationComplete: true,
        testsVerified: false,
        licenseClear: true,
      },
      3,
    ),
    p(
      {
        developerProofId: SEED_PROOF_LORD_ID,
        name: "Git Proof",
        description: "Issue developer proofs for a GitHub username.",
        repoUrl: "https://github.com/wobwobbird/gitproof",
        liveUrl: null,
        status: "verified",
        issuedAt: "2025-03-28T16:00:00.000Z",
        liveDemoChecked: false,
        repositoryPublic: true,
        documentationComplete: true,
        testsVerified: false,
        licenseClear: true,
      },
      4,
    ),
    p(
      {
        developerProofId: SEED_PROOF_TROPICAL_ID,
        name: "Brolang",
        description:
          "Programming language where all of its keywords are prefixed with 'br'.",
        repoUrl: "https://github.com/TropicalBastos/brolang",
        liveUrl: null,
        status: "verified",
        issuedAt: "2025-03-05T11:00:00.000Z",
        liveDemoChecked: false,
        repositoryPublic: true,
        documentationComplete: true,
        testsVerified: false,
        licenseClear: false,
      },
      5,
    ),
    p(
      {
        developerProofId: SEED_PROOF_TROPICAL_ID,
        name: "OpenDefinitionAside",
        description:
          "VS Code extension that adds functionality to the editor context menu for opening definitions to the side.",
        repoUrl: "https://github.com/TropicalBastos/OpenDefinitionAside",
        liveUrl: null,
        status: "verified",
        issuedAt: "2025-03-12T13:20:00.000Z",
        liveDemoChecked: false,
        repositoryPublic: true,
        documentationComplete: true,
        testsVerified: true,
        licenseClear: true,
      },
      6,
    ),
    p(
      {
        developerProofId: SEED_PROOF_TROPICAL_ID,
        name: "AquaSim",
        description:
          "Aqua Sim is a simple aquarium simulator that adopts the principles of Boids.",
        repoUrl: "https://github.com/TropicalBastos/AquaSim",
        liveUrl: null,
        status: "revoked",
        issuedAt: "2025-02-28T08:45:00.000Z",
        liveDemoChecked: true,
        repositoryPublic: false,
        documentationComplete: false,
        testsVerified: false,
        licenseClear: false,
      },
      7,
    ),
  ];

  return {
    version: 1,
    nextProofId: 102,
    nextProjectId: 8,
    proofs,
    projects,
  };
}
