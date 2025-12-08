/**
 * Quiz navigation component
 */

'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface QuizNavigationProps {
  currentIndex: number;
  total: number;
  isAnswered: boolean;
  isTestMode: boolean;
  allAnswered: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function QuizNavigation({
  currentIndex,
  total,
  isAnswered,
  isTestMode,
  allAnswered,
  onPrevious,
  onNext,
  onSubmit,
}: QuizNavigationProps) {
  const t = useTranslations('quiz');

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
      >
        <ArrowLeft className="h-5 w-5" />
        {t('previous')}
      </button>

      {/* In test mode, allow moving without answering; in practice mode, require answer */}
      {isTestMode ? (
        <button
          onClick={onNext}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors active:bg-blue-700 hover:bg-blue-700 touch-action-manipulation"
        >
          {currentIndex < total - 1 ? (
            <>
              {t('next')}
              <ArrowRight className="h-5 w-5" />
            </>
          ) : (
            t('viewResults')
          )}
        </button>
      ) : (
        <>
          {isAnswered && (
            <button
              onClick={onNext}
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors active:bg-blue-700 hover:bg-blue-700 touch-action-manipulation"
            >
              {currentIndex < total - 1 ? (
                <>
                  {t('next')}
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                t('viewResults')
              )}
            </button>
          )}

          {!isAnswered && currentIndex < total - 1 && (
            <button
              onClick={() => {}}
              disabled={true}
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-100 px-6 py-3 font-semibold text-muted transition-colors cursor-not-allowed"
            >
              {t('next')}
              <ArrowRight className="h-5 w-5" />
            </button>
          )}

          {allAnswered && !isAnswered && (
            <button
              onClick={onSubmit}
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-colors active:bg-green-700 hover:bg-green-700 touch-action-manipulation"
            >
              {t('viewResults')}
            </button>
          )}
        </>
      )}
    </div>
  );
}
