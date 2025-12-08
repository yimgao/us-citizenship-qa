/**
 * Main hook for managing flashcard state and logic
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppStore } from '@/core/store';
import { useTTS } from '@/shared/hooks/useTTS';
import type { Locale } from '@/core/types';
import type { Flashcard, FlashcardFilter } from '../types/flashcard.types';

export interface UseFlashcardsOptions {
  cards: Flashcard[];
  locale: Locale;
}

export function useFlashcards({ cards, locale }: UseFlashcardsOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filter, setFilter] = useState<FlashcardFilter>('all');

  const { starredIds, toggleStar, lastIncorrectIds } = useAppStore();
  const tts = useTTS(locale);

  // Filter cards based on selected filter
  const visibleCards = useMemo(() => {
    if (filter === 'starred') return cards.filter((c) => starredIds.has(c.id));
    if (filter === 'missed') return cards.filter((c) => lastIncorrectIds.has(c.id));
    return cards;
  }, [filter, cards, starredIds, lastIncorrectIds]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [filter]);

  // Stop TTS when card changes
  useEffect(() => {
    tts.stop();
    setShowAnswer(false);
  }, [currentIndex, tts]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setShowAnswer((v) => !v);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((v) => Math.min(visibleCards.length - 1, v + 1));
        setShowAnswer(false);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((v) => Math.max(0, v - 1));
        setShowAnswer(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visibleCards.length]);

  const currentCard = visibleCards[currentIndex];
  const progress = ((currentIndex + 1) / visibleCards.length) * 100;
  const answerText = currentCard ? currentCard.options[currentCard.answer] : '';

  const goToNext = useCallback(() => {
    if (currentIndex < visibleCards.length - 1) {
      setCurrentIndex((v) => Math.min(visibleCards.length - 1, v + 1));
      setShowAnswer(false);
    }
  }, [currentIndex, visibleCards.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((v) => Math.max(0, v - 1));
      setShowAnswer(false);
    }
  }, [currentIndex]);

  const toggleFlip = useCallback(() => {
    setShowAnswer((v) => !v);
  }, []);

  return {
    // State
    currentIndex,
    showAnswer,
    filter,
    currentCard,
    visibleCards,
    progress,
    answerText,

    // Store state
    starredIds,
    isStarred: currentCard ? starredIds.has(currentCard.id) : false,

    // Actions
    setFilter,
    goToNext,
    goToPrevious,
    toggleFlip,
    toggleStar: (id: string) => toggleStar(id),

    // TTS
    tts,
  };
}
