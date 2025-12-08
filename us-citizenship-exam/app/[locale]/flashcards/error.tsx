'use client';

import { useEffect } from 'react';
import { errorReporter } from '@/shared/utils/errorReporting';
import { Button } from '@/shared/ui/button';

export default function FlashcardsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    errorReporter.reportError(error, {
      component: 'FlashcardsPage',
      digest: error.digest,
      message: error.message,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-primary">Something went wrong</h2>
        <p className="mb-6 text-secondary">
          We encountered an error while loading the flashcards. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Go to home
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-secondary">Error details</summary>
            <pre className="mt-2 overflow-auto rounded bg-slate-100 p-4 text-xs">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
