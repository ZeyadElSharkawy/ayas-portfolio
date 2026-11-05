import type { Metadata, Viewport } from 'next';
import { Amiri, Montserrat, Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';
import { SiteFooter, SiteHeader } from '@/components/site/Chrome';
import { openGraphBase, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';
import './globals.css';

const display = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

// Fontspring demo cuts, for evaluation: they watermark the digit 4 and most symbols, so unicode-range keeps
// them to their clean characters and the rest fall through to Montserrat. See assets/fonts/proxima-nova/README.md.
const sans = localFont({
  variable: '--font-proxima',
  src: [
    { path: '../assets/fonts/proxima-nova/proxima-nova-regular.otf', weight: '400' },
    { path: '../assets/fonts/proxima-nova/proxima-nova-medium.otf', weight: '500' },
    { path: '../assets/fonts/proxima-nova/proxima-nova-semibold.otf', weight: '600' },
    { path: '../assets/fonts/proxima-nova/proxima-nova-bold.otf', weight: '700' },
  ],
  declarations: [{ prop: 'unicode-range', value: 'U+20, U+2C, U+2E, U+30-33, U+35-3B, U+3F, U+41-5A, U+61-7A' }],
});

// Supplies everything the demo cuts can't: the digit 4, symbols, curly quotes, dashes, arrows, accents.
const sansFallback = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  preload: false,
});

const arabic = Amiri({
  variable: '--font-amiri',
  subsets: ['arabic'],
  weight: ['400', '700'],
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
  openGraph: { ...openGraphBase, title: SITE_TITLE, description: SITE_DESCRIPTION, url: '/' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#f4e2cc',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${sansFallback.variable} ${arabic.variable}`}>
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
