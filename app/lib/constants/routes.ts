/**
 * Route paths — single source of truth for navigation.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SECURITY: '/dashboard/security',
} as const;

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;
export const PUBLIC_ROUTES = [ROUTES.HOME, ...AUTH_ROUTES] as const;

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
