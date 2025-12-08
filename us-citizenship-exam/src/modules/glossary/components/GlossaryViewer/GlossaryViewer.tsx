/**
 * Main Glossary Viewer component
 */

'use client';

import { useTranslations } from 'next-intl';
import { useGlossary } from '../../hooks/useGlossary';
import type { GlossaryItem } from '../../types/glossary.types';
import type { Locale } from '@/core/types';
import { GlossaryCard } from './GlossaryCard';
import { GlossaryNavigation } from './GlossaryNavigation';

export interface GlossaryViewerProps {
  items: GlossaryItem[];
  locale: Locale;
}

export function GlossaryViewer({ items, locale }: GlossaryViewerProps) {
  const t = useTranslations('glossary');

  const {
    currentIndex,
    showDefinition,
    speakingLang,
    currentItem,
    progress,
    goToNext,
    goToPrevious,
    toggleFlip,
    speakInLang,
    swipeHandlers,
  } = useGlossary({ items, locale });

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-secondary">{t('noItems')}</p>
      </div>
    );
  }

  if (!currentItem) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm sm:text-base font-medium text-slate-600">
            {t('itemCount', { current: currentIndex + 1, total: items.length })}
          </span>
          <span className="text-sm sm:text-base font-medium text-slate-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Glossary Card */}
      <GlossaryCard
        item={currentItem}
        showDefinition={showDefinition}
        speakingLang={speakingLang}
        onFlip={toggleFlip}
        onSpeak={speakInLang}
        swipeHandlers={swipeHandlers}
      />

      {/* Navigation Controls */}
      <GlossaryNavigation
        currentIndex={currentIndex}
        total={items.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />

      {/* Keyboard Tip */}
      <p className="mt-4 text-center text-caption text-secondary">{t('tip')}</p>
    </div>
  );
}
