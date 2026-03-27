-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('verified', 'revoked');

-- CreateTable
CREATE TABLE "DeveloperProof" (
    "id" SERIAL NOT NULL,
    "githubUsername" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeveloperProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "status" "ProjectStatus" NOT NULL DEFAULT 'revoked',
    "id" SERIAL NOT NULL,
    "developerProofId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liveUrl" TEXT,
    "liveDemoChecked" BOOLEAN NOT NULL DEFAULT false,
    "repositoryPublic" BOOLEAN NOT NULL DEFAULT false,
    "documentationComplete" BOOLEAN NOT NULL DEFAULT false,
    "testsVerified" BOOLEAN NOT NULL DEFAULT false,
    "licenseClear" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_developerProofId_idx" ON "Project"("developerProofId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_developerProofId_fkey" FOREIGN KEY ("developerProofId") REFERENCES "DeveloperProof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
