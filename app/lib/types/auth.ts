/**
 * Auth & Game domain types (Model layer).
 */

// ── User / Auth ────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface SessionUser {
  userId: string;
  email: string;
  username: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export type AuthActionResult =
  | { success: true; user: User }
  | { success: false; error: string };

// ── Game Characters ────────────────────────────────────────────────────

export const CHARACTER_FACTIONS = [
  'None',
  'Shaolin',
  'Tang Clan',
  'Five Poison',
  'Beggar Sect',
  'Wudang',
  'Emei',
  'Royal Guard',
  'Kunlun',
] as const;

export type CharacterFaction = (typeof CHARACTER_FACTIONS)[number];

export interface GameCharacter {
  id: string;
  userId: string;
  name: string;
  faction: CharacterFaction;
  level: number;
  jpoint: number;
  gold: number;
  createdAt: Date;
}

export const MAX_CHARACTERS_PER_ACCOUNT = 10;

// ── Action results ─────────────────────────────────────────────────────

export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export type CharacterActionResult =
  | { success: true; character: GameCharacter }
  | { success: false; error: string };

// ── Account profile ────────────────────────────────────────────────────

export interface AccountProfile {
  id: string;
  email: string;
  username: string;
  hasSecondaryPassword: boolean;
  characterCount: number;
  createdAt: Date;
}
