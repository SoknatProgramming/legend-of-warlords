'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { ROUTES, isAuthRoute } from '@/app/lib/constants/routes';

/**
 * Route-aware hook for navigation and conditional UI.
 */
export function useAppRoute() {
  const pathname = usePathname();

  return useMemo(
    () => ({
      pathname: pathname ?? ROUTES.HOME,
      isHome: pathname === ROUTES.HOME,
      isLogin: pathname === ROUTES.LOGIN,
      isRegister: pathname === ROUTES.REGISTER,
      isDashboard: pathname === ROUTES.DASHBOARD,
      isAuthRoute: isAuthRoute(pathname ?? ''),
      routes: ROUTES,
    }),
    [pathname]
  );
}
