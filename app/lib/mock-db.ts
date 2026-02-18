import bcrypt from 'bcryptjs';
import type { CharacterFaction } from '@/app/lib/types/auth';

/**
 * In-memory mock database (Model layer).
 * Mimics Prisma API so all actions work without MySQL.
 *
 * ┌──────────────────────────────────────────────────┐
 * │  Edit SEED_USERS / SEED_CHARACTERS to change     │
 * │  initial test data. Passwords are plain text —    │
 * │  hashed automatically on first access.            │
 * └──────────────────────────────────────────────────┘
 */

// ── Seed data ──────────────────────────────────────────────────────────

const SEED_USERS = [
  { id: 'usr_1', email: 'admin@test.com', username: 'admin', password: 'admin123' },
  { id: 'usr_2', email: 'player@test.com', username: 'player', password: 'player123' },
  { id: 'usr_3', email: 'demo@test.com', username: 'demo', password: 'demo1234' },
];

const SEED_CHARACTERS: MockCharacter[] = [
  { id: 'chr_1', userId: 'usr_1', name: 'ShadowBlade', faction: 'Tang Clan', level: 85, jpoint: 12500, gold: 340000, createdAt: new Date() },
  { id: 'chr_2', userId: 'usr_1', name: 'IronMonk', faction: 'Shaolin', level: 72, jpoint: 8200, gold: 180000, createdAt: new Date() },
  { id: 'chr_3', userId: 'usr_2', name: 'WindWalker', faction: 'Wudang', level: 60, jpoint: 4500, gold: 95000, createdAt: new Date() },
];

// ── Internal types ─────────────────────────────────────────────────────

interface MockUser {
  id: string;
  email: string;
  username: string;
  password: string;
  secondaryPassword: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MockCharacter {
  id: string;
  userId: string;
  name: string;
  faction: CharacterFaction;
  level: number;
  jpoint: number;
  gold: number;
  createdAt: Date;
}

// ── Internal state ─────────────────────────────────────────────────────

let users: MockUser[] = [];
let characters: MockCharacter[] = [];
let ready = false;
let initPromise: Promise<void> | null = null;

async function ensureInit() {
  if (ready) return;
  if (!initPromise) {
    initPromise = (async () => {
      users = await Promise.all(
        SEED_USERS.map(async (u) => ({
          ...u,
          password: await bcrypt.hash(u.password, 10),
          secondaryPassword: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      );
      characters = [...SEED_CHARACTERS];
      ready = true;
    })();
  }
  await initPromise;
}

let nextUserId = SEED_USERS.length + 1;
let nextCharId = SEED_CHARACTERS.length + 1;

// ── Mock DB API ────────────────────────────────────────────────────────

export const mockDb = {
  // ── User operations ──────────────────────────────────────────────────

  user: {
    findUnique: async (args: { where: { email?: string; id?: string } }) => {
      await ensureInit();
      const { email, id } = args.where;
      return users.find((u) => (email ? u.email === email : u.id === id)) ?? null;
    },

    findFirst: async (args: { where: { OR: Array<{ email?: string; username?: string }> } }) => {
      await ensureInit();
      return (
        users.find((u) =>
          args.where.OR.some(
            (c) => (c.email && u.email === c.email) || (c.username && u.username === c.username),
          ),
        ) ?? null
      );
    },

    create: async (args: { data: { email: string; username: string; password: string } }) => {
      await ensureInit();
      const now = new Date();
      const newUser: MockUser = {
        id: `usr_${nextUserId++}`,
        email: args.data.email,
        username: args.data.username,
        password: args.data.password,
        secondaryPassword: null,
        createdAt: now,
        updatedAt: now,
      };
      users.push(newUser);
      console.log(`[mock-db] Created user: ${newUser.username} (${newUser.email})`);
      return newUser;
    },

    update: async (args: { where: { id: string }; data: { secondaryPassword?: string | null } }) => {
      await ensureInit();
      const user = users.find((u) => u.id === args.where.id);
      if (!user) return null;
      if (args.data.secondaryPassword !== undefined) {
        user.secondaryPassword = args.data.secondaryPassword;
      }
      user.updatedAt = new Date();
      return user;
    },
  },

  // ── Character operations ─────────────────────────────────────────────

  character: {
    findMany: async (args: { where: { userId: string } }) => {
      await ensureInit();
      return characters
        .filter((c) => c.userId === args.where.userId)
        .sort((a, b) => b.level - a.level);
    },

    findUnique: async (args: { where: { id: string } }) => {
      await ensureInit();
      return characters.find((c) => c.id === args.where.id) ?? null;
    },

    count: async (args: { where: { userId: string } }) => {
      await ensureInit();
      return characters.filter((c) => c.userId === args.where.userId).length;
    },

    create: async (args: {
      data: { userId: string; name: string; faction?: CharacterFaction };
    }) => {
      await ensureInit();
      const newChar: MockCharacter = {
        id: `chr_${nextCharId++}`,
        userId: args.data.userId,
        name: args.data.name,
        faction: args.data.faction ?? 'None',
        level: 1,
        jpoint: 0,
        gold: 0,
        createdAt: new Date(),
      };
      characters.push(newChar);
      console.log(`[mock-db] Created character: ${newChar.name} (${newChar.faction})`);
      return newChar;
    },

    update: async (args: {
      where: { id: string; userId: string };
      data: { jpoint?: number };
    }) => {
      await ensureInit();
      const char = characters.find(
        (c) => c.id === args.where.id && c.userId === args.where.userId,
      );
      if (!char) return null;
      if (args.data.jpoint !== undefined) char.jpoint = args.data.jpoint;
      return char;
    },

    delete: async (args: { where: { id: string; userId: string } }) => {
      await ensureInit();
      const idx = characters.findIndex(
        (c) => c.id === args.where.id && c.userId === args.where.userId,
      );
      if (idx === -1) return null;
      const [deleted] = characters.splice(idx, 1);
      return deleted;
    },
  },
};
