'use client';

// Her name in the header. On the home page it goes back up to the hero, which a link to the page
// you're already on doesn't do by itself (and "Work" now lands on the list, further down).

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function HomeLink({ className, children }: { className?: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Link
      href="/"
      className={className}
      onClick={() => {
        if (pathname === '/') window.scrollTo({ top: 0 });
      }}
    >
      {children}
    </Link>
  );
}
