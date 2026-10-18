import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import {
  BenchmarkResults,
  fetchLatestEvalReport,
} from '@/components/benchmark/BenchmarkResults';

export const metadata: Metadata = {
  title: 'Evaluation results',
  description: 'Latest security analysis evaluation results and measurement notes.',
  alternates: { canonical: '/benchmark' },
};

function generatedAtLabel(value?: string): string {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

export default async function BenchmarkPage() {
  const report = await fetchLatestEvalReport();

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl space-y-6">
        <header className="border-b border-surface-border pb-4">
          <h1 className="text-xl font-semibold text-fg-primary">Evaluation results</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Latest run: {generatedAtLabel(report.generated_at)}
            {report._stale ? ' · Showing the saved report because the latest result is unavailable.' : ''}
          </p>
        </header>

        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className="mb-3 text-sm font-medium text-fg-primary">
            Current results
          </h2>
          <BenchmarkResults report={report} />
        </section>

        <section className="max-w-3xl border border-surface-border bg-surface-raised p-4">
          <h2 className="text-sm font-medium text-fg-primary">Measurement notes</h2>
          <p className="mt-2 text-sm leading-6 text-fg-muted">
            The fixed incident and alert datasets are synthetic. Alert reduction measures deterministic grouping logic on a generated stream. The MITRE, investigation completeness, and response quality checks are substrate consistency gates; they do not measure live agent accuracy.
          </p>
        </section>
      </main>
    </AppShell>
  );
}
