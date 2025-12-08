/**
 * Quiz progress bar component
 */

'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { PASS_THRESHOLD } from '@/core/constants';

interface QuizProgressProps {
  current: number;
  total: number;
  isTestMode: boolean;
}

export function QuizProgress({ current, total, isTestMode }: QuizProgressProps) {
  const t = useTranslations('quiz');
  const pct = useMemo(() => (current / total) * 100, [current, total]);

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm sm:text-base font-medium text-primary">
          {t('questionCount', { current, total })}
        </span>
        {isTestMode && (
          <span className="text-xs sm:text-sm text-secondary">
            {t('needToPass', { min: PASS_THRESHOLD })}
          </span>
        )}
        <span className="text-sm sm:text-base font-medium text-primary">
          {t('percent', { percent: Math.round(pct) })}
        </span>
      </div>
      <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
