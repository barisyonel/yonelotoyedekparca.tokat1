'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const CenterLogoNavbar = dynamic(() => import('./CenterLogoNavbar'), { ssr: true });
const Footer = dynamic(() => import('./Footer'), { ssr: true });
const WhatsAppFloatButton = dynamic(() => import('./WhatsAppFloatButton'), { ssr: false });

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminOrAuth = pathname.startsWith('/admin') || pathname.startsWith('/auth');
  const isOrganicSEO = pathname === '/organic-seo';

  if (isAdminOrAuth || isOrganicSEO) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <div className="pt-[30px] lg:pt-0" suppressHydrationWarning>
      <CenterLogoNavbar />
      {children}
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
}
