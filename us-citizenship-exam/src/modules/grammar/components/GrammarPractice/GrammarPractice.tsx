/**
 * Main Grammar Practice component
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StorageService } from '@/core/services/storage/storageService';
import type { GrammarExercise } from '../../types/grammar.types';
import { ExerciseCard } from './ExerciseCard';

export interface GrammarPracticeProps {
  exercises: GrammarExercise[];
  storageKey: string;
}

export function GrammarPractice({ exercises, storageKey }: GrammarPracticeProps) {
  const t = useTranslations('grammar');
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  // Lazy initialization from localStorage
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const stored = StorageService.getItem<Record<string, string>>(`${storageKey}:answers`, {});
    return stored && Object.keys(stored).length > 0 ? stored : {};
  });
  
  const [answeredExercises, setAnsweredExercises] = useState<Set<string>>(() => {
    const stored = StorageService.getItem<Record<string, string>>(`${storageKey}:answers`, {});
    return stored && Object.keys(stored).length > 0 ? new Set(Object.keys(stored)) : new Set();
  });

  // Persist on change
  useEffect(() => {
    StorageService.setItem(`${storageKey}:answers`, answers);
  }, [storageKey, answers]);

  const score = useMemo(() => {
    let correct = 0;
    for (const ex of exercises) {
      const userAnswer = answers[ex.id];
      if (userAnswer != null) {
        const correctAnswer =
          typeof ex.answer === 'number' ? ex.options?.[ex.answer] : ex.answer;
        if (userAnswer.toLowerCase().trim() === String(correctAnswer).toLowerCase().trim()) {
          correct += 1;
        }
      }
    }
    return { correct, total: exercises.length };
  }, [answers, exercises]);

  const handleAnswer = useCallback(
    (exerciseId: string, answer: string) => {
      if (answeredExercises.has(exerciseId)) return;
      setAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
      setAnsweredExercises((prev) => new Set([...prev, exerciseId]));
    },
    [answeredExercises]
  );

  const handleAnswerChange = useCallback((exerciseId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  }, []);

  const reset = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
    setIndex(0);
    setAnsweredExercises(new Set());
  }, []);

  if (exercises.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-secondary">{t('noExercises')}</p>
      </div>
    );
  }

  if (submitted) {
    const locale = storageKey.split(':')[0];
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="text-center">
            <div
              className={`inline-flex h-20 w-20 items-center justify-center rounded-full ${
                score.correct === score.total
                  ? 'bg-green-100'
                  : score.correct >= score.total * 0.7
                    ? 'bg-blue-100'
                    : 'bg-red-100'
              }`}
            >
              {score.correct === score.total ? (
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2
              className={`mt-4 text-3xl font-bold ${
                score.correct === score.total
                  ? 'text-green-700'
                  : score.correct >= score.total * 0.7
                    ? 'text-blue-700'
                    : 'text-red-700'
              }`}
            >
              {t('complete')}
            </h2>
            <p className="mt-2 text-xl text-secondary">
              {t('score', { correct: score.correct, total: score.total })}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <RotateCcw className="h-5 w-5" />
                {t('tryAgain')}
              </button>
              <a
                href={`/${locale}`}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-slate-50"
              >
                <Home className="h-5 w-5" />
                {t('backHome')}
              </a>
            </div>
          </div>
          {/* Review list */}
          <div className="mt-8">
            <ul className="space-y-3">
              {exercises.map((ex) => {
                const userAnswer = answers[ex.id] || '';
                const correctAnswer =
                  typeof ex.answer === 'number' ? ex.options?.[ex.answer] : ex.answer;
                const isCorrect =
                  userAnswer.toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();
                return (
                  <li
                    key={ex.id}
                    className={`rounded-xl border p-4 ${
                      isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <p className="text-lg font-medium leading-relaxed">{ex.question}</p>
                    <p className={`mt-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {t('yourAnswer')}: {userAnswer || '—'}
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-primary">
                        {t('correctAnswer')}: {correctAnswer}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-secondary">{ex.explanation}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const ex = exercises[index];
  const userAnswer = answers[ex.id] || '';
  const isAnswered = answeredExercises.has(ex.id);
  const pct = ((index + 1) / exercises.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {t('exerciseCount', { current: index + 1, total: exercises.length })}
          </span>
          <span className="text-sm font-medium text-primary">
            {t('percent', { percent: Math.round(pct) })}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Exercise Card */}
      <ExerciseCard
        exercise={ex}
        userAnswer={userAnswer}
        isAnswered={isAnswered}
        onAnswer={handleAnswer}
        onAnswerChange={handleAnswerChange}
      />

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setIndex((v) => Math.max(0, v - 1))}
          disabled={index === 0}
          className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('previous')}
        </button>

        {isAnswered && (
          <button
            onClick={() => {
              if (index < exercises.length - 1) {
                setIndex((v) => v + 1);
              } else {
                setSubmitted(true);
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {index < exercises.length - 1 ? (
              <>
                {t('next')}
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              t('viewResults')
            )}
          </button>
        )}

        {answeredExercises.size === exercises.length && !isAnswered && (
          <button
            onClick={() => setSubmitted(true)}
            className="ml-auto flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            {t('viewResults')}
          </button>
        )}
      </div>
    </div>
  );
}
