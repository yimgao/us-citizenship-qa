/**
 * Quiz question display component
 */

'use client';

import { memo } from 'react';
import { CheckCircle2, XCircle, Volume2, VolumeX } from 'lucide-react';
import { useTTS } from '@/shared/hooks/useTTS';
import type { Question } from '@/core/types';

interface QuizQuestionProps {
  question: Question;
  selected: string | undefined;
  isAnswered: boolean;
  isTestMode: boolean;
  onAnswer: (questionId: string, answerIndex: string) => void;
  tts: ReturnType<typeof useTTS>;
}

export const QuizQuestion = memo(function QuizQuestion({
  question,
  selected,
  isAnswered,
  isTestMode,
  onAnswer,
  tts,
}: QuizQuestionProps) {
  // selectedIndex is used implicitly in the component logic

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-sm">
      {/* Screen reader announcements for answer feedback */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isAnswered && !isTestMode && (
          selected === String(question.answer)
            ? 'Correct answer selected'
            : 'Incorrect answer selected'
        )}
      </div>
      <div className="mb-4 sm:mb-6 flex items-start justify-between gap-4">
        <h2 className="flex-1 text-title leading-relaxed text-slate-900">{question.text}</h2>
        {tts.isSupported && (
          <button
            onClick={() => {
              if (tts.state === 'speaking') {
                tts.stop();
              } else {
                tts.speak(question.text);
              }
            }}
            className="min-h-[44px] min-w-[44px] flex-shrink-0 flex items-center justify-center rounded-lg border-2 border-slate-200 bg-white p-2.5 text-slate-600 transition-colors active:bg-blue-100 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 touch-action-manipulation"
            title={tts.state === 'speaking' ? 'Stop reading' : 'Read aloud'}
            aria-label={tts.state === 'speaking' ? 'Stop reading' : 'Read aloud'}
          >
            {tts.state === 'speaking' ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((opt, i) => {
          const key = String(i);
          const wasSelected = selected === key;
          const isCorrectAnswer = i === question.answer;
          let buttonClass =
            'w-full rounded-xl border-2 px-4 sm:px-6 py-4 sm:py-3 text-base sm:text-sm text-left font-medium transition-all min-h-[52px] touch-action-manipulation';

          // In practice mode, show feedback immediately; in test mode, only show selection
          if (isTestMode) {
            if (wasSelected) {
              buttonClass +=
                ' bg-blue-50 border-blue-500 text-blue-900 active:bg-blue-100';
            } else {
              buttonClass +=
                ' border-slate-200 bg-white text-slate-700 active:bg-blue-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm cursor-pointer';
            }
          } else {
            // Practice mode with immediate feedback
            if (isAnswered) {
              if (isCorrectAnswer) {
                buttonClass += ' bg-green-100 border-green-500 text-green-900 font-semibold';
              } else if (wasSelected && !isCorrectAnswer) {
                buttonClass += ' bg-red-100 border-red-500 text-red-900 font-semibold';
              } else {
                buttonClass += ' border-slate-200 bg-slate-50 text-slate-400';
              }
            } else {
              if (wasSelected) {
                buttonClass +=
                  ' bg-blue-50 border-blue-500 text-blue-900 active:bg-blue-100';
              } else {
                buttonClass +=
                  ' border-slate-200 bg-white text-slate-700 active:bg-blue-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm cursor-pointer';
              }
            }
          }

          return (
            <div key={i} className="relative">
              <button
                disabled={!isTestMode && isAnswered}
                onClick={() => onAnswer(question.id, key)}
                className={buttonClass}
              >
                <div className="flex items-center justify-between pr-10 sm:pr-8">
                  <span className="break-words">{opt}</span>
                  {!isTestMode && isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  )}
                  {!isTestMode && isAnswered && wasSelected && !isCorrectAnswer && (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </button>
              {tts.isSupported && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tts.state === 'speaking') {
                      tts.stop();
                    } else {
                      tts.speak(opt);
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md border border-slate-300 bg-white p-2 text-slate-500 opacity-60 transition-all active:bg-blue-100 hover:border-blue-400 hover:bg-blue-50 hover:opacity-100 hover:text-blue-600 focus:opacity-100 touch-action-manipulation"
                  title="Read this option aloud"
                  aria-label="Read this option aloud"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
