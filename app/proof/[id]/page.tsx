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

const linkClass =
  "font-medium text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

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
    <div className="min-h-dvh">
      <main className="layout-shell py-10 md:py-14">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-xs sm:px-8 sm:py-10">
          <header className="border-b border-white/10 pb-8">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">
              Developer proof
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              @{proof.githubUsername}
            </h1>
            <p className="mt-3 text-sm text-neutral-300">
              <span className="font-medium text-white">Verified projects</span>
              {" · "}
              Issued by{" "}
              <span className="font-medium text-white">{proof.issuerName}</span>
            </p>
            <dl className="mt-4 grid gap-1 text-sm text-neutral-300 sm:grid-cols-2">
              <div>
                <dt className="inline text-neutral-400">Proof ID</dt>
                <dd className="inline font-mono text-white"> {proof.id}</dd>
              </div>
              <div>
                <dt className="inline text-neutral-400">Proof created</dt>
                <dd className="inline text-white">
                  {" "}
                  {formatDate(proof.createdAt)}
                </dd>
              </div>
            </dl>
          </header>

          <section className="py-10" aria-labelledby="projects-heading">
            <h2
              id="projects-heading"
              className="text-xl font-semibold text-white"
            >
              Projects
            </h2>

            {proof.projects.length === 0 ? (
              <div
                className="mt-6 rounded-xl border border-dashed border-white/20 bg-white/5 px-6 py-14 text-center backdrop-blur-xs"
                role="status"
              >
                <p className="text-sm font-medium text-white">No projects yet</p>
                <p className="mt-2 text-sm text-neutral-300">
                  This proof has no projects attached. Add some from the admin
                  manage page.
                </p>
              </div>
            ) : (
              <ul className="mt-6 grid grid-cols-1 justify-items-center gap-6 lg:grid-cols-[400px_400px] lg:justify-center lg:gap-x-6 lg:gap-y-8">
                {proof.projects.map((project) => (
                  <li
                    key={project.id}
                    className="w-full max-w-[400px] lg:max-w-none"
                  >
                    <article className="w-full rounded-xl border border-white/10 bg-white/10 p-6 shadow-sm backdrop-blur-xs">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          {project.name}
                        </h3>
                        <p
                          className={
                            project.status === "verified"
                              ? "shrink-0 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200 ring-2 ring-emerald-400/30"
                              : "shrink-0 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100 ring-2 ring-amber-400/35"
                          }
                        >
                          <span className="sr-only">Project status: </span>
                          {project.status === "verified"
                            ? "Verified"
                            : "Revoked"}
                        </p>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                        {project.description}
                      </p>

                      <p className="mt-2 text-xs text-neutral-400">
                        <span className="font-medium text-neutral-300">
                          Issued
                        </span>{" "}
                        {formatDate(project.issuedAt)}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <Link
                          href={project.repoUrl}
                          className={linkClass}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Repository
                        </Link>
                        {project.liveUrl ? (
                          <Link
                            href={project.liveUrl}
                            className={linkClass}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Live demo
                          </Link>
                        ) : null}
                      </div>

                      <section
                        className="mt-6 border-t border-white/10 pt-5"
                        aria-label={`Checklist for ${project.name}`}
                      >
                        <h4 className="text-sm font-medium text-white">
                          Checklist
                        </h4>
                        <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                          {project.liveDemoChecked ? (
                            <li className="flex gap-2">
                              <span className="text-emerald-400" aria-hidden>
                                ✓
                              </span>
                              <span>Live demo checked</span>
                            </li>
                          ) : null}
                          {(Object.keys(CHECKLIST_LABELS) as ChecklistKey[]).map(
                            (key) => (
                              <li key={key} className="flex gap-2">
                                <span className="text-neutral-500" aria-hidden>
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

          <footer className="border-t border-white/10 pt-8 text-sm text-neutral-300">
            <p>
              Issued by{" "}
              <span className="font-medium text-white">{proof.issuerName}</span>
            </p>
            <p className="mt-1 text-neutral-400">Generated via Git Proof</p>
            <p className="mt-1 w-fit max-w-full font-mono text-xs rounded bg-white/10 px-1.5 py-0.5 text-emerald-300">
              Proof ID {proof.id} · Created {formatDate(proof.createdAt)}
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
