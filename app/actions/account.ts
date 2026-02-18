'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/app/lib/db';
import { getSession } from '@/app/lib/session';
import { getT } from '@/app/lib/i18n';
import { getLocaleFromCookies } from '@/app/lib/i18n/server';
import type {
  ActionResult,
  CharacterActionResult,
  GameCharacter,
  AccountProfile,
} from '@/app/lib/types/auth';

// ── Helpers ────────────────────────────────────────────────────────────

async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) {
    throw new Error('Unauthorized');
  }
  return session.userId;
}

// ── Account Profile ────────────────────────────────────────────────────

export async function getAccountProfile(): Promise<AccountProfile | null> {
  const userId = await requireUserId();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const characterCount = await db.character.count({ where: { userId } });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    hasSecondaryPassword: !!user.secondaryPassword,
    characterCount,
    createdAt: user.createdAt,
  };
}

// ── Secondary Password ─────────────────────────────────────────────────

export async function setSecondaryPassword(data: {
  currentPassword?: string;
  newPassword: string;
}): Promise<ActionResult> {
  const locale = await getLocaleFromCookies();
  const t = getT(locale);
  const userId = await requireUserId();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: t.errors.accountNotFound };

  // If user already has a secondary password, verify the current one
  if (user.secondaryPassword) {
    if (!data.currentPassword) {
      return { success: false, error: t.errors.secPwRequired };
    }
    const valid = await bcrypt.compare(data.currentPassword, user.secondaryPassword);
    if (!valid) {
      return { success: false, error: t.errors.secPwIncorrect };
    }
  }

  if (data.newPassword.length < 6) {
    return { success: false, error: t.errors.secPwMin6 };
  }

  const hashed = await bcrypt.hash(data.newPassword, 10);
  await db.user.update({
    where: { id: userId },
    data: { secondaryPassword: hashed },
  });

  return { success: true, message: t.errors.secPwUpdated };
}

export async function removeSecondaryPassword(data: {
  currentPassword: string;
}): Promise<ActionResult> {
  const locale = await getLocaleFromCookies();
  const t = getT(locale);
  const userId = await requireUserId();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: t.errors.accountNotFound };

  if (!user.secondaryPassword) {
    return { success: false, error: t.errors.secPwNone };
  }

  const valid = await bcrypt.compare(data.currentPassword, user.secondaryPassword);
  if (!valid) {
    return { success: false, error: t.errors.secPwWrong };
  }

  await db.user.update({
    where: { id: userId },
    data: { secondaryPassword: null },
  });

  return { success: true, message: t.errors.secPwRemoved };
}

// ── Game Characters ────────────────────────────────────────────────────

export async function getCharacters(): Promise<GameCharacter[]> {
  const userId = await requireUserId();
  return db.character.findMany({ where: { userId } });
}

export async function createCharacter(data: {
  name: string;
}): Promise<CharacterActionResult> {
  const locale = await getLocaleFromCookies();
  const t = getT(locale);
  const userId = await requireUserId();

  // Validate name
  const name = data.name.trim();
  if (!name || name.length < 2 || name.length > 16) {
    return { success: false, error: t.errors.charNameLength };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    return { success: false, error: t.errors.charNameInvalid };
  }

  // Check max characters
  const count = await db.character.count({ where: { userId } });
  if (count >= 10) {
    return { success: false, error: t.errors.charMax };
  }

  // Check duplicate name for this user
  const existing = await db.character.findMany({ where: { userId } });
  if (existing.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    return { success: false, error: t.errors.charDuplicate };
  }

  const character = await db.character.create({
    data: { userId, name, faction: 'None' },
  });

  return { success: true, character };
}

// ── JPoint Transfer ─────────────────────────────────────────────────────

export async function transferJPoint(data: {
  fromCharacterId: string;
  toCharacterId: string;
  amount: number;
}): Promise<ActionResult> {
  const locale = await getLocaleFromCookies();
  const t = getT(locale);
  const userId = await requireUserId();

  if (data.amount <= 0) {
    return { success: false, error: t.errors.transferAmountInvalid };
  }

  if (data.fromCharacterId === data.toCharacterId) {
    return { success: false, error: t.errors.transferSameChar };
  }

  // Fetch both characters and verify ownership
  const [from, to] = await Promise.all([
    db.character.findUnique({ where: { id: data.fromCharacterId } }),
    db.character.findUnique({ where: { id: data.toCharacterId } }),
  ]);

  if (!from || from.userId !== userId) {
    return { success: false, error: t.errors.charNotFound };
  }
  if (!to || to.userId !== userId) {
    return { success: false, error: t.errors.charNotFound };
  }

  if (from.jpoint < data.amount) {
    return { success: false, error: t.errors.transferInsufficientJP };
  }

  // Deduct from source, add to target
  await db.character.update({
    where: { id: from.id, userId },
    data: { jpoint: from.jpoint - data.amount },
  });
  await db.character.update({
    where: { id: to.id, userId },
    data: { jpoint: to.jpoint + data.amount },
  });

  return {
    success: true,
    message: t.errors.transferSuccess
      .replace('{amount}', data.amount.toLocaleString())
      .replace('{from}', from.name)
      .replace('{to}', to.name),
  };
}

export async function deleteCharacter(data: {
  characterId: string;
  secondaryPassword?: string;
}): Promise<ActionResult> {
  const locale = await getLocaleFromCookies();
  const t = getT(locale);
  const userId = await requireUserId();

  // If user has secondary password, require it for deletion
  const user = await db.user.findUnique({ where: { id: userId } });
  if (user?.secondaryPassword) {
    if (!data.secondaryPassword) {
      return { success: false, error: t.errors.charSecPwRequired };
    }
    const valid = await bcrypt.compare(data.secondaryPassword, user.secondaryPassword);
    if (!valid) {
      return { success: false, error: t.errors.secPwWrong };
    }
  }

  const deleted = await db.character.delete({
    where: { id: data.characterId, userId },
  });

  if (!deleted) {
    return { success: false, error: t.errors.charNotFound };
  }

  return { success: true, message: t.errors.charDeleted.replace('{name}', deleted.name) };
}
