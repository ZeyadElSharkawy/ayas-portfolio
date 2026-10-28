import type { Metadata, Viewport } from 'next';
import { Alexandria, Fraunces, Instrument_Sans } from 'next/font/google';
import { NeedleCursor } from '@/components/cursor/NeedleCursor';
import { SoundLinks } from '@/components/site/Sound';
import { openGraphBase, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  style: ['normal', 'italic'],
});

const instrument = Instrument_Sans({
  variable: '--font-instrument',
  subsets: ['latin'],
});

const alexandria = Alexandria({
  variable: '--font-alexandria',
  subsets: ['arabic', 'latin'],
  // Arabic appears in titles and quotes, rarely first on screen: load it when used, not up front.
  preload: false,
});

export const metadata: Metadata = {
  // Absolute base for canonical and Open Graph URLs: set SITE_URL once the domain is decided.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s · Aya Hafez',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'Aya Hafez', url: SITE_URL }],
  creator: 'Aya Hafez',
  keywords: ['Aya Hafez', 'fashion designer', 'fashion design portfolio', 'CLO3D', 'digital fashion', 'fashion styling', 'Cairo', 'Berlin', 'machine embroidery'],
  alternates: { canonical: '/' },
  openGraph: { ...openGraphBase, title: SITE_TITLE, description: SITE_DESCRIPTION, url: '/' },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#F4E2CC',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable} ${alexandria.variable} h-full`}>
      <body className="min-h-full">
        {children}
        <NeedleCursor />
        <SoundLinks />
      </body>
    </html>
  );
}
