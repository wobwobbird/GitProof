import { notFound } from "next/navigation";
import PanelNav from "@/app/components/panel-nav";
import { prisma } from "@/lib/db";
import AddProjectForm from "./add-project-form";
import formInputActions from "./actions";

export default async function Page(props: PageProps<"/admin/proof/[id]">) {
  const { id } = await props.params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    notFound();
  }

  const proof = await prisma.developerProof.findUnique({
    where: { id: parsedId },
    include: {
      projects: { orderBy: { issuedAt: "desc" } },
    },
  });

  if (!proof) {
    notFound();
  }

  return (
    <div className="min-h-dvh">
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
              Proof ID{" "}
              <span className="font-mono text-white">{proof.id}</span>
              {" · "}
              <span className="text-neutral-400">
                {proof.projects.length} project
                {proof.projects.length === 1 ? "" : "s"}
              </span>
            </p>
          </header>

          <div className="pt-4">
            <AddProjectForm proofId={proof.id} action={formInputActions} />
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}
