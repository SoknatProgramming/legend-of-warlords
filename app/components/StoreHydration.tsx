'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/app/lib/store';

/**
 * Marks auth store as hydrated after client mount so persisted state is ready.
 * Prevents flash of wrong auth state during SSR/hydration.
 */
export default function StoreHydration() {
  useEffect(() => {
    useAuthStore.getState().setHydrated();
  }, []);
  return null;
}
