/**
 * Quiz results display component
 */

'use client';

import { CheckCircle2, XCircle, RotateCcw, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Question } from '@/core/types';
import type { QuizScore, ReviewFilter } from '../../types/quiz.types';

interface QuizResultsProps {
  questions: Question[];
  score: QuizScore;
  isTestMode: boolean;
  answers: Record<string, string>;
  starredIds: Set<string>;
  reviewFilter: ReviewFilter;
  onFilterChange: (filter: ReviewFilter) => void;
  onToggleStar: (id: string) => void;
  onReset: () => void;
  locale: string;
}

export function QuizResults({
  questions,
  score,
  isTestMode,
  answers,
  starredIds,
  reviewFilter,
  onFilterChange,
  onToggleStar,
  onReset,
  locale,
}: QuizResultsProps) {
  const t = useTranslations('quiz');

  return (
    <div className="mx-auto max-w-2xl">
      {/* Screen reader announcement for quiz results */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {score.passed ? t('pass') : t('fail')}. {isTestMode
          ? score.passed
            ? t('passMessage', { correct: score.correct, total: score.total })
            : t('failMessage', { correct: score.correct, total: score.total })
          : t('score', { correct: score.correct, total: score.total })}
      </div>
      <div className="rounded-2xl bg-white p-8 shadow-sm animate-fade-in">
        <div className="text-center">
          <div
            className={`inline-flex h-20 w-20 items-center justify-center rounded-full animate-scale-in ${
              score.passed ? 'bg-green-100' : 'bg-red-100'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            {score.passed ? (
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h2
            className={`mt-4 text-headline animate-slide-up ${
              score.passed ? 'text-green-700' : 'text-red-700'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            {score.passed ? t('pass') : t('fail')}
          </h2>
          <p
            className="mt-2 text-body-lg text-slate-600 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            {isTestMode
              ? score.passed
                ? t('passMessage', { correct: score.correct, total: score.total })
                : t('failMessage', { correct: score.correct, total: score.total })
              : t('score', { correct: score.correct, total: score.total })}
          </p>
          <div
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            <button
              onClick={onReset}
              className="min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white btn-press transition-colors active:bg-blue-700 hover:bg-blue-700 touch-action-manipulation"
            >
              <RotateCcw className="h-5 w-5" />
              {t('tryAgain')}
            </button>
            <a
              href={`/${locale}`}
              className="min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 btn-press transition-colors active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
            >
              <Home className="h-5 w-5" />
              {t('backHome')}
            </a>
          </div>
        </div>
        {/* Review list for both modes */}
        <div className="mt-8">
          {/* Review filters */}
          <ReviewFilters filter={reviewFilter} onChange={onFilterChange} />
          <ul className="mt-3 space-y-3">
            {questions
              .filter((qq) => {
                const sel = answers[qq.id];
                const isCorrectSel = sel != null && Number(sel) === qq.answer;
                const starred = starredIds.has(qq.id);
                if (reviewFilter === 'wrong') return !isCorrectSel;
                if (reviewFilter === 'starred') return starred;
                return true;
              })
              .map((qq) => {
                const sel = answers[qq.id];
                const isCorrectSel = sel != null && Number(sel) === qq.answer;
                return (
                  <li
                    key={qq.id}
                    className={`rounded-xl border p-4 ${
                      isCorrectSel ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <p className="text-lg font-medium leading-relaxed">{qq.text}</p>
                    <p className={`${isCorrectSel ? 'text-green-700' : 'text-red-700'}`}>
                      Your answer: {sel != null ? qq.options[Number(sel)] : '—'}
                    </p>
                    {!isCorrectSel && (
                      <p className="text-slate-700">Correct: {qq.options[qq.answer]}</p>
                    )}
                    <button
                      onClick={() => onToggleStar(qq.id)}
                      className="mt-2 rounded border px-3 py-1 text-xs hover:bg-slate-50"
                    >
                      {starredIds.has(qq.id) ? '★ Unstar' : '☆ Star'}
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ReviewFilters({
  filter,
  onChange,
}: {
  filter: ReviewFilter;
  onChange: (f: ReviewFilter) => void;
}) {
  const base = 'rounded border px-3 py-1 text-xs';
  return (
    <div className="flex items-center gap-2">
      <button
        className={`${base} ${filter === 'all' ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50'}`}
        onClick={() => onChange('all')}
      >
        All
      </button>
      <button
        className={`${base} ${filter === 'wrong' ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50'}`}
        onClick={() => onChange('wrong')}
      >
        Wrong
      </button>
      <button
        className={`${base} ${filter === 'starred' ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50'}`}
        onClick={() => onChange('starred')}
      >
        Starred
      </button>
    </div>
  );
}
