"use client";
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { BookOpen, FileText, Menu, Link as LinkIcon, GraduationCap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Navbar({ locale }: { locale: 'en'|'es'|'zh' }) {
  const t = useTranslations('navbar');
  const pathname = usePathname();
  const isQuiz = pathname?.includes('/quiz');
  const isFlashcards = pathname?.includes('/flashcards');
  const isGlossary = pathname?.includes('/glossary');
  const isGrammar = pathname?.includes('/grammar');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstFocusable = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    const body = document.body;
    if (open) {
      const prev = body.style.overflow;
      body.style.overflow = 'hidden';
      return () => { body.style.overflow = prev; };
    }
  }, [open]);
  useEffect(() => {
    if (open) firstFocusable.current?.focus();
  }, [open]);

  return (
    <header className="sticky top-0 z-50 glass-navbar modern-shadow safe-area-inset-x overflow-hidden" style={{ paddingTop: 'max(0px, env(safe-area-inset-top))' }}>
      <div className="relative mx-auto flex h-14 sm:h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Logo/Title - Mobile centered, Desktop left */}
        <a 
          href={`/${locale}`} 
          className="absolute left-1/2 -translate-x-1/2 text-center text-body-lg font-bold text-primary smooth-hover hover:opacity-80 md:static md:translate-x-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-none"
        >
          {t('title')}
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:gap-2 md:flex">
          <a 
            href={`/${locale}`} 
            className={`flex items-center gap-1.5 lg:gap-2 rounded-lg px-3 lg:px-4 py-2 text-body font-medium smooth-hover transition-all ${
              pathname === `/${locale}` || pathname === `/${locale}/`
                ? 'active-link bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                : 'text-foreground/70 hover:bg-slate-100 hover:text-primary'
            }`}
          >
            {t('home')}
          </a>
          <a 
            href={`/${locale}/quiz`} 
            className={`flex items-center gap-1.5 lg:gap-2 rounded-lg px-3 lg:px-4 py-2 text-body font-medium smooth-hover transition-all ${
              isQuiz
                ? 'active-link bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                : 'text-foreground/70 hover:bg-slate-100 hover:text-primary'
            }`}
          >
            <FileText className="h-4 w-4" />
            {t('quiz')}
          </a>
          <a 
            href={`/${locale}/flashcards`} 
            className={`flex items-center gap-1.5 lg:gap-2 rounded-lg px-3 lg:px-4 py-2 text-body font-medium smooth-hover transition-all ${
              isFlashcards
                ? 'active-link bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                : 'text-foreground/70 hover:bg-slate-100 hover:text-primary'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {t('flashcards')}
          </a>
          <a 
            href={`/${locale}/glossary`} 
            className={`flex items-center gap-1.5 lg:gap-2 rounded-lg px-3 lg:px-4 py-2 text-body font-medium smooth-hover transition-all ${
              isGlossary
                ? 'active-link bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                : 'text-foreground/70 hover:bg-slate-100 hover:text-primary'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {t('glossary')}
          </a>
          <a 
            href={`/${locale}/grammar`} 
            className={`flex items-center gap-1.5 lg:gap-2 rounded-lg px-3 lg:px-4 py-2 text-body font-medium smooth-hover transition-all ${
              isGrammar
                ? 'active-link bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                : 'text-foreground/70 hover:bg-slate-100 hover:text-primary'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            {t('grammar')}
          </a>
          <a 
            href={`/${locale}/resources`} 
            className="flex items-center gap-1.5 lg:gap-2 rounded-lg px-3 lg:px-4 py-2 text-body font-medium text-foreground/70 smooth-hover hover:bg-slate-100 hover:text-primary"
          >
            <LinkIcon className="h-4 w-4" />
            {t('resources')}
          </a>
          <LanguageSwitcher currentLocale={locale} />
        </nav>
        
        {/* Mobile hamburger button */}
        <button 
          aria-label="Menu" 
          aria-controls="mobile-menu" 
          aria-expanded={open} 
          onClick={() => setOpen(v => !v)} 
          className="ml-auto touch-target inline-flex items-center justify-center rounded-lg p-2 text-foreground/70 smooth-hover active:bg-slate-200 hover:bg-slate-100 md:hidden touch-action-manipulation"
        >
          <Menu className="h-6 w-6" />
        </button>
        {open && (
          <>
            {/* Backdrop with blur */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden animate-fade-in"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            {/* Mobile Menu - Slide in from right */}
            <div
              id="mobile-menu"
              role="menu"
              ref={menuRef}
              className="fixed right-0 top-0 h-full w-[85vw] max-w-sm glass-card modern-shadow-xl z-50 md:hidden page-transition"
              style={{ 
                animation: 'slideInRight 0.3s ease-out',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setOpen(false);
                }
                if (e.key === 'Tab' && menuRef.current) {
                  const focusables = menuRef.current.querySelectorAll<HTMLElement>('a,button,[tabindex]:not([tabindex="-1"])');
                  if (focusables.length === 0) return;
                  const first = focusables[0];
                  const last = focusables[focusables.length - 1];
                  if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    (first as HTMLElement).focus();
                  } else if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    (last as HTMLElement).focus();
                  }
                }
              }}
            >
              <div className="flex flex-col h-full p-4 pt-20">
                <a 
                  href={`/${locale}`} 
                  className={`touch-target flex items-center gap-3 rounded-xl px-4 py-3.5 text-body-lg font-medium smooth-hover mb-2 ${
                    pathname === `/${locale}` || pathname === `/${locale}/`
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                      : 'active:bg-slate-100 hover:bg-slate-50 text-primary'
                  } touch-action-manipulation`} 
                  onClick={() => setOpen(false)}
                >
                  {t('home')}
                </a>
                <a 
                  ref={firstFocusable} 
                  href={`/${locale}/quiz`} 
                  className={`touch-target flex items-center gap-3 rounded-xl px-4 py-3.5 text-body-lg font-medium smooth-hover mb-2 ${
                    isQuiz 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                      : 'active:bg-slate-100 hover:bg-slate-50 text-primary'
                  } touch-action-manipulation`} 
                  onClick={() => setOpen(false)}
                >
                  <FileText className="h-5 w-5" /> {t('quiz')}
                </a>
                <a 
                  href={`/${locale}/flashcards`} 
                  className={`touch-target flex items-center gap-3 rounded-xl px-4 py-3.5 text-body-lg font-medium smooth-hover mb-2 ${
                    isFlashcards 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                      : 'active:bg-slate-100 hover:bg-slate-50 text-primary'
                  } touch-action-manipulation`} 
                  onClick={() => setOpen(false)}
                >
                  <BookOpen className="h-5 w-5" /> {t('flashcards')}
                </a>
                <a 
                  href={`/${locale}/glossary`} 
                  className={`touch-target flex items-center gap-3 rounded-xl px-4 py-3.5 text-body-lg font-medium smooth-hover mb-2 ${
                    isGlossary 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                      : 'active:bg-slate-100 hover:bg-slate-50 text-primary'
                  } touch-action-manipulation`} 
                  onClick={() => setOpen(false)}
                >
                  <BookOpen className="h-5 w-5" /> {t('glossary')}
                </a>
                <a 
                  href={`/${locale}/grammar`} 
                  className={`touch-target flex items-center gap-3 rounded-xl px-4 py-3.5 text-body-lg font-medium smooth-hover mb-2 ${
                    isGrammar 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold modern-shadow'
                      : 'active:bg-slate-100 hover:bg-slate-50 text-primary'
                  } touch-action-manipulation`} 
                  onClick={() => setOpen(false)}
                >
                  <GraduationCap className="h-5 w-5" /> {t('grammar')}
                </a>
                <a 
                  href={`/${locale}/resources`} 
                  className="touch-target flex items-center gap-3 rounded-xl px-4 py-3.5 text-body-lg font-medium text-primary smooth-hover active:bg-slate-100 hover:bg-slate-50 mb-2 touch-action-manipulation" 
                  onClick={() => setOpen(false)}
                >
                  <LinkIcon className="h-5 w-5" /> {t('resources')}
                </a>
                <div className="mt-auto pt-4 border-t border-slate-200">
                  <LanguageSwitcher currentLocale={locale} />
                </div>
              </div>
            </div>
          </>
        )}
        {/* focus handled via useEffect above */}
      </div>
    </header>
  );
}


