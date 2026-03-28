import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
  }).format(d);
}

const CHECKLIST_LABELS = {
  repositoryPublic: "Repository publicly accessible",
  documentationComplete: "Documentation complete",
  testsVerified: "Tests verified",
  licenseClear: "License clear",
} as const;

type ChecklistKey = keyof typeof CHECKLIST_LABELS;

export default async function PublicProofPage(
  props: PageProps<"/proof/[id]">,
) {
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
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="border-b border-neutral-200 pb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Developer proof
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            @{proof.githubUsername}
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            <span className="font-medium text-neutral-800">Verified projects</span>
            {" · "}
            Issued by{" "}
            <span className="font-medium text-neutral-800">{proof.issuerName}</span>
          </p>
          <dl className="mt-4 grid gap-1 text-sm text-neutral-600 sm:grid-cols-2">
            <div>
              <dt className="inline text-neutral-500">Proof ID</dt>
              <dd className="inline font-mono text-neutral-800"> {proof.id}</dd>
            </div>
            <div>
              <dt className="inline text-neutral-500">Proof created</dt>
              <dd className="inline text-neutral-800">
                {" "}
                {formatDate(proof.createdAt)}
              </dd>
            </div>
          </dl>
        </header>

        <section className="py-10" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="text-xl font-semibold">
            Projects
          </h2>

          {proof.projects.length === 0 ? (
            <div
              className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-white/90 px-6 py-14 text-center shadow-sm"
              role="status"
            >
              <p className="text-sm font-medium text-neutral-800">No projects yet</p>
              <p className="mt-2 text-sm text-neutral-600">
                This proof has no projects attached. Add some from the admin manage
                page.
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-1 justify-items-center gap-6 lg:grid-cols-[400px_400px] lg:justify-center lg:gap-x-6 lg:gap-y-8">
              {proof.projects.map((project) => (
                <li key={project.id} className="w-full max-w-[400px] lg:max-w-none">
                  <article className="w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {project.name}
                      </h3>
                      <p
                        className={
                          project.status === "verified"
                            ? "shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-900 ring-2 ring-emerald-600/25"
                            : "shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-950 ring-2 ring-amber-700/30"
                        }
                      >
                        <span className="sr-only">Project status: </span>
                        {project.status === "verified"
                          ? "Verified"
                          : "Revoked"}
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                      {project.description}
                    </p>

                    <p className="mt-2 text-xs text-neutral-500">
                      <span className="font-medium text-neutral-600">Issued</span>{" "}
                      {formatDate(project.issuedAt)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <Link
                        href={project.repoUrl}
                        className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-2 hover:decoration-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Repository
                      </Link>
                      {project.liveUrl ? (
                        <Link
                          href={project.liveUrl}
                          className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-2 hover:decoration-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Live demo
                        </Link>
                      ) : null}
                    </div>

                    <section
                      className="mt-6 border-t border-neutral-100 pt-5"
                      aria-label={`Checklist for ${project.name}`}
                    >
                      <h4 className="text-sm font-medium text-neutral-800">
                        Checklist
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                        {project.liveDemoChecked ? (
                          <li className="flex gap-2">
                            <span className="text-emerald-600" aria-hidden>
                              ✓
                            </span>
                            <span>Live demo checked</span>
                          </li>
                        ) : null}
                        {(Object.keys(CHECKLIST_LABELS) as ChecklistKey[]).map(
                          (key) => (
                            <li key={key} className="flex gap-2">
                              <span className="text-neutral-400" aria-hidden>
                                {project[key] ? "✓" : "—"}
                              </span>
                              <span>
                                {CHECKLIST_LABELS[key]}
                                <span className="sr-only">
                                  {project[key]
                                    ? ", confirmed"
                                    : ", not confirmed"}
                                </span>
                                <span className="text-neutral-500" aria-hidden>
                                  {" "}
                                  ({project[key] ? "yes" : "no"})
                                </span>
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </section>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="border-t border-neutral-200 pt-8 text-sm text-neutral-600">
          <p>
            Issued by <span className="font-medium text-neutral-800">{proof.issuerName}</span>
          </p>
          <p className="mt-1">Generated via Git Proof</p>
          <p className="mt-1 font-mono text-xs text-neutral-500">
            Proof ID {proof.id} · Created {formatDate(proof.createdAt)}
          </p>
        </footer>
      </main>
    </div>
  );
}
