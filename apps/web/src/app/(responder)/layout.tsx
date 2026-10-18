import type { Metadata, Viewport } from 'next';
import { ResponderShell } from '@/components/responder/ResponderShell';

export const metadata: Metadata = {
  title: {
    default: 'Responder | SecOps',
    template: '%s | SecOps Responder',
  },
  description:
    'Mobile security operations for alert triage, action approvals, case management, and on-call response.',
};

export const viewport: Viewport = {
  themeColor: '#0a0d14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ResponderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResponderShell>{children}</ResponderShell>;
}
