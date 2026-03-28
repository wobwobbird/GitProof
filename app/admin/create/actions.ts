"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

/**
 * Runs on the server when the user submits the form.
 * Form fields arrive as FormData (like a bag of name → value from the HTML form).
 */
export async function createDeveloperProof(formData: FormData) {
  const githubUsername = String(formData.get("githubUsername") ?? "").trim();

  if (!githubUsername) {
    redirect("/admin/create?error=empty_username");
  }

  // process.env is an object: process.env.VARIABLE_NAME — not process.env("string").
  const issuerName = process.env.GIT_PROOF_ISSUER_NAME?.trim();
  if (!issuerName) {
    throw new Error(
      "GIT_PROOF_ISSUER_NAME is not set. Add it to .env (see .env.example).",
    );
  }

  const proof = await prisma.developerProof.create({
    data: {
      githubUsername,
      issuerName,
    },
  });

  redirect(`/admin/proof/${proof.id}`);
}
