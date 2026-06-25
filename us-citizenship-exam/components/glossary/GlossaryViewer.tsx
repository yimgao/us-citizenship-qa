'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, RotateCw } from 'lucide-react';
import { useTTS } from '@/lib/useTTS';
import type { Locale } from '@/lib/questions';

export type GlossaryItem = {
  id: string;
  term: { en: string; zh: string; es: string };
  definitions: { en: string; zh: string; es: string };
};

export default function GlossaryViewer({
  items,
  locale,
}: {
  items: GlossaryItem[];
  locale: Locale;
}) {
  const t = useTranslations('glossary');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { speak, stop, state } = useTTS(locale);
  const speaking = state === 'speaking';

  const current = items[currentIndex] ?? null;
  const total = items.length;

  const goPrev = useCallback(() => {
    setFlipped(false);
    stop();
    setCurrentIndex((i) => (i > 0 ? i - 1 : total - 1));
  }, [total, stop]);

  const goNext = useCallback(() => {
    setFlipped(false);
    stop();
    setCurrentIndex((i) => (i < total - 1 ? i + 1 : 0));
  }, [total, stop]);

  const toggleFlip = useCallback(() => {
    stop();
    setFlipped((f) => !f);
  }, [stop]);

  const speakText = useCallback(
    (text: string, lang: Locale) => {
      if (speaking) {
        stop();
      } else {
        speak(text);
      }
    },
    [speak, stop, speaking]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleFlip();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlip, goPrev, goNext]);

  if (!current || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-body text-muted-foreground">{t('noItems')}</p>
      </div>
    );
  }

  const LANGUAGES: { key: Locale; label: string }[] = [
    { key: 'en', label: 'English' },
    { key: 'zh', label: '中文' },
    { key: 'es', label: 'Español' },
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Card count */}
      <p className="text-body-sm font-bold text-muted-foreground">
        {t('itemCount', { current: currentIndex + 1, total })}
      </p>

      {/* Flip card */}
      <div
        onClick={toggleFlip}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(); } }}
        role="button"
        tabIndex={0}
        className="group relative h-80 w-full cursor-pointer perspective-[1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
        aria-label={flipped ? t('clickToFlipBack') : t('clickToFlip')}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Front — term */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-border bg-card p-8 shadow-sm backface-hidden">
            <span className="rounded-full bg-primary-bg px-3 py-1 text-caption font-bold uppercase text-primary">
              {t('term')}
            </span>
            <div className="flex flex-col items-center gap-3">
              {LANGUAGES.map((lang) => (
                <div key={lang.key} className="flex items-center gap-2">
                  <span className="text-caption font-semibold uppercase text-muted-foreground">
                    {lang.key}
                  </span>
                  <span className="text-title font-bold text-fg">
                    {current.term[lang.key]}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(current.term[lang.key], lang.key);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-bg-alt hover:text-fg"
                    aria-label={t('speak')}
                  >
                    {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-caption text-muted-foreground">{t('clickToFlip')}</p>
          </div>

          {/* Back — definitions */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-primary bg-card p-8 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="rounded-full bg-primary-bg px-3 py-1 text-caption font-bold uppercase text-primary">
              {t('definitions')}
            </span>
            <div className="flex w-full flex-col gap-3">
              {LANGUAGES.map((lang) => (
                <div key={lang.key} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded bg-bg-alt px-1.5 py-0.5 text-caption font-bold uppercase text-muted-foreground">
                    {lang.key}
                  </span>
                  <p className="text-body-sm text-fg">{current.definitions[lang.key]}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(current.definitions[lang.key], lang.key);
                    }}
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-bg-alt hover:text-fg"
                    aria-label={t('speak')}
                  >
                    {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-caption text-muted-foreground">{t('clickToFlipBack')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-fg transition-colors hover:border-primary hover:bg-primary-bg"
          aria-label={t('previous')}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={toggleFlip}
          className="flex h-10 items-center gap-2 rounded-xl border-2 border-border bg-card px-4 text-sm font-bold text-fg transition-colors hover:border-primary hover:bg-primary-bg"
          aria-label={flipped ? t('clickToFlipBack') : t('clickToFlip')}
        >
          <RotateCw size={16} />
          {flipped ? t('clickToFlipBack') : t('clickToFlip')}
        </button>

        <button
          onClick={goNext}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-fg transition-colors hover:border-primary hover:bg-primary-bg"
          aria-label={t('next')}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Tip */}
      <p className="text-caption text-muted-foreground">{t('tip')}</p>
    </div>
  );
}
