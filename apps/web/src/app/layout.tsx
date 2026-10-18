import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { PwaBootstrap } from '@/components/pwa/PwaBootstrap';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { themeBootstrapScript } from '@/components/theme/themeScript';
import { getPublicSiteUrl } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  // Only load on demand — monospace font is used in code blocks, not every page,
  // so preloading eagerly causes "preloaded but unused" browser warnings.
  preload: false,
});

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'SecOps',
  title: {
    default: 'SecOps',
    template: '%s | SecOps',
  },
  description: 'Security operations console for alerts, investigations, detections, and response automation.',
  keywords: ['security operations', 'alert triage', 'incident response', 'detection engineering'],
  creator: 'SecOps',
  publisher: 'SecOps',
  category: 'cybersecurity',
  classification: 'Security Software',
  openGraph: {
    title: 'SecOps',
    description: 'Security operations console for alert triage, investigation, detections, and response automation.',
    type: 'website',
    siteName: 'SecOps',
    url: siteUrl,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecOps',
    description: 'Security operations console for alert triage, investigation, detections, and response automation.',
  },
  icons: {
    // Single SVG favicon — modern browsers (Chrome 80+, Safari 16+, Firefox 41+,
    // Edge) all support this. We intentionally do not advertise /favicon.ico
    // because we don't ship a binary .ico file; declaring one only produces
    // 404s in the browser network tab.
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icons/icon-192.svg', type: 'image/svg+xml' }],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'SecOps',
    statusBarStyle: 'black-translucent',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: '#0a0d14',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Default to `data-theme="dark"` for SSR so that the markup React sends
    // matches what the bootstrap script will write before hydration. The
    // bootstrap script (rendered first thing inside <body>) flips this to
    // light/system if the user previously chose so, before any pixels are
    // painted — that's why we don't see a flash.
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-surface-base text-fg-primary antialiased">
        <script
          // eslint-disable-next-line react/no-danger -- pre-hydration theme bootstrap
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        <PwaBootstrap />
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              // Toast styles read CSS variables so the toaster flips with
              // the rest of the chrome. `iconTheme` only takes hex values,
              // so we pin the brand semantic colors there.
              style: {
                background: 'var(--surface-raised)',
                color: 'var(--fg-primary)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#0a0d14' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#0a0d14' },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
