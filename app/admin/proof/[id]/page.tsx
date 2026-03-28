import Link from "next/link";
import { notFound } from "next/navigation";
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

  const linkBase =
    "text-sm text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300";

  return (
    <div className="min-h-dvh">
      <main className="layout-shell py-10 md:py-14">
        <div className="frosted-panel">
          <header className="border-b border-white/10 pb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
              Manage proof
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              @{proof.githubUsername}
            </h1>
            <p className="mt-1 text-sm text-neutral-300">
              Proof ID{" "}
              <span className="font-mono text-white">{proof.id}</span>
              {" · "}
              <span className="text-neutral-400">
                {proof.projects.length} project
                {proof.projects.length === 1 ? "" : "s"}
              </span>
            </p>
            <nav className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
              <Link href={`/proof/${proof.id}`} className={linkBase}>
                View public proof
              </Link>
              <Link href="/admin/create" className={linkBase}>
                New proof
              </Link>
              <Link href="/" className={linkBase}>
                Home
              </Link>
            </nav>
          </header>

          <div className="pt-5">
            <AddProjectForm proofId={proof.id} action={formInputActions} />
          </div>
        </div>
      </main>
    </div>
  );
}
