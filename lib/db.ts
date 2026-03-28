// One sentence summary
// lib/db.ts builds one shared, correctly configured Prisma database
// client, reuses it across dev reloads, and exports it so the
// whole app talks to Neon through one front door.


import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
};

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
