'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-hero font-bold text-danger">Oops!</div>
        <p className="text-body-lg text-muted-foreground">Something went wrong</p>
        <button
          onClick={() => reset()}
          className="mt-4 flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-primary-fg transition-all hover:brightness-105"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
