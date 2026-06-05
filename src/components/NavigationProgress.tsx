'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-transparent"
      role="progressbar"
      aria-hidden
    >
      <div className="nav-progress-bar h-full bg-primary" />
    </div>
  );
}
