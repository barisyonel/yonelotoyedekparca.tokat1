'use client';

import { usePathname } from 'next/navigation';
import CenterLogoNavbar from './CenterLogoNavbar';
import Footer from './Footer';
import WhatsAppFloatButton from './WhatsAppFloatButton';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Admin, auth ve organic-seo sayfalarında Navbar, Footer ve WhatsApp gösterme
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

