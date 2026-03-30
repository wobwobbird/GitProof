import { useNavigate, useParams } from "react-router-dom";
import AddProjectForm from "@/components/AddProjectForm";
import PanelNav from "@/components/PanelNav";
import { DemoShell } from "@/components/DemoShell";
import { useDemo } from "@/context/DemoStore";
import NotFound from "@/pages/NotFound";

export default function ManageProof() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProof, getProjectsForProof } = useDemo();
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    return <NotFound />;
  }

  const proof = getProof(parsedId);
  if (!proof) {
    return <NotFound />;
  }

  const projects = getProjectsForProof(proof.id);

  return (
    <DemoShell>
      <main className="layout-shell py-10 md:py-14">
        <div className="panel-column">
          <PanelNav active="manage" proofId={proof.id} />
          <div className="frosted-panel">
            <header className="border-b border-white/10 pb-4">
              <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">
                Create proof
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                @{proof.githubUsername}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                Proof ID <span className="font-mono text-white">{proof.id}</span>
                {" · "}
                <span className="text-neutral-400">
                  {projects.length} project{projects.length === 1 ? "" : "s"}
                </span>
              </p>
            </header>

            <div className="pt-4">
              <AddProjectForm proofId={proof.id} onAdded={() => navigate(`/proof/${proof.id}`)} />
            </div>
          </div>
        </div>
      </main>
    </DemoShell>
  );
}
