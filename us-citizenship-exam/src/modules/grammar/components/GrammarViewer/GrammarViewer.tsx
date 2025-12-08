/**
 * Main Grammar Viewer component
 */

'use client';

import { useTranslations } from 'next-intl';
import { useGrammar } from '../../hooks/useGrammar';
import type { GrammarRule } from '../../types/grammar.types';
import type { Locale } from '@/core/types';
import { GrammarRuleCard } from './GrammarRuleCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface GrammarViewerProps {
  rules: GrammarRule[];
  locale: Locale;
}

export function GrammarViewer({ rules, locale }: GrammarViewerProps) {
  const t = useTranslations('grammar');

  const {
    currentIndex,
    showExplanation,
    speakingLang,
    currentRule,
    progress,
    goToNext,
    goToPrevious,
    toggleFlip,
    speakInLang,
    swipeHandlers,
  } = useGrammar({ rules, locale });

  if (rules.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-secondary">{t('noRules')}</p>
      </div>
    );
  }

  if (!currentRule) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm sm:text-base font-medium text-primary">
            {t('ruleCount', { current: currentIndex + 1, total: rules.length })}
          </span>
          <span className="text-sm sm:text-base font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Grammar Card */}
      <GrammarRuleCard
        rule={currentRule}
        locale={locale}
        showExplanation={showExplanation}
        speakingLang={speakingLang}
        onFlip={toggleFlip}
        onSpeak={speakInLang}
        swipeHandlers={swipeHandlers}
      />

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('previous')}
        </button>

        <button
          onClick={goToNext}
          disabled={currentIndex === rules.length - 1}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
        >
          {t('next')}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Keyboard Tip */}
      <p className="mt-4 text-center text-caption text-secondary">{t('tip')}</p>
    </div>
  );
}
