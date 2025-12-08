/**
 * Main Flashcard Viewer component
 */

'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useFlashcardSwipe } from '../../hooks/useFlashcardSwipe';
import type { Flashcard } from '../../types/flashcard.types';
import type { Locale } from '@/core/types';
import { FlashcardFilters } from './FlashcardFilters';
import { FlashcardCard } from './FlashcardCard';
import { FlashcardNavigation } from './FlashcardNavigation';

export interface FlashcardViewerProps {
  cards: Flashcard[];
}

export function FlashcardViewer({ cards }: FlashcardViewerProps) {
  const t = useTranslations('flashcards');
  const localeParam = useLocale();
  const locale = (localeParam === 'en' || localeParam === 'es' || localeParam === 'zh' ? localeParam : 'en') as Locale;

  const {
    currentIndex,
    showAnswer,
    filter,
    currentCard,
    visibleCards,
    progress,
    answerText,
    isStarred,
    setFilter,
    goToNext,
    goToPrevious,
    toggleFlip,
    toggleStar,
    tts,
  } = useFlashcards({ cards, locale });

  // Swipe handlers
  const swipeHandlers = useFlashcardSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    onSwipeUp: () => toggleFlip(),
    onSwipeDown: () => toggleFlip(),
  });

  if (visibleCards.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-secondary">{t('noCards')}</p>
      </div>
    );
  }

  if (!currentCard) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Filters + Progress */}
      <FlashcardFilters filter={filter} onChange={setFilter} />

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm sm:text-base font-medium text-primary">
            {t('cardCount', { current: currentIndex + 1, total: visibleCards.length })}
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

      {/* Flashcard */}
      <FlashcardCard
        card={currentCard}
        answerText={answerText}
        showAnswer={showAnswer}
        onFlip={toggleFlip}
        tts={tts}
        swipeHandlers={swipeHandlers}
      />

      {/* Navigation Controls */}
      <FlashcardNavigation
        currentIndex={currentIndex}
        total={visibleCards.length}
        isStarred={isStarred}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToggleStar={() => toggleStar(currentCard.id)}
      />

      {/* Keyboard Tip */}
      <p className="mt-4 text-center text-caption text-secondary">{t('tip')}</p>
    </div>
  );
}
