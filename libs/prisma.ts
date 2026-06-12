import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables for non-Next.js environments (like tsx test runners)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

// Define the global object structure to persist across hot-reloads
const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

// Instantiate the connection pool as a singleton to prevent connection leaks
if (!globalForPrisma.pgPool) {
  const isProduction = process.env.NODE_ENV === 'production';
  const needsSSL = connectionString.includes('db.prisma.io') || connectionString.includes('neon.tech') || isProduction;
  globalForPrisma.pgPool = new Pool({
    connectionString,
    ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
  });
}

const pool = globalForPrisma.pgPool;
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pool;
}

export default prisma;

