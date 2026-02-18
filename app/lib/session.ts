import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

/**
 * Session data stored in an encrypted httpOnly cookie.
 * iron-session handles encryption/decryption automatically.
 */
export interface SessionData {
  userId: string;
  email: string;
  username: string;
  isLoggedIn: boolean;
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'low_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Get the current session from the request cookies.
 * Use in Server Components, Server Actions, and Route Handlers.
 */
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
