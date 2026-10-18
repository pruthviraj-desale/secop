'use client';

import { SWRConfig } from 'swr';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { ClientOnly } from '@/components/util/ClientOnly';
import { isDemoMode } from '@/lib/demoMode';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // The demo banner sits above the application header.
  const demo = isDemoMode();
  const topPadClass = demo ? 'pt-[100px]' : 'pt-16';

  return (
    // SWR v2 disables `revalidateOnMount` by default whenever `fallbackData`
    // is provided. Most views in the console pass `fallbackData: MOCK_*` so
    // that the page renders instantly with placeholder data, but the side
    // effect was that the real fetcher never ran — every page silently froze
    // on its mocks (e.g. /cases showed seeded `case-1000` rows even though
    // /api/v1/cases worked). Forcing both flags here makes mocks act as a
    // first-paint placeholder and the live fetch always run on mount.
    <SWRConfig value={{ revalidateOnMount: true, revalidateIfStale: true }}>
      <div className="min-h-screen bg-surface-base">
        {/* Demo mode is build-time configuration; render the banner after mount to avoid hydration mismatch. */}
        <ClientOnly>
          <DemoBanner />
        </ClientOnly>
        <Sidebar />
        <div className="md:ml-60">
          <TopBar demoOffset={demo} />
          <main className={`${topPadClass} min-h-screen`}>
            <div className="p-6">{children}</div>
          </main>
        </div>
        <ClientOnly>
          <CommandPalette />
        </ClientOnly>
      </div>
    </SWRConfig>
  );
}
