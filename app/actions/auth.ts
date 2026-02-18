'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/app/lib/db';
import { getSession } from '@/app/lib/session';
import { cookies } from 'next/headers';
import { getT } from '@/app/lib/i18n';
import { getLocaleFromCookies } from '@/app/lib/i18n/server';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthActionResult,
  SessionUser,
} from '@/app/lib/types/auth';

const MIN_PASSWORD_LENGTH = 8;

// ── Get current user (for server components / layouts) ─────────────────

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) return null;
  return {
    userId: session.userId,
    email: session.email,
    username: session.username,
  };
}

// ── Login ──────────────────────────────────────────────────────────────

export async function loginAction(
  credentials: LoginCredentials,
): Promise<AuthActionResult> {
  const locale = await getLocaleFromCookies();
  const t = getT(locale);

  const email = credentials.email?.trim();
  const password = credentials.password;

  if (!email || !password) {
    return { success: false, error: t.errors.emailPasswordRequired };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: t.errors.invalidCredentials };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { success: false, error: t.errors.invalidCredentials };
  }

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.username = user.username;
  session.isLoggedIn = true;
  await session.save();

  return {
    success: true,
    user: { id: user.id, email: user.email, username: user.username },
  };
}

// ── Register ───────────────────────────────────────────────────────────

export async function registerAction(
  credentials: RegisterCredentials,
): Promise<AuthActionResult> {
  const locale = await getLocaleFromCookies();
  const t = getT(locale);

  const username = credentials.username?.trim();
  const email = credentials.email?.trim();
  const password = credentials.password;

  if (!username || !email || !password) {
    return { success: false, error: t.errors.allFieldsRequired };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { success: false, error: t.errors.passwordMin8 };
  }

  const existing = await db.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    const error = existing.email === email ? t.errors.emailTaken : t.errors.usernameTaken;
    return { success: false, error };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: { email, username, password: hashedPassword },
  });

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.username = user.username;
  session.isLoggedIn = true;
  await session.save();

  return {
    success: true,
    user: { id: user.id, email: user.email, username: user.username },
  };
}

// ── Logout ─────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<{ success: boolean }> {
  const session = await getSession();
  session.destroy();

  const cookieStore = await cookies();
  cookieStore.delete('low_session');

  return { success: true };
}
