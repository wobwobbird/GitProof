"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function formInputActions(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const repoUrl = String(formData.get("repoUrl") ?? "").trim();
  const liveUrl = String(formData.get("liveUrl") ?? "").trim();
  const status = String(formData.get("status") ?? "revoked");

  const liveDemoChecked = formData.get("liveDemoChecked") === "on";
  const repositoryPublic = formData.get("repositoryPublic") === "on";
  const documentationComplete = formData.get("documentationComplete") === "on";
  const testsVerified = formData.get("testsVerified") === "on";
  const licenseClear = formData.get("licenseClear") === "on";

  const developerProofId = Number(formData.get("developerProofId"));
  if (!Number.isInteger(developerProofId) || developerProofId < 1) {
    redirect("/admin/create");
  }

  if (status !== "revoked" && status !== "verified") {
    redirect("/admin/create");
  }

  if (name === "" || description === "" || repoUrl === "") {
    if ( name === "" ) {
      throw new Error(
        "name is not set",
      );
    }
    if ( description === "" ) {
      throw new Error(
        "description is not set",
      );
    }
    if (repoUrl === "") {
      throw new Error("repoUrl is not set");
    }
  }

  await prisma.project.create({
    data: {
      status: status,
      developerProofId: developerProofId,
      name: name,
      description: description,
      repoUrl: repoUrl,
      liveUrl: liveUrl === "" ? null : liveUrl,
      liveDemoChecked: liveDemoChecked,
      repositoryPublic: repositoryPublic,
      documentationComplete: documentationComplete,
      testsVerified: testsVerified,
      licenseClear: licenseClear,
    }
  });

  revalidatePath(`/admin/proof/${developerProofId}`);
  redirect(`/proof/${developerProofId}`);
}