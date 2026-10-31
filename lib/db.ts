import { PrismaClient } from '@prisma/client';
import { resolveDatabaseUrl } from './db-url';

// The Prisma schema uses SQLite; keep relative paths consistent with project scripts.
const dbUrl = resolveDatabaseUrl();
process.env.DATABASE_URL = dbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
