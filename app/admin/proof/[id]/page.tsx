import { notFound } from "next/navigation";
import { prisma } from '@/lib/db';
import Link from "next/link";



export default async function Page ( props: PageProps<"/admin/proof/[id]"> ) {
  const { id } = await props.params;
  const parsedId = Number(id);
  
  if (!Number.isInteger(parsedId) || parsedId < 1) {
    // some error message
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
    <main className=" size-dvw items-center justify-center bg-pink-400">
      /* render proof + projects */
    </main>
  )


  
  
}