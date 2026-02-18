import { mockDb } from './mock-db';
import type { CharacterFaction } from './types/auth';

/**
 * Database access layer (Model layer).
 *
 * Toggle between mock (in-memory) and real MySQL:
 *   USE_MOCK_DB=true   → uses mock-db.ts (no MySQL needed)
 *   USE_MOCK_DB=false  → uses Prisma + MySQL
 */

const useMock = process.env.USE_MOCK_DB !== 'false';

function createPrismaDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@/app/generated/prisma/client');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

  const url = new URL(
    process.env.DATABASE_URL ?? 'mysql://root:password@localhost:3306/legend_of_warlords',
  );

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  });

  return new PrismaClient({ adapter });
}

// ── DbClient interface ─────────────────────────────────────────────────

export interface DbClient {
  user: {
    findUnique: (args: { where: { email?: string; id?: string } }) => Promise<{
      id: string; email: string; username: string; password: string;
      secondaryPassword: string | null; createdAt: Date;
    } | null>;
    findFirst: (args: {
      where: { OR: Array<{ email?: string; username?: string }> };
    }) => Promise<{
      id: string; email: string; username: string; password: string;
    } | null>;
    create: (args: {
      data: { email: string; username: string; password: string };
    }) => Promise<{
      id: string; email: string; username: string; password: string;
    }>;
    update: (args: {
      where: { id: string };
      data: { secondaryPassword?: string | null };
    }) => Promise<{
      id: string; email: string; username: string;
      secondaryPassword: string | null;
    } | null>;
  };
  character: {
    findMany: (args: { where: { userId: string } }) => Promise<Array<{
      id: string; userId: string; name: string; faction: CharacterFaction;
      level: number; jpoint: number; gold: number; createdAt: Date;
    }>>;
    findUnique: (args: { where: { id: string } }) => Promise<{
      id: string; userId: string; name: string; faction: CharacterFaction;
      level: number; jpoint: number; gold: number; createdAt: Date;
    } | null>;
    count: (args: { where: { userId: string } }) => Promise<number>;
    create: (args: {
      data: { userId: string; name: string; faction?: CharacterFaction };
    }) => Promise<{
      id: string; userId: string; name: string; faction: CharacterFaction;
      level: number; jpoint: number; gold: number; createdAt: Date;
    }>;
    update: (args: {
      where: { id: string; userId: string };
      data: { jpoint?: number };
    }) => Promise<{
      id: string; userId: string; name: string; faction: CharacterFaction;
      level: number; jpoint: number; gold: number; createdAt: Date;
    } | null>;
    delete: (args: {
      where: { id: string; userId: string };
    }) => Promise<{
      id: string; name: string;
    } | null>;
  };
}

// ── Singleton ──────────────────────────────────────────────────────────

const globalForDb = globalThis as unknown as { _db: DbClient | undefined };

function getDb(): DbClient {
  if (globalForDb._db) return globalForDb._db;

  let client: DbClient;
  if (useMock) {
    console.log('[db] Using MOCK database (in-memory). Set USE_MOCK_DB=false for real MySQL.');
    client = mockDb;
  } else {
    console.log('[db] Using REAL MySQL database via Prisma.');
    client = createPrismaDb() as DbClient;
  }

  globalForDb._db = client;
  return client;
}

export const db = getDb();
