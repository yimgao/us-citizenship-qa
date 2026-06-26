'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Check, X, ArrowLeft, ArrowRight, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/lib/questions';
import type { GrammarExercise, ExerciseType } from '@/lib/grammar';

type ExerciseResult = {
  exerciseId: string;
  userAnswer: string;
  correct: boolean;
};

const STORAGE_KEY = 'grammar-practice-progress';

function loadProgress(): { results: ExerciseResult[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProgress(results: ExerciseResult[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ results }));
  } catch {
    // localStorage not available
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function GrammarPractice({
  exercises,
  locale,
}: {
  exercises: GrammarExercise[];
  locale: Locale;
}) {
  const t = useTranslations('grammar');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = exercises[currentIndex] ?? null;
  const total = exercises.length;

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.results.length > 0) {
      if (saved.results.length >= exercises.length) {
        // Previously completed
        setResults(saved.results);
        setCompleted(true);
        setShowResults(true);
      } else {
        setResults(saved.results);
        setCurrentIndex(saved.results.length);
      }
    }
  }, [exercises.length]);

  // Save progress when results change
  useEffect(() => {
    if (results.length > 0) {
      saveProgress(results);
    }
  }, [results]);

  const resetInput = useCallback(() => {
    setUserInput('');
    setSelectedOption(null);
    setChecked(false);
    setIsCorrect(false);
  }, []);

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      resetInput();
    } else {
      setCompleted(true);
      setShowResults(true);
    }
  }, [currentIndex, total, resetInput]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      // Restore previous result
      const prevResult = results[currentIndex - 1];
      if (prevResult) {
        setChecked(true);
        setIsCorrect(prevResult.correct);
      } else {
        resetInput();
      }
    }
  }, [currentIndex, results, resetInput]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Allow typing in input fields
        if (e.key === 'Enter' && !checked && current) {
          e.preventDefault();
          checkAnswer();
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (!checked && current) {
          checkAnswer();
        } else {
          goNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, currentIndex, goPrev, goNext]);

  const checkAnswer = useCallback(() => {
    if (!current) return;

    let userAnswer: string;
    let correct: boolean;

    switch (current.type) {
      case 'multiple-choice': {
        userAnswer = selectedOption?.toString() ?? '';
        correct = current.answer === selectedOption;
        break;
      }
      case 'fill-blank': {
        userAnswer = userInput.trim().toLowerCase();
        correct =
          userAnswer === (current.answer as string).toLowerCase() ||
          userAnswer === (current.answer as string).toLowerCase().replace(/^a |^an |^the /, '');
        break;
      }
      case 'sentence-reorder': {
        userAnswer = userInput.trim().toLowerCase();
        const expected = (current.answer as string).toLowerCase().replace(/[.!?]$/, '');
        correct = userAnswer === expected;
        break;
      }
      case 'correction': {
        userAnswer = userInput.trim().toLowerCase();
        const expected = (current.answer as string).toLowerCase().replace(/[.!?]$/, '');
        correct = userAnswer === expected;
        break;
      }
      default:
        userAnswer = '';
        correct = false;
    }

    setIsCorrect(correct);
    setChecked(true);

    const newResult: ExerciseResult = {
      exerciseId: current.id,
      userAnswer,
      correct,
    };

    setResults((prev) => {
      const existing = prev.findIndex((r) => r.exerciseId === current.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = newResult;
        return next;
      }
      return [...prev, newResult];
    });
  }, [current, selectedOption, userInput]);

  const handleTryAgain = useCallback(() => {
    setCurrentIndex(0);
    setResults([]);
    setShowResults(false);
    setCompleted(false);
    resetInput();
    clearProgress();
  }, [resetInput]);

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-alt">
          <span className="text-3xl">✍️</span>
        </div>
        <h3 className="text-body-lg font-bold text-fg mb-1">{t('noExercises')}</h3>
        <p className="text-body-sm text-muted-foreground max-w-xs">
          {t('noExercisesDesc') ?? 'No exercises available for this topic yet.'}
        </p>
      </div>
    );
  }

  if (completed || showResults) {
    const correctCount = results.filter((r) => r.correct).length;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 py-10">
        <div className="w-full rounded-2xl border-2 border-border bg-card p-8 text-center shadow-sm">
          <div className="mb-4 text-5xl">{percent >= 80 ? '🎉' : percent >= 50 ? '💪' : '📚'}</div>
          <h2 className="mb-2 text-display font-bold text-fg">{t('complete')}</h2>
          <p className="mb-6 text-body text-muted-foreground">
            {t('score', { correct: correctCount, total })}
          </p>

          {/* Score bar */}
          <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-bg-alt">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="mb-6 text-body-sm text-muted-foreground">
            {t('percent', { percent })}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleTryAgain}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-body font-bold text-primary-fg transition-colors hover:bg-primary/90"
            >
              <RefreshCw size={18} />
              {t('tryAgain')}
            </button>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-body font-bold text-fg transition-colors hover:bg-bg-alt"
            >
              <Home size={18} />
              {t('backHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
    'fill-blank': t('exerciseType.fill-blank'),
    'multiple-choice': t('exerciseType.multiple-choice'),
    'sentence-reorder': t('exerciseType.sentence-reorder'),
    'correction': t('exerciseType.correction'),
  };

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

      {/* Exercise count */}
      <p className="text-body-sm font-bold text-muted-foreground">
        {t('exerciseCount', { current: currentIndex + 1, total })}
      </p>

      {/* Exercise card */}
      <div className="w-full rounded-2xl border-2 border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Type badge */}
        <span className="mb-4 inline-block rounded-full bg-primary-bg px-3 py-1 text-caption font-bold uppercase text-primary">
          {EXERCISE_TYPE_LABELS[current.type]}
        </span>

        {/* Question */}
        <p className="mb-6 text-body font-semibold text-fg">
          {current.type === 'sentence-reorder'
            ? t('reorderInstructions')
            : current.type === 'correction'
              ? t('correctionInstructions')
              : current.question}
        </p>

        {current.type === 'sentence-reorder' && (
          <p className="mb-4 rounded-xl bg-bg-alt p-3 text-body text-fg">{current.question}</p>
        )}

        {current.type === 'correction' && (
          <div className="mb-4 rounded-xl border-2 border-warning bg-warning-bg p-3">
            <p className="text-body font-semibold text-fg">{current.question}</p>
          </div>
        )}

        {/* Answer input */}
        {current.type === 'multiple-choice' && current.options && (
          <div className="flex flex-col gap-2">
            {current.options.map((option: string, idx: number) => {
              const isSelected = selectedOption === idx;
              let optionClasses =
                'rounded-xl border-2 p-4 text-body font-semibold text-left transition-all cursor-pointer ';

              if (checked) {
                if (current.answer === idx) {
                  optionClasses += 'border-primary bg-primary-bg text-primary ';
                } else if (isSelected) {
                  optionClasses += 'border-danger bg-danger-bg text-danger ';
                } else {
                  optionClasses += 'border-border bg-card text-fg ';
                }
              } else if (isSelected) {
                optionClasses += 'border-primary bg-primary-bg text-primary ';
              } else {
                optionClasses += 'border-border bg-card text-fg hover:border-primary hover:bg-bg-alt ';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !checked && setSelectedOption(idx)}
                  className={optionClasses}
                  disabled={checked}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-current text-sm font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {(current.type === 'fill-blank' ||
          current.type === 'sentence-reorder' ||
          current.type === 'correction') && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !checked) {
                  e.preventDefault();
                  checkAnswer();
                }
              }}
              placeholder={
                current.type === 'sentence-reorder'
                  ? t('typeOrderedSentence')
                  : current.type === 'correction'
                    ? t('typeOrderedSentence')
                    : t('typeAnswer')
              }
              className="w-full rounded-xl border-2 border-border bg-bg p-4 text-body text-fg outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              disabled={checked}
              autoComplete="off"
            />
          </div>
        )}

        {/* Feedback */}
        {checked && (
          <div
            className={`mt-4 rounded-xl p-4 ${
              isCorrect
                ? 'border-2 border-primary bg-primary-bg'
                : 'border-2 border-danger bg-danger-bg'
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              {isCorrect ? (
                <>
                  <Check size={20} className="text-primary" />
                  <span className="font-bold text-primary">{t('correct')}</span>
                </>
              ) : (
                <>
                  <X size={20} className="text-danger" />
                  <span className="font-bold text-danger">{t('incorrect')}</span>
                </>
              )}
            </div>
            <p className="text-body-sm text-fg">{current.explanation}</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-fg transition-colors hover:border-primary hover:bg-primary-bg disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t('previous')}
        >
          <ArrowLeft size={20} />
        </button>

        {!checked ? (
          <button
            onClick={checkAnswer}
            disabled={
              current.type === 'multiple-choice'
                ? selectedOption === null
                : userInput.trim().length === 0
            }
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-body font-bold text-primary-fg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('checkAnswer')}
          </button>
        ) : (
          <button
            onClick={goNext}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-body font-bold text-primary-fg transition-colors hover:bg-primary/90"
          >
            {currentIndex < total - 1 ? (
              <>
                {t('next')}
                <ArrowRight size={18} />
              </>
            ) : (
              t('viewResults')
            )}
          </button>
        )}

        <button
          onClick={goNext}
          disabled={currentIndex >= total - 1 && !checked}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-fg transition-colors hover:border-primary hover:bg-primary-bg disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t('next')}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
