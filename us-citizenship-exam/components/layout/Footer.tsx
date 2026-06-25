'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const FOOTER_LINKS = [
  { key: 'quiz', href: '/quiz' },
  { key: 'flashcards', href: '/flashcards' },
  { key: 'grammar', href: '/grammar' },
  { key: 'glossary', href: '/glossary' },
  { key: 'case-status', href: '/case-status' },
  { key: 'resources', href: '/resources' },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')?.[1] || 'en') as 'en' | 'es' | 'zh';
  const t = useTranslations('navbar');
  const footerT = useTranslations('footer');

  return (
    <footer className="mt-12 border-t border-border bg-bg-alt">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-fg">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-fg">
                C
              </span>
              {t('title')}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">{footerT('text')}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {footerT('links')}
            </h4>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={`/${locale}${link.href}`}
                  className="transition-colors hover:text-fg"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Built with */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {footerT('builtWith')}
            </h4>
            <p className="text-sm text-muted-foreground">
              Next.js · Geist · Tailwind · 💚
            </p>
            <a
              href="https://buymeacoffee.com/yimgao"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-warning px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.97]"
            >
              <span>☕</span>
              Buy me a coffee
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Citizenship Prep
        </div>
      </div>
    </footer>
  );
}
