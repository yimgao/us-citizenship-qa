/**
 * Grammar exercise card component
 */

'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { GrammarExercise } from '../../types/grammar.types';

interface ExerciseCardProps {
  exercise: GrammarExercise;
  userAnswer: string;
  isAnswered: boolean;
  onAnswer: (exerciseId: string, answer: string) => void;
  onAnswerChange: (exerciseId: string, answer: string) => void;
}

export function ExerciseCard({
  exercise,
  userAnswer,
  isAnswered,
  onAnswer,
  onAnswerChange,
}: ExerciseCardProps) {
  const t = useTranslations('grammar');

  const correctAnswer =
    typeof exercise.answer === 'number' ? exercise.options?.[exercise.answer] : exercise.answer;
  const isCorrect =
    isAnswered &&
    userAnswer.toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="mb-4 text-xs font-semibold uppercase text-slate-500">
        {t(`exerciseType.${exercise.type}`)}
      </div>
      <h2 className="mb-8 text-2xl font-bold leading-relaxed text-slate-900">{exercise.question}</h2>

      {/* Exercise Input based on type */}
      {exercise.type === 'fill-blank' && (
        <div className="space-y-3">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => onAnswerChange(exercise.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && userAnswer.trim()) {
                onAnswer(exercise.id, userAnswer);
              }
            }}
            disabled={isAnswered}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-700 transition-all focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            placeholder={t('typeAnswer')}
          />
          {isAnswered && (
            <div
              className={`mt-2 flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{isCorrect ? t('correct') : t('incorrect')}</span>
            </div>
          )}
          {!isAnswered && (
            <button
              onClick={() => onAnswer(exercise.id, userAnswer)}
              disabled={!userAnswer.trim()}
              className="mt-4 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('checkAnswer')}
            </button>
          )}
        </div>
      )}

      {exercise.type === 'multiple-choice' && exercise.options && (
        <div className="space-y-3">
          {exercise.options.map((opt, i) => {
            const wasSelected = userAnswer === opt;
            const isCorrectAnswer = i === exercise.answer;
            let buttonClass =
              'w-full rounded-xl border-2 px-6 py-4 text-left font-medium transition-all';

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
                buttonClass += ' bg-blue-50 border-blue-500 text-blue-900';
              } else {
                buttonClass +=
                  ' border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm cursor-pointer';
              }
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => onAnswer(exercise.id, opt)}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  {isAnswered && wasSelected && !isCorrectAnswer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {exercise.type === 'sentence-reorder' && (
        <div className="space-y-3">
          <p className="mb-4 text-sm text-slate-600">{t('reorderInstructions')}</p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => onAnswerChange(exercise.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && userAnswer.trim()) {
                onAnswer(exercise.id, userAnswer);
              }
            }}
            disabled={isAnswered}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-700 transition-all focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            placeholder={t('typeOrderedSentence')}
          />
          {isAnswered && (
            <div
              className={`mt-2 flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{isCorrect ? t('correct') : t('incorrect')}</span>
            </div>
          )}
          {!isAnswered && (
            <button
              onClick={() => onAnswer(exercise.id, userAnswer)}
              disabled={!userAnswer.trim()}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('checkAnswer')}
            </button>
          )}
        </div>
      )}

      {exercise.type === 'correction' && (
        <div className="space-y-3">
          <p className="mb-4 text-sm text-slate-600">{t('correctionInstructions')}</p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => onAnswerChange(exercise.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && userAnswer.trim()) {
                onAnswer(exercise.id, userAnswer);
              }
            }}
            disabled={isAnswered}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-700 transition-all focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            placeholder={t('typeCorrectedSentence')}
          />
          {isAnswered && (
            <div
              className={`mt-2 flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{isCorrect ? t('correct') : t('incorrect')}</span>
            </div>
          )}
          {!isAnswered && (
            <button
              onClick={() => onAnswer(exercise.id, userAnswer)}
              disabled={!userAnswer.trim()}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('checkAnswer')}
            </button>
          )}
        </div>
      )}

      {isAnswered && (
        <div className="mt-4 rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">{t('explanation')}:</p>
          <p className="mt-1 text-sm text-slate-600">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
