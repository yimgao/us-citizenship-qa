'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useTTS } from '@/lib/useTTS';
import type { Locale } from '@/lib/questions';
import type { GrammarRule, GrammarExample } from '@/lib/grammar';

export default function GrammarViewer({
  rules,
  locale,
}: {
  rules: GrammarRule[];
  locale: Locale;
}) {
  const t = useTranslations('grammar');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { speak, stop, state } = useTTS(locale);

  const current = rules[currentIndex] ?? null;
  const total = rules.length;

  const goPrev = useCallback(() => {
    stop();
    setCurrentIndex((i) => (i > 0 ? i - 1 : total - 1));
  }, [total, stop]);

  const goNext = useCallback(() => {
    stop();
    setCurrentIndex((i) => (i < total - 1 ? i + 1 : 0));
  }, [total, stop]);

  const speakText = useCallback(
    (text: string) => {
      if (state === 'speaking') {
        stop();
      } else {
        speak(text);
      }
    },
    [speak, stop, state]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext]);

  if (!current || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-body text-muted-foreground">{t('noRules')}</p>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-alt">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Rule count */}
      <p className="text-body-sm font-bold text-muted-foreground">
        {t('ruleCount', { current: currentIndex + 1, total })}
      </p>

      {/* Rule card */}
      <div className="w-full rounded-2xl border-2 border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Title */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-title font-bold text-fg">{current.title[locale]}</h2>
          <button
            onClick={() => speakText(current.title[locale])}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary-bg hover:text-primary"
            aria-label={state === 'speaking' ? t('stopSpeaking') : t('speak')}
          >
            {state === 'speaking' ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Explanation */}
        <div className="mb-6">
          <h3 className="mb-2 text-body font-bold text-primary">{t('explanation')}</h3>
          <p className="text-body text-fg">{current.explanation[locale]}</p>
        </div>

        {/* Examples */}
        {current.examples && current.examples.length > 0 && (
          <div>
            <h3 className="mb-3 text-body font-bold text-primary">{t('examples')}</h3>
            <div className="flex flex-col gap-3">
              {current.examples.map((ex: GrammarExample, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-bg-alt p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-body font-semibold text-fg">
                      {ex.highlight ? (
                        <>
                          {ex.sentence.split(ex.highlight).map((part, i) => (
                            <span key={i}>
                              {i > 0 && (
                                <span className="rounded bg-primary-bg px-1 font-bold text-primary">
                                  {ex.highlight}
                                </span>
                              )}
                              {part}
                            </span>
                          ))}
                        </>
                      ) : (
                        ex.sentence
                      )}
                    </p>
                    <button
                      onClick={() => speakText(ex.sentence)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-fg"
                      aria-label={t('speak')}
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                  {ex.translation && (
                    <p className="mt-1 text-body-sm text-muted-foreground">
                      {ex.translation[locale]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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

        <span className="text-body-sm font-bold text-muted-foreground">
          {t('ruleCount', { current: currentIndex + 1, total })}
        </span>

        <button
          onClick={goNext}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-fg transition-colors hover:border-primary hover:bg-primary-bg"
          aria-label={t('next')}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
