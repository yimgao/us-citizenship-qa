'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'quiz', href: '/quiz' },
  { key: 'flashcards', href: '/flashcards' },
  { key: 'grammar', href: '/grammar' },
  { key: 'glossary', href: '/glossary' },
  { key: 'case-status', href: '/case-status' },
  { key: 'resources', href: '/resources' },
] as const;

export default function Navbar() {
  const t = useTranslations('navbar');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const locale = pathname.split('/')[1] || 'en';

  const isActive = (href: string) => {
    if (href === '/') return pathname === `/${locale}`;
    return pathname.startsWith(`/${locale}${href}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-primary bg-white">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-fg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-fg">
            C
          </span>
          <span className="hidden text-sm sm:inline">{t('title')}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}${link.href}`}
              className={`rounded-xl px-3 py-1.5 text-sm font-bold transition-colors ${
                isActive(link.href)
                  ? 'bg-primary-bg text-primary'
                  : 'text-fg hover:bg-bg-alt'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-border text-fg md:hidden"
            aria-label={open ? 'Close' : 'Menu'}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t-2 border-border bg-white md:hidden">
          <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary-bg text-primary'
                    : 'text-fg hover:bg-bg-alt'
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
