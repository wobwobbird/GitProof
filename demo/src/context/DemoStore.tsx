import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEMO_ISSUER_NAME } from "@/lib/constants";
import { defaultState, loadState, saveState } from "@/lib/storage";
import type { DeveloperProof, Project, ProjectStatus } from "@/lib/types";

type AddProjectInput = {
  name: string;
  description: string;
  repoUrl: string;
  liveUrl: string;
  status: ProjectStatus;
  liveDemoChecked: boolean;
  repositoryPublic: boolean;
  documentationComplete: boolean;
  testsVerified: boolean;
  licenseClear: boolean;
};

type DemoContextValue = {
  proofs: DeveloperProof[];
  projects: Project[];
  getProof: (id: number) => DeveloperProof | undefined;
  getProjectsForProof: (proofId: number) => Project[];
  createProof: (githubUsername: string) => number | "empty_username";
  addProject: (proofId: number, input: AddProjectInput) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState(loadState);
  const snapRef = useRef(snap);
  useEffect(() => {
    snapRef.current = snap;
  }, [snap]);

  const getProof = useCallback(
    (id: number) => snap.proofs.find((p) => p.id === id),
    [snap.proofs],
  );

  const getProjectsForProof = useCallback(
    (proofId: number) =>
      snap.projects
        .filter((p) => p.developerProofId === proofId)
        .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()),
    [snap.projects],
  );

  const createProof = useCallback((githubUsername: string): number | "empty_username" => {
    const u = githubUsername.trim();
    if (u === "") {
      return "empty_username";
    }
    const prev = snapRef.current;
    const newId = prev.nextProofId;
    const proof: DeveloperProof = {
      id: newId,
      githubUsername: u,
      issuerName: DEMO_ISSUER_NAME,
      createdAt: new Date().toISOString(),
    };
    const next = {
      ...prev,
      nextProofId: prev.nextProofId + 1,
      proofs: [...prev.proofs, proof],
    };
    saveState(next);
    snapRef.current = next;
    setSnap(next);
    return newId;
  }, []);

  const addProject = useCallback((proofId: number, input: AddProjectInput) => {
    const prev = snapRef.current;
    const id = prev.nextProjectId;
    const liveTrim = input.liveUrl.trim();
    const project: Project = {
      id,
      developerProofId: proofId,
      name: input.name.trim(),
      description: input.description.trim(),
      repoUrl: input.repoUrl.trim(),
      liveUrl: liveTrim === "" ? null : liveTrim,
      status: input.status,
      issuedAt: new Date().toISOString(),
      liveDemoChecked: input.liveDemoChecked,
      repositoryPublic: input.repositoryPublic,
      documentationComplete: input.documentationComplete,
      testsVerified: input.testsVerified,
      licenseClear: input.licenseClear,
    };
    const next = {
      ...prev,
      nextProjectId: prev.nextProjectId + 1,
      projects: [...prev.projects, project],
    };
    saveState(next);
    snapRef.current = next;
    setSnap(next);
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = defaultState();
    saveState(fresh);
    snapRef.current = fresh;
    setSnap(fresh);
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({
      proofs: snap.proofs,
      projects: snap.projects,
      getProof,
      getProjectsForProof,
      createProof,
      addProject,
      resetDemo,
    }),
    [snap.proofs, snap.projects, getProof, getProjectsForProof, createProof, addProject, resetDemo],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within DemoProvider");
  }
  return ctx;
}
