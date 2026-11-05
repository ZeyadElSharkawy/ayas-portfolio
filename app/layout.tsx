import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif, Noto_Naskh_Arabic } from 'next/font/google';
import { SiteFooter, SiteHeader } from '@/components/site/Chrome';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';
import './globals.css';

const serif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

const sans = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const naskh = Noto_Naskh_Arabic({
  variable: '--font-naskh',
  subsets: ['arabic'],
  // Arabic appears only in a few titles and quotes: load it when used, not up front.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: '%s · Aya Hafez' },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'Aya Hafez' }],
  alternates: { canonical: '/' },
  openGraph: { siteName: SITE_NAME, locale: 'en_GB', type: 'website', title: SITE_TITLE, description: SITE_DESCRIPTION, url: '/' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#f5f2ec',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${naskh.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
