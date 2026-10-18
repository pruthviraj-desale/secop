'use client';

import { isDemoMode, demoBannerMessage } from '@/lib/demoMode';

export function DemoBanner() {
  if (!isDemoMode()) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-60 right-0 z-50 flex h-9 items-center justify-center border-b border-amber-500/30 bg-amber-500/10 px-4 text-xs text-amber-200"
    >
      <span>{demoBannerMessage()}</span>
    </div>
  );
}
