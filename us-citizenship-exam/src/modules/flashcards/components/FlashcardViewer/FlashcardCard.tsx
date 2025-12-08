/**
 * Flashcard card component with flip animation
 */

'use client';

import { memo } from 'react';
import { RotateCw, Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTTS } from '@/shared/hooks/useTTS';
import type { Flashcard } from '../../types/flashcard.types';

interface FlashcardCardProps {
  card: Flashcard;
  answerText: string;
  showAnswer: boolean;
  onFlip: () => void;
  tts: ReturnType<typeof useTTS>;
  swipeHandlers: ReturnType<typeof import('react-swipeable').useSwipeable>;
}

export const FlashcardCard = memo(function FlashcardCard({
  card,
  answerText,
  showAnswer,
  onFlip,
  tts,
  swipeHandlers,
}: FlashcardCardProps) {
  const t = useTranslations('flashcards');

  return (
    <div className="relative mb-6">
      {/* Screen reader announcement for card flip */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {showAnswer ? t('answerShown') : t('questionShown')}
      </div>
      <div
        {...swipeHandlers}
        onClick={onFlip}
        className="group relative mx-auto aspect-[4/3] w-full cursor-pointer select-none [perspective:1000px] touch-action-pan-y"
        role="button"
        aria-label={showAnswer ? t('flipToQuestion') : t('flipToAnswer')}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        <div
          className={`absolute inset-0 rounded-2xl bg-white shadow-lg transition-transform duration-700 [transform-style:preserve-3d] ${
            showAnswer ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Front Side - Question */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 [backface-visibility:hidden]">
            <div className="mb-4 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              {t('question')}
            </div>
            <div className="relative flex w-full max-w-xl flex-col items-center gap-3">
              <p className="text-center text-lg sm:text-xl md:text-2xl font-bold leading-relaxed text-slate-900">
                {card.text}
              </p>
              {tts.isSupported && !showAnswer && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tts.state === 'speaking') {
                      tts.stop();
                    } else {
                      tts.speak(card.text);
                    }
                  }}
                  className="min-h-[44px] min-w-[44px] rounded-lg border-2 border-slate-200 bg-white p-2.5 text-slate-600 transition-colors active:bg-blue-100 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 touch-action-manipulation"
                  title={tts.state === 'speaking' ? 'Stop reading' : 'Read question aloud'}
                  aria-label={tts.state === 'speaking' ? 'Stop reading' : 'Read question aloud'}
                >
                  {tts.state === 'speaking' ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <RotateCw className="h-4 w-4" />
              <span>{t('clickToFlip')}</span>
            </div>
          </div>

          {/* Back Side - Answer */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="mb-4 rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
              {t('answer')}
            </div>
            <div className="relative flex w-full max-w-xl flex-col items-center gap-3">
              <p className="text-center text-lg sm:text-xl md:text-2xl font-bold leading-relaxed text-green-700">
                {answerText}
              </p>
              {tts.isSupported && showAnswer && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tts.state === 'speaking') {
                      tts.stop();
                    } else {
                      tts.speak(answerText);
                    }
                  }}
                  className="min-h-[44px] min-w-[44px] rounded-lg border-2 border-slate-200 bg-white p-2.5 text-slate-600 transition-colors active:bg-green-100 hover:border-green-400 hover:bg-green-50 hover:text-green-600 touch-action-manipulation"
                  title={tts.state === 'speaking' ? 'Stop reading' : 'Read answer aloud'}
                  aria-label={tts.state === 'speaking' ? 'Stop reading' : 'Read answer aloud'}
                >
                  {tts.state === 'speaking' ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <RotateCw className="h-4 w-4" />
              <span>{t('clickToFlipBack')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
