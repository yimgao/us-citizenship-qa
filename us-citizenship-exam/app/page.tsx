import Link from 'next/link';

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-fg">
        C
      </div>
      <h1 className="text-display font-bold tracking-tight text-fg">Citizenship Prep</h1>
      <p className="text-body-lg text-muted-foreground">Select your language</p>
      <div className="flex w-full flex-col gap-3">
        <Link
          href="/en"
          className="flex h-12 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-fg shadow-sm transition-all hover:brightness-105 active:scale-[0.97]"
        >
          English
        </Link>
        <Link
          href="/es"
          className="flex h-12 items-center justify-center rounded-xl border-2 border-border bg-card text-base font-bold text-fg transition-all hover:bg-bg-alt active:scale-[0.97]"
        >
          Español
        </Link>
        <Link
          href="/zh"
          className="flex h-12 items-center justify-center rounded-xl border-2 border-border bg-card text-base font-bold text-fg transition-all hover:bg-bg-alt active:scale-[0.97]"
        >
          中文
        </Link>
      </div>
    </div>
  );
}
