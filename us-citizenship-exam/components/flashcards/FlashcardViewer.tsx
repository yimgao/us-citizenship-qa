'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Volume2, VolumeX } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { useTranslations } from 'next-intl';
import { useQuizStore } from '@/lib/store';
import { useTTS } from '@/lib/useTTS';
import type { Question, Locale } from '@/lib/questions';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyRecord {
  cardId: string;
  difficulty: Difficulty;
  timestamp: number;
}

interface FlashcardViewerProps {
  questions: Question[];
  locale: Locale;
  totalCount?: number;
}

export default function FlashcardViewer({
  questions,
  locale,
  totalCount,
}: FlashcardViewerProps) {
  const t = useTranslations('flashcards');
  const { isStarred, toggleStar } = useQuizStore();
  const { speak, stop: stopSpeaking, state: ttsState } = useTTS(locale);

  const speaking = ttsState === 'speaking';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalCards = totalCount ?? questions.length;

  // Reset flip on navigation
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  // Toggle flip
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Navigation
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length]);

  // Difficulty handlers
  const handleDifficulty = useCallback(
    (difficulty: Difficulty) => {
      if (!currentQuestion) return;
      try {
        const records: DifficultyRecord[] = JSON.parse(
          localStorage.getItem('flashcard-difficulty') ?? '[]'
        );
        records.push({
          cardId: currentQuestion.id,
          difficulty,
          timestamp: Date.now(),
        });
        localStorage.setItem('flashcard-difficulty', JSON.stringify(records));
      } catch {
        // localStorage not available
      }
      goToNext();
    },
    [currentQuestion, goToNext]
  );

  // Swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    delta: 50,
    trackMouse: true,
  });

  // Star toggle
  const handleToggleStar = useCallback(() => {
    if (currentQuestion) toggleStar(currentQuestion.id);
  }, [currentQuestion, toggleStar]);

  // TTS speak/stop
  const handleSpeak = useCallback(() => {
    if (!currentQuestion) return;
    const text = isFlipped
      ? `${currentQuestion.options[currentQuestion.answer]}`
      : currentQuestion.text;
    if (speaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  }, [currentQuestion, isFlipped, speak, stopSpeaking, speaking]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handleFlip();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, goToPrevious, goToNext]);

  if (!currentQuestion) {
    return (
      <div className="rounded-2xl border-2 border-border bg-white p-8 text-center">
        <p className="text-body text-muted-foreground">{t('noCards')}</p>
      </div>
    );
  }

  const starred = isStarred(currentQuestion.id);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Card count */}
      <p className="text-body-sm text-muted-foreground">
        {t('cardCount', { current: currentIndex + 1, total: totalCards })}
      </p>

      {/* Flashcard */}
      <div {...swipeHandlers} className="w-full max-w-2xl">
        <button
          onClick={handleFlip}
          className="w-full cursor-pointer rounded-2xl border-2 border-border bg-white p-8 text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[280px]"
          aria-label={isFlipped ? t('clickToFlipBack') : t('clickToFlip')}
      >
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
          {/* Label */}
          <span className="mb-4 inline-block rounded-full bg-primary-bg px-3 py-1 text-caption font-semibold text-primary uppercase tracking-wide">
            {isFlipped ? t('answer') : t('question')}
          </span>

          {/* Content */}
          {isFlipped ? (
            <p className="text-body-lg font-bold text-fg leading-relaxed">
              {currentQuestion.options[currentQuestion.answer]}
            </p>
          ) : (
            <div>
              <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {currentQuestion.category}
              </p>
              <p className="text-body-lg font-bold text-fg leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>
          )}

          {/* Flip hint */}
          <p className="mt-6 text-caption text-muted-foreground">
            {isFlipped ? t('clickToFlipBack') : t('clickToFlip')}
          </p>
        </div>
      </button>

      {/* Difficulty buttons (only when flipped) */}
      {isFlipped && (
        <div className="flex items-center justify-center gap-3 w-full max-w-2xl">
          <button
            onClick={() => handleDifficulty('easy')}
            className="rounded-xl bg-primary px-5 py-2.5 text-body-sm font-semibold text-primary-fg transition-colors hover:brightness-105 active:scale-[0.97]"
          >
            😀 {t('easy')}
          </button>
          <button
            onClick={() => handleDifficulty('medium')}
            className="rounded-xl bg-warning px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:brightness-105 active:scale-[0.97]"
          >
            🤔 {t('medium')}
          </button>
          <button
            onClick={() => handleDifficulty('hard')}
            className="rounded-xl bg-danger px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:brightness-105 active:scale-[0.97]"
          >
            😰 {t('hard')}
          </button>
        </div>
      )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4">
        {/* Star button */}
        <button
          onClick={handleToggleStar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-white transition-colors hover:border-primary"
          aria-label={starred ? 'Unstar' : 'Star'}
        >
          <Star
            className={`h-5 w-5 ${
              starred
                ? 'fill-warning text-warning'
                : 'text-muted-foreground'
            }`}
          />
        </button>

        {/* TTS button */}
        <button
          onClick={handleSpeak}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-white transition-colors hover:border-primary"
          aria-label={speaking ? 'Stop' : 'Speak'}
        >
          {speaking ? (
            <VolumeX className="h-5 w-5 text-fg" />
          ) : (
            <Volume2 className="h-5 w-5 text-fg" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 w-full max-w-sm">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-5 py-2.5 text-body-sm font-semibold text-fg transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('previous')}
        </button>

        <button
          onClick={goToNext}
          disabled={currentIndex >= questions.length - 1}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-5 py-2.5 text-body-sm font-semibold text-fg transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          {t('next')}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Keyboard tip */}
      <p className="text-caption text-muted-foreground text-center">
        {t('tip')}
      </p>
    </div>
  );
}
