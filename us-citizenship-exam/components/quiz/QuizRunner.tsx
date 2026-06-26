'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, Home, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQuizStore } from '@/lib/store';
import type { Question, Locale } from '@/lib/questions';

type QuizMode = 'practice' | 'test';

interface QuizRunnerProps {
  questions: Question[];
  mode: QuizMode;
  locale: Locale;
  reviewMissed?: boolean;
}

const TIMER_DURATION = 600; // 10 minutes in seconds
const WARNING_THRESHOLD = 120; // 2 minutes

const STORAGE_KEY_PREFIX = 'quiz_answers_';
const STORAGE_KEY_CURRENT = 'quiz_current_index';
const MISSED_QUESTIONS_KEY = 'missed-questions';

export default function QuizRunner({ questions, mode, locale, reviewMissed }: QuizRunnerProps) {
  const t = useTranslations('quiz');
  const router = useRouter();

  const { setAnswer, answersByQuestionId, setAllAnswers, reset: resetStore } = useQuizStore();

  // Persist answers to localStorage
  const storageKey = useMemo(
    () => `${STORAGE_KEY_PREFIX}${locale}_${mode}_${questions.map(q => q.id).join('_').slice(0, 64)}`,
    [locale, mode, questions],
  );

  // Filter questions for review missed mode
  const activeQuestions = useMemo(() => {
    if (!reviewMissed) return questions;
    try {
      const missedIds = JSON.parse(
        localStorage.getItem(MISSED_QUESTIONS_KEY) ?? '[]',
      ) as string[];
      if (missedIds.length === 0) return questions;
      return questions.filter((q) => missedIds.includes(q.id));
    } catch {
      return questions;
    }
  }, [questions, reviewMissed]);

  // Current question index
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < questions.length) return idx;
      }
      // Try to restore from localStorage answers
      try {
        const savedAnswers = localStorage.getItem(storageKey);
        if (savedAnswers) {
          const parsed = JSON.parse(savedAnswers) as Record<string, string>;
          // Find first unanswered question
          const firstUnanswered = questions.findIndex(q => !parsed[q.id]);
          return firstUnanswered >= 0 ? firstUnanswered : 0;
        }
      } catch {}
    }
    return 0;
  });

  // Store selected answers as { questionId: selectedOptionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved) as Record<string, string>;
      } catch {}
    }
    return {};
  });

  // Track which questions have been answered (for instant feedback in practice mode)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(() => new Set());

  // For test mode: track when quiz is complete
  const [quizComplete, setQuizComplete] = useState(false);

  // Timer for test mode
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(selectedAnswers));
    } catch {}
  }, [selectedAnswers, storageKey]);

  // Save current index to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_CURRENT, String(currentIndex));
    } catch {}
  }, [currentIndex]);

  const currentQuestion = activeQuestions[currentIndex];
  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // Calculate score
  const calculateScore = useCallback(() => {
    let correct = 0;
    for (const q of activeQuestions) {
      const answer = selectedAnswers[q.id];
      if (answer !== undefined && String(q.answer) === answer) {
        correct++;
      }
    }
    return correct;
  }, [activeQuestions, selectedAnswers]);

  // Handle selecting an option
  const handleSelectOption = (optionIndex: number) => {
    const q = currentQuestion;
    if (!q) return;

    const optionStr = String(optionIndex);

    setSelectedAnswers(prev => ({
      ...prev,
      [q.id]: optionStr,
    }));
    setAnswer(q.id, optionStr);

    if (mode === 'practice') {
      // Instant feedback: mark as answered
      setAnsweredQuestions(prev => new Set(prev).add(q.id));
    }
  };

  // Handle navigation
  const goToPrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const goToNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (mode === 'test') {
      // On last question, complete the quiz
      setQuizComplete(true);
    }
  };

  // Handle test mode submission
  const handleSubmitTest = () => {
    setQuizComplete(true);
    // Save missed questions to store
    const missedIds: string[] = [];
    for (const q of activeQuestions) {
      const answer = selectedAnswers[q.id];
      if (answer === undefined || String(q.answer) !== answer) {
        missedIds.push(q.id);
      }
    }
    useQuizStore.getState().setIncorrect(missedIds);
    // Also save to localStorage for the review missed pill
    try {
      localStorage.setItem(MISSED_QUESTIONS_KEY, JSON.stringify(missedIds));
    } catch {}
  };

  // Timer ref + effect for auto-submit (must be after handleSubmitTest to avoid forward ref)
  const submitRef = useRef(handleSubmitTest);
  submitRef.current = handleSubmitTest;

  useEffect(() => {
    if (mode !== 'test' || quizComplete) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, quizComplete]);

  // Handle try again
  const handleTryAgain = () => {
    setSelectedAnswers({});
    setAnsweredQuestions(new Set());
    setCurrentIndex(0);
    setQuizComplete(false);
    setTimeRemaining(TIMER_DURATION);
    resetStore();
    try {
      localStorage.removeItem(storageKey);
      sessionStorage.removeItem(STORAGE_KEY_CURRENT);
    } catch {}
  };

  // Determine if we're on the last question
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // All questions answered in test mode?
  const allAnsweredInTest = mode === 'test' && answeredCount === totalQuestions;

  // Check if current question is correct (practice mode only, after answered)
  const currentAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  const currentAnswered = currentQuestion ? answeredQuestions.has(currentQuestion.id) : false;
  const isCurrentCorrect = currentQuestion && currentAnswer !== undefined
    ? String(currentQuestion.answer) === currentAnswer
    : null;

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Timer bar percentage
  const timerPercent = (timeRemaining / TIMER_DURATION) * 100;
  const isTimerWarning = timeRemaining <= WARNING_THRESHOLD;

  // Count missed questions for review section
  const missedCount = useMemo(() => {
    if (!quizComplete || mode !== 'test') return 0;
    let count = 0;
    for (const q of activeQuestions) {
      const answer = selectedAnswers[q.id];
      if (answer === undefined || String(q.answer) !== answer) {
        count++;
      }
    }
    return count;
  }, [quizComplete, mode, activeQuestions, selectedAnswers]);

  // --- Score Screen (test mode) ---
  if (quizComplete && mode === 'test') {
    const correct = calculateScore();
    const passed = correct >= 12;
    const percent = Math.round((correct / totalQuestions) * 100);

    return (
      <div className="rounded-2xl border-2 border-border bg-white p-8 text-center">
        {passed ? (
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Check className="h-10 w-10 text-primary-fg" strokeWidth={3} />
          </div>
        ) : (
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-danger">
            <X className="h-10 w-10 text-white" strokeWidth={3} />
          </div>
        )}

        <h2 className="text-title font-bold text-fg mb-2">
          {passed ? t('pass') : t('fail')}
        </h2>

        <p className="text-body text-fg mb-6">
          {passed
            ? t('passMessage', { correct, total: totalQuestions })
            : t('failMessage', { correct, total: totalQuestions })
          }
        </p>

        {/* Score bar */}
        <div className="mx-auto mb-8 max-w-xs">
          <div className="mb-2 flex items-center justify-between text-body-sm text-muted-foreground">
            <span>{t('score', { correct, total: totalQuestions })}</span>
            <span className="font-semibold text-fg">{percent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-bg-alt">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                passed ? 'bg-primary' : 'bg-danger'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Review list */}
        <div className="mb-8 text-left">
          <h3 className="text-body-sm font-semibold text-fg mb-3">
            {t('viewResults')}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activeQuestions.map((q, idx) => {
              const answer = selectedAnswers[q.id];
              const correct = answer !== undefined && String(q.answer) === answer;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border-2 p-3 flex items-center gap-3 ${
                    correct
                      ? 'border-primary bg-primary-bg'
                      : 'border-danger bg-danger-bg'
                  }`}
                >
                  {correct ? (
                    <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                  ) : (
                    <X className="h-5 w-5 shrink-0 text-danger" strokeWidth={3} />
                  )}
                  <div className="min-w-0">
                    <p className="text-body-sm text-fg line-clamp-2">
                      <span className="font-medium text-caption text-muted-foreground mr-1">
                        {idx + 1}.
                      </span>
                      {q.text}
                    </p>
                    {!correct && answer !== undefined && (
                      <p className="text-caption text-danger mt-1">
                        Your answer: {q.options[parseInt(answer)] ?? ''}
                      </p>
                    )}
                    {!correct && (
                      <p className="text-caption text-primary mt-0.5">
                        Correct: {q.options[q.answer]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Missed section */}
        {missedCount > 0 && !reviewMissed && (
          <div className="mb-8 rounded-2xl border-2 border-warning bg-warning-bg p-5">
            <div className="flex flex-col items-center gap-3">
              <p className="text-body-sm font-semibold text-warning">
                {t('reviewMissedCount', { count: missedCount })}
              </p>
              <Link
                href={`/quiz?mode=practice&category=all&review=true`}
                className="inline-flex items-center gap-2 rounded-xl bg-warning px-6 py-3 text-body-sm font-bold text-white transition-colors hover:brightness-110"
              >
                <RotateCcw className="h-4 w-4" />
                {t('reviewMissedButton')}
              </Link>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleTryAgain}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-body-sm font-semibold text-primary-fg transition-colors hover:brightness-110"
          >
            <RotateCcw className="h-4 w-4" />
            {t('tryAgain')}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-6 py-3 text-body-sm font-semibold text-fg transition-colors hover:border-primary"
          >
            <Home className="h-4 w-4" />
            {t('backHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer bar (test mode only) */}
      {mode === 'test' && (
        <div>
          <div className="mb-2 flex items-center justify-between text-body-sm">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${isTimerWarning ? 'text-warning' : 'text-muted-foreground'}`} />
              <span className={`font-semibold ${isTimerWarning ? 'text-warning' : 'text-fg'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <span className="font-medium text-muted-foreground">
              {mode === 'test'
                ? `${answeredCount}/${totalQuestions}`
                : `${Math.round((answeredCount / totalQuestions) * 100)}%`
              }
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-bg-alt">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                isTimerWarning ? 'bg-warning' : 'bg-primary'
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Progress bar (hidden in test mode since timer bar shows above) */}
      {mode !== 'test' && (
        <div>
          <div className="mb-2 flex items-center justify-between text-body-sm text-muted-foreground">
            <span>
              {t('questionCount', { current: currentIndex + 1, total: totalQuestions })}
            </span>
            <span className="font-medium text-fg">
              {Math.round((answeredCount / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-bg-alt">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{
                width: `${(currentIndex + 1) / totalQuestions * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Question card */}
      <div className="border-2 border-border rounded-2xl bg-white p-6">
        <p className="text-caption font-semibold text-primary uppercase tracking-wide mb-3">
          {currentQuestion?.category}
        </p>
        <p className="text-body-lg font-bold text-fg mb-6 leading-relaxed">
          {currentQuestion?.text}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option, idx) => {
            const isSelected = String(idx) === currentAnswer;
            const isAnswer = String(currentQuestion.answer) === String(idx);

            // Determine styling
            let optionClasses = 'border-2 border-border rounded-xl p-4 text-left text-body text-fg transition-all cursor-pointer flex items-center gap-3 w-full';

            if (currentAnswered && mode === 'practice') {
              if (isAnswer) {
                optionClasses += ' border-primary bg-primary-bg';
              } else if (isSelected && !isAnswer) {
                optionClasses += ' border-danger bg-danger-bg';
              } else {
                optionClasses += ' opacity-50';
              }
            } else if (isSelected) {
              optionClasses += ' border-primary bg-primary-bg';
            } else {
              optionClasses += ' hover:border-primary hover:bg-primary-bg/30';
            }

            // Letter indicator
            const letter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={currentAnswered && mode === 'practice'}
                className={optionClasses}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-body-sm font-bold ${
                    currentAnswered && mode === 'practice'
                      ? isAnswer
                        ? 'bg-primary text-primary-fg'
                        : isSelected
                          ? 'bg-danger text-primary-fg'
                          : 'bg-bg-alt text-muted-foreground'
                      : isSelected
                        ? 'bg-primary text-primary-fg'
                        : 'bg-bg-alt text-fg'
                  }`}
                >
                  {currentAnswered && mode === 'practice'
                    ? isAnswer
                      ? <Check className="h-4 w-4" />
                      : isSelected
                        ? <X className="h-4 w-4" />
                        : letter
                    : letter
                  }
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Instant feedback for practice mode */}
        {currentAnswered && mode === 'practice' && (
          <div
            className={`mt-4 rounded-xl p-4 ${
              isCurrentCorrect
                ? 'bg-primary-bg border border-primary'
                : 'bg-danger-bg border border-danger'
            }`}
          >
            <div className="flex items-start gap-2">
              {isCurrentCorrect ? (
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
              ) : (
                <X className="mt-0.5 h-5 w-5 shrink-0 text-danger" strokeWidth={3} />
              )}
              <div>
                <p
                  className={`text-body-sm font-semibold ${
                    isCurrentCorrect ? 'text-primary' : 'text-danger'
                  }`}
                >
                  {isCurrentCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {!isCurrentCorrect && currentQuestion && (
                  <p className="text-body-sm text-fg mt-1">
                    {currentQuestion.options[currentQuestion.answer]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-5 py-2.5 text-body-sm font-semibold text-fg transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('previous')}
        </button>

        <div className="text-body-sm text-muted-foreground">
          {t('questionCount', { current: currentIndex + 1, total: totalQuestions })}
        </div>

        {mode === 'test' && isLastQuestion ? (
          <button
            onClick={handleSubmitTest}
            disabled={!allAnsweredInTest}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-body-sm font-semibold text-primary-fg transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('complete')}
            <Check className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={goToNext}
            disabled={currentIndex === totalQuestions - 1 && mode === 'practice'}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-body-sm font-semibold text-primary-fg transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('next')}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Test mode helper text */}
      {mode === 'test' && !allAnsweredInTest && isLastQuestion && (
        <p className="text-caption text-muted-foreground text-center">
          {t('needToPass', { min: 12 })} — {answeredCount}/{totalQuestions}
        </p>
      )}
    </div>
  );
}
