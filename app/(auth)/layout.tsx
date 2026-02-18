import SiteHeader from '@/app/components/SiteHeader';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader showAuthButtons={false} />
      <main className="relative z-10 flex-1 flex items-center justify-center mt-8 sm:mt-10">
        {children}
      </main>
    </>
  );
}
