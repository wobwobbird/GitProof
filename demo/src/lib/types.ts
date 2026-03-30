export type ProjectStatus = "verified" | "revoked";

export type DeveloperProof = {
  id: number;
  githubUsername: string;
  issuerName: string;
  createdAt: string;
};

export type Project = {
  id: number;
  developerProofId: number;
  name: string;
  description: string;
  repoUrl: string;
  liveUrl: string | null;
  status: ProjectStatus;
  issuedAt: string;
  liveDemoChecked: boolean;
  repositoryPublic: boolean;
  documentationComplete: boolean;
  testsVerified: boolean;
  licenseClear: boolean;
};

export type DemoStateV1 = {
  version: 1;
  nextProofId: number;
  nextProjectId: number;
  proofs: DeveloperProof[];
  projects: Project[];
};

export type ChecklistKey =
  | "liveDemoChecked"
  | "repositoryPublic"
  | "documentationComplete"
  | "testsVerified"
  | "licenseClear";
