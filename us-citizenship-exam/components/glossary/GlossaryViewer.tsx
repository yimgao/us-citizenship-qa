'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, RotateCw, Search } from 'lucide-react';
import { useTTS } from '@/lib/useTTS';
import type { Locale } from '@/lib/questions';

export type GlossaryItem = {
  id: string;
  term: { en: string; zh: string; es: string };
  definitions: { en: string; zh: string; es: string };
};

function shuffleArray<T>(items: T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function GlossaryViewer({
  items,
  locale,
}: {
  items: GlossaryItem[];
  locale: Locale;
}) {
  const t = useTranslations('glossary');
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { speak, stop, state } = useTTS(locale);
  const speaking = state === 'speaking';

  // Filter items by search query (for browse mode)
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item => {
      return (
        item.term.en.toLowerCase().includes(q) ||
        item.term.zh.toLowerCase().includes(q) ||
        item.term.es.toLowerCase().includes(q) ||
        item.definitions.en.toLowerCase().includes(q) ||
        item.definitions.zh.toLowerCase().includes(q) ||
        item.definitions.es.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

  const current = filteredItems[currentIndex] ?? null;
  const total = filteredItems.length;

  // ---- Browse mode navigation ----
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

  // Reset index when search query changes
  useEffect(() => {
    setCurrentIndex(0);
    setFlipped(false);
    stop();
  }, [searchQuery, stop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (mode !== 'browse') return;
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
  }, [toggleFlip, goPrev, goNext, mode]);

  // ---- Quiz mode state ----
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  // Shuffle quiz items once
  const quizItems = useMemo(() => shuffleArray(items), [items]);

  // Generate quiz options for current item
  const currentQuizItem = quizItems[quizIndex];
  const quizOptions = useMemo(() => {
    if (!currentQuizItem) return [];
    // The correct answer is the term in the user's locale
    const correctTranslation = currentQuizItem.term[locale === 'en' ? 'zh' : locale];
    // Pick 3 other items for wrong answers
    const others = items
      .filter(i => i.id !== currentQuizItem.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(i => i.term[locale === 'en' ? 'zh' : locale]);
    const options = shuffleArray([correctTranslation, ...others]);
    return options;
  }, [currentQuizItem, items, locale]);

  const handleQuizAnswer = (optionIndex: number) => {
    if (answered) return;
    setSelectedAnswer(optionIndex);
    setAnswered(true);
    if (currentQuizItem) {
      const correctTranslation = currentQuizItem.term[locale === 'en' ? 'zh' : locale];
      if (quizOptions[optionIndex] === correctTranslation) {
        setQuizScore(s => s + 1);
      }
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < quizItems.length - 1) {
      setQuizIndex(i => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleTryAgain = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  // ---- Language list for browse mode ----
  const LANGUAGES: { key: Locale; label: string }[] = [
    { key: 'en', label: 'English' },
    { key: 'zh', label: '中文' },
    { key: 'es', label: 'Español' },
  ];

  // ---- Pill toggle ----
  const modePills = (
    <div className="flex rounded-xl border-2 border-border bg-white p-1">
      <button
        onClick={() => { setMode('browse'); setSearchQuery(''); setQuizComplete(false); }}
        className={`rounded-lg px-5 py-2 text-body-sm font-bold transition-colors ${
          mode === 'browse'
            ? 'bg-primary text-primary-fg'
            : 'text-fg hover:bg-bg-alt'
        }`}
      >
        {t('browse')}
      </button>
      <button
        onClick={() => { setMode('quiz'); setSearchQuery(''); }}
        className={`rounded-lg px-5 py-2 text-body-sm font-bold transition-colors ${
          mode === 'quiz'
            ? 'bg-primary text-primary-fg'
            : 'text-fg hover:bg-bg-alt'
        }`}
      >
        {t('quiz')}
      </button>
    </div>
  );

  // ---- Search bar ----
  const searchBar = (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full border-2 border-border rounded-2xl bg-white p-3 pl-10 text-body text-fg placeholder:text-muted-foreground placeholder:font-bold focus:outline-none focus:border-primary transition-colors"
        aria-label={t('search')}
      />
    </div>
  );

  // ---- Browse mode ----
  if (mode === 'browse') {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
        {/* Search bar */}
        {searchBar}

        {/* Mode pills */}
        {modePills}

        {/* No results */}
        {filteredItems.length === 0 && searchQuery.trim() !== '' && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-body text-muted-foreground">{t('noResults')}</p>
          </div>
        )}

        {filteredItems.length > 0 && !current && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-body text-muted-foreground">{t('noItems')}</p>
          </div>
        )}

        {current && (
          <>
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
          </>
        )}
      </div>
    );
  }

  // ---- Quiz mode ----
  if (quizComplete) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
        {modePills}
        <div className="w-full rounded-2xl border-2 border-border bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Search className="h-8 w-8 text-primary-fg" strokeWidth={2.5} />
          </div>
          <h2 className="text-title font-bold text-fg mb-1">{t('quizComplete')}</h2>
          <p className="text-body text-fg mb-6">
            {t('quizScore', { correct: quizScore, total: quizItems.length })}
          </p>
          <div className="mb-6">
            <div className="h-3 w-full overflow-hidden rounded-full bg-bg-alt">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${quizItems.length > 0 ? Math.round((quizScore / quizItems.length) * 100) : 0}%` }}
              />
            </div>
          </div>
          <button
            onClick={handleTryAgain}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-body-sm font-semibold text-primary-fg transition-colors hover:brightness-110"
          >
            <RotateCw className="h-4 w-4" />
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuizItem) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
        {modePills}
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-body text-muted-foreground">{t('noItems')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Mode pills */}
      {modePills}

      {/* Quiz progress */}
      <p className="text-body-sm font-bold text-muted-foreground">
        {quizIndex + 1} / {quizItems.length}
      </p>

      {/* Question card */}
      <div className="w-full rounded-2xl border-2 border-border bg-white p-8 text-center">
        <p className="text-caption font-semibold text-primary uppercase tracking-wide mb-2">
          {t('quizQuestion')}
        </p>
        <h3 className="text-title font-bold text-fg mb-6">
          {currentQuizItem.term.en}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {quizOptions.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = option === currentQuizItem.term[locale === 'en' ? 'zh' : locale];
            let optClasses = 'border-2 rounded-xl p-4 text-left text-body text-fg transition-all cursor-pointer flex items-center gap-3 w-full';

            if (answered) {
              if (isCorrect) {
                optClasses += ' border-primary bg-primary-bg';
              } else if (isSelected && !isCorrect) {
                optClasses += ' border-danger bg-danger-bg';
              } else {
                optClasses += ' border-border opacity-50';
              }
            } else {
              optClasses += ' border-border hover:border-primary hover:bg-primary-bg/30';
            }

            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                onClick={() => handleQuizAnswer(idx)}
                disabled={answered}
                className={optClasses}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-body-sm font-bold ${
                    answered
                      ? isCorrect
                        ? 'bg-primary text-primary-fg'
                        : isSelected
                          ? 'bg-danger text-primary-fg'
                          : 'bg-bg-alt text-muted-foreground'
                      : isSelected
                        ? 'bg-primary text-primary-fg'
                        : 'bg-bg-alt text-fg'
                  }`}
                >
                  {answered
                    ? isCorrect
                      ? <ChevronRight className="h-4 w-4" />
                      : isSelected
                        ? <ChevronLeft className="h-4 w-4" />
                        : letter
                    : letter
                  }
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next/Continue button */}
      <button
        onClick={handleNextQuiz}
        disabled={!answered}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-body-sm font-semibold text-primary-fg transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {quizIndex < quizItems.length - 1 ? t('next') : t('quizComplete')}
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Score so far */}
      <p className="text-body-sm text-muted-foreground">
        {t('quizScore', { correct: quizScore, total: quizIndex + (answered ? 1 : 0) })}
      </p>
    </div>
  );
}
