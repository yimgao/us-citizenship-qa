/**
 * Flashcard navigation component
 */

'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FlashcardNavigationProps {
  currentIndex: number;
  total: number;
  isStarred: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleStar: () => void;
}

export function FlashcardNavigation({
  currentIndex,
  total,
  isStarred,
  onPrevious,
  onNext,
  onToggleStar,
}: FlashcardNavigationProps) {
  const t = useTranslations('flashcards');

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
      >
        <ArrowLeft className="h-5 w-5" />
        {t('previous')}
      </button>

      <button
        onClick={onToggleStar}
        className="w-full sm:w-auto min-h-[44px] flex items-center justify-center rounded-xl border-2 border-amber-300 bg-white px-4 py-2.5 text-body-sm font-semibold text-amber-700 active:bg-amber-100 hover:bg-amber-50 touch-action-manipulation"
      >
        {isStarred ? '★ Starred' : '☆ Star'}
      </button>

      <button
        onClick={onNext}
        disabled={currentIndex === total - 1}
        className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
      >
        {t('next')}
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
