import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth';
import SiteHeader from '@/app/components/SiteHeader';
import { ROUTES } from '@/app/lib/constants/routes';

/**
 * Protected layout — validates session server-side.
 * All routes under (protected)/ require authentication.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <>
      <SiteHeader user={user} />
      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>
    </>
  );
}
