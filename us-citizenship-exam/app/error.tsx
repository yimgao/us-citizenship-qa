"use client";
import { useEffect } from 'react';
import { errorReporter } from '@/shared/utils/errorReporting';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Report error with context
    errorReporter.reportError(error, {
      digest: error.digest,
      message: error.message,
      stack: error.stack,
      name: error.name,
      location: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <html>
      <body className="mx-auto max-w-2xl p-6">
        <h2 className="mb-2 text-2xl font-bold text-red-600">Something went wrong</h2>
        <p className="mb-6 text-slate-700">Please try again. If the issue persists, refresh the page.</p>
        <button onClick={() => reset()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Try again</button>
      </body>
    </html>
  );
}


