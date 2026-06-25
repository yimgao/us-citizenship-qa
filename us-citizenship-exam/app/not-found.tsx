import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-hero font-bold text-primary">404</div>
      <p className="text-body-lg text-muted-foreground">Page not found</p>
      <Link
        href="/en"
        className="mt-4 flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-primary-fg transition-all hover:brightness-105"
      >
        Go Home
      </Link>
    </div>
  );
}
