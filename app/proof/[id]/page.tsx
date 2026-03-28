import { notFound } from "next/navigation";
import Link from "next/link";
import PanelNav from "@/app/components/panel-nav";
import { prisma } from "@/lib/db";

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
  }).format(d);
}

/** Boolean fields on Project — keep in sync with prisma/schema.prisma */
const CHECKLIST_ROWS = [
  { key: "liveDemoChecked", label: "Live demo checked" },
  { key: "repositoryPublic", label: "Repository publicly accessible" },
  { key: "documentationComplete", label: "Documentation complete" },
  { key: "testsVerified", label: "Tests verified" },
  { key: "licenseClear", label: "License clear" },
] as const;

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
        <div className="panel-column">
          <PanelNav active="public" proofId={proof.id} />
          <div className="frosted-panel">
          <header className="border-b border-white/10 pb-8">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">
              Developer proof
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              @{proof.githubUsername}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-neutral-300">
              <span className="font-medium text-white">Verified projects</span>
              {" · "}
              Issued by{" "}
              <span className="font-medium text-white">{proof.issuerName}</span>
            </p>
            <dl className="mt-3 grid gap-1 text-sm text-neutral-300 sm:grid-cols-2">
              <div className="rounded font-mono bg-white/10 px-1.5 py-0.5 w-fit">
                <dt className="inline font-extrabold text-emerald-300">
                  Proof ID
                </dt>
                <dd className="inline font-mono text-emerald-300"> {proof.id}</dd>
              </div>
              <div className="rounded font-mono bg-white/10 px-1.5 py-0.5 w-fit">
                <dt className="inline font-extrabold text-emerald-300">
                  Proof created
                </dt>
                <dd className="inline text-emerald-300">
                  {" "}
                  {formatDate(proof.createdAt)}
                </dd>
              </div>
            </dl>
          </header>

          <section className="py-3" aria-labelledby="projects-heading">
            <h2
              id="projects-heading"
              className="text-xl font-semibold tracking-tight text-white"
            >
              Projects
            </h2>

            {proof.projects.length === 0 ? (
              <div
                className="mt-3 rounded-xl border border-dashed border-white/25 bg-green-300/30 px-6 py-14 text-center backdrop-blur-xs"
                role="status"
              >
                <p className="text-sm font-semibold text-white">No projects yet</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  This proof has no projects attached. Add some from the
                  create proof page.
                </p>
              </div>
            ) : (
              <ul className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6">
                {proof.projects.map((project) => (
                  <li key={project.id} className="min-w-0">
                    <article className="flex h-[300px] w-full flex-col overflow-y-auto rounded-xl border border-white/20 bg-green-300/30 p-3.5 shadow-sm backdrop-blur-xs md:p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-base font-semibold leading-tight text-white">
                          {project.name}
                        </h3>
                        <p
                          className={
                            project.status === "verified"
                              ? "shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-200 ring-2 ring-emerald-400/30"
                              : "shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-100 ring-2 ring-amber-400/35"
                          }
                        >
                          <span className="sr-only">Project status: </span>
                          {project.status === "verified"
                            ? "Verified"
                            : "Revoked"}
                        </p>
                      </div>

                      <p className="mt-2 h-15 line-clamp-2 text-sm leading-snug text-white/85">
                        {project.description}
                      </p>

                      <p className="mt-1.5 text-[11px] leading-snug text-white/55">
                        <span className="font-medium text-white/75">
                          Issued
                        </span>{" "}
                        {formatDate(project.issuedAt)}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
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
                        className="mt-2 border-t border-white/20 pt-2"
                        aria-label={`Checklist for ${project.name}`}
                      >
                        <h4 className="text-xs font-semibold text-white">
                          Checklist
                        </h4>
                        <ul className="mt-1.5 space-y-0.5 text-xs leading-snug">
                          {CHECKLIST_ROWS.map(({ key, label }) => {
                            const checked = project[key];
                            return (
                              <li key={key} className="flex gap-2">
                                <span
                                  className={
                                    checked
                                      ? "inline-flex w-4 shrink-0 justify-center font-semibold text-emerald-200"
                                      : "inline-flex w-4 shrink-0 justify-center text-white/50"
                                  }
                                  aria-hidden
                                >
                                  {checked ? "✓" : "—"}
                                </span>
                                <span className="min-w-0 text-white/90">
                                  {label}
                                  <span className="sr-only">
                                    {checked
                                      ? ", confirmed"
                                      : ", not confirmed"}
                                  </span>
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <footer className="border-t border-white/10 pt-3 text-sm text-neutral-300">
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
        </div>
      </main>
    </div>
  );
}
