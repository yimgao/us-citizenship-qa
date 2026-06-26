'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, Target, Share2 } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useDailyProgress } from '@/lib/hooks/useDailyProgress';

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'quiz', href: '/quiz' },
  { key: 'flashcards', href: '/flashcards' },
  { key: 'grammar', href: '/grammar' },
  { key: 'glossary', href: '/glossary' },
  { key: 'case-status', href: '/case-status' },
  { key: 'study-guide', href: '/study-guide' },
  { key: 'resources', href: '/resources' },
] as const;

const spring = { type: 'spring' as const, stiffness: 400, damping: 25 };

export default function Navbar() {
  const t = useTranslations('navbar');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const locale = pathname.split('/')[1] || 'en';
  const { streak, daily, dailyGoal, isGoalMet, mounted } = useDailyProgress();
  const prefersReducedMotion = useReducedMotion();

  const isActive = (href: string) => {
    if (href === '/') return pathname === `/${locale}`;
    return pathname.startsWith(`/${locale}${href}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'Citizenship Prep',
      text: 'Free U.S. citizenship practice at Citizenship Prep!',
      url,
    };
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share API failed — fallback to clipboard
      }
    }
    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(url);
      // Brief visual feedback could be added here
    } catch {
      // Clipboard not available
    }
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
            <motion.div
              key={link.key}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              transition={spring}
            >
              <Link
                href={`/${locale}${link.href}`}
                className={`rounded-xl px-3 py-1.5 text-sm font-bold transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary-bg text-primary'
                    : 'text-fg hover:bg-bg-alt'
                }`}
              >
                {t(link.key)}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Streak counter */}
          {mounted && (
            <div
              className="flex items-center gap-1 rounded-xl bg-warning-bg px-2.5 py-1 text-body-sm font-bold text-warning"
              title="Daily streak"
            >
              <span>🔥</span>
              <span>{streak.count}</span>
            </div>
          )}

          {/* Daily progress */}
          {mounted && (
            <div className="flex items-center gap-1.5 rounded-xl bg-primary-bg px-2.5 py-1.5 text-body-sm" title="Daily goal progress">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-primary/20">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isGoalMet ? 'bg-primary' : 'bg-primary/60'
                    }`}
                    style={{ width: `${Math.min(100, (daily.count / dailyGoal) * 100)}%` }}
                  />
                </div>
                <span className="text-caption font-semibold text-primary">
                  {daily.count}/{dailyGoal}
                </span>
              </div>
              <Target className={`h-3.5 w-3.5 ${isGoalMet ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
          )}

          {/* Share button */}
          <motion.button
            onClick={handleShare}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-border text-fg transition-colors hover:border-primary hover:text-primary"
            aria-label={t('share')}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
            transition={spring}
          >
            <Share2 size={16} />
          </motion.button>

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
