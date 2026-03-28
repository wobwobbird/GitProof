import { notFound } from "next/navigation";
import { prisma } from '@/lib/db';
import AddProjectForm from './add-project-form';
import formInputActions from "./actions";


export default async function Page ( props: PageProps<"/admin/proof/[id]"> ) {
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

  if(!proof) {
    notFound();
  }

  return (
    <AddProjectForm proofId={proof.id} action={formInputActions} />
  )
}