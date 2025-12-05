"use client";
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { GrammarExercise } from '@/lib/grammar';

export default function GrammarPractice({ 
  exercises, 
  storageKey 
}: { 
  exercises: GrammarExercise[]; 
  storageKey: string;
}) {
  const [index, setIndex] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answeredExercises, setAnsweredExercises] = useState<Set<string>>(new Set());
  const t = useTranslations('grammar');

  // Load persisted answers
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${storageKey}:answers`);
      if (raw) {
        const data = JSON.parse(raw);
        setAnswers(data);
        setAnsweredExercises(new Set(Object.keys(data)));
      }
    } catch {}
  }, [storageKey]);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}:answers`, JSON.stringify(answers));
    } catch {}
  }, [answers, storageKey]);

  const score = useMemo(() => {
    let correct = 0;
    for (const ex of exercises) {
      const userAnswer = answers[ex.id];
      if (userAnswer != null) {
        const correctAnswer = typeof ex.answer === 'number' 
          ? ex.options?.[ex.answer] 
          : ex.answer;
        if (userAnswer.toLowerCase().trim() === String(correctAnswer).toLowerCase().trim()) {
          correct += 1;
        }
      }
    }
    return { correct, total: exercises.length };
  }, [answers, exercises]);

  const handleAnswer = (exerciseId: string, answer: string) => {
    if (answeredExercises.has(exerciseId)) return;
    setAnswers(prev => ({ ...prev, [exerciseId]: answer }));
    setAnsweredExercises(prev => new Set([...prev, exerciseId]));
  };

  if (exercises.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-slate-600">{t('noExercises')}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full ${
              score.correct === score.total ? 'bg-green-100' : score.correct >= score.total * 0.7 ? 'bg-blue-100' : 'bg-red-100'
            }`}>
              {score.correct === score.total ? (
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2 className={`mt-4 text-3xl font-bold ${
              score.correct === score.total ? 'text-green-700' : score.correct >= score.total * 0.7 ? 'text-blue-700' : 'text-red-700'
            }`}>
              {t('complete')}
            </h2>
            <p className="mt-2 text-xl text-slate-600">
              {t('score', { correct: score.correct, total: score.total })}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setIndex(0);
                  setAnsweredExercises(new Set());
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <RotateCcw className="h-5 w-5" />
                {t('tryAgain')}
              </button>
              <a
                href={`/${storageKey.split(':')[0]}`}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
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
                const correctAnswer = typeof ex.answer === 'number' 
                  ? ex.options?.[ex.answer] 
                  : ex.answer;
                const isCorrect = userAnswer.toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();
                return (
                  <li key={ex.id} className={`rounded-xl border p-4 ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                    <p className="text-lg font-medium leading-relaxed">{ex.question}</p>
                    <p className={`mt-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {t('yourAnswer')}: {userAnswer || '—'}
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-slate-700">
                        {t('correctAnswer')}: {correctAnswer}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-slate-600">{ex.explanation}</p>
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
  const correctAnswer = typeof ex.answer === 'number' 
    ? ex.options?.[ex.answer] 
    : ex.answer;
  const isCorrect = isAnswered && userAnswer.toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();
  const pct = ((index + 1) / exercises.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            {t('exerciseCount', { current: index + 1, total: exercises.length })}
          </span>
          <span className="text-sm font-medium text-slate-600">
            {t('percent', { percent: Math.round(pct) })}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Exercise Card */}
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-4 text-xs font-semibold uppercase text-slate-500">
          {t(`exerciseType.${ex.type}`)}
        </div>
        <h2 className="mb-8 text-2xl font-bold leading-relaxed text-slate-900">{ex.question}</h2>

        {/* Exercise Input based on type */}
        {ex.type === 'fill-blank' && (
          <div className="space-y-3">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setAnswers(prev => ({ ...prev, [ex.id]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userAnswer.trim()) {
                  handleAnswer(ex.id, userAnswer);
                }
              }}
              disabled={isAnswered}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-700 transition-all focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
              placeholder={t('typeAnswer')}
            />
            {isAnswered && (
              <div className={`mt-2 flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {isCorrect ? t('correct') : t('incorrect')}
                </span>
              </div>
            )}
            {!isAnswered && (
              <button
                onClick={() => handleAnswer(ex.id, userAnswer)}
                disabled={!userAnswer.trim()}
                className="mt-4 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('checkAnswer')}
              </button>
            )}
          </div>
        )}

        {ex.type === 'multiple-choice' && ex.options && (
          <div className="space-y-3">
            {ex.options.map((opt, i) => {
              const wasSelected = userAnswer === opt;
              const isCorrectAnswer = i === ex.answer;
              let buttonClass = "w-full rounded-xl border-2 px-6 py-4 text-left font-medium transition-all";
              
              if (isAnswered) {
                if (isCorrectAnswer) {
                  buttonClass += " bg-green-100 border-green-500 text-green-900 font-semibold";
                } else if (wasSelected && !isCorrectAnswer) {
                  buttonClass += " bg-red-100 border-red-500 text-red-900 font-semibold";
                } else {
                  buttonClass += " border-slate-200 bg-slate-50 text-slate-400";
                }
              } else {
                if (wasSelected) {
                  buttonClass += " bg-blue-50 border-blue-500 text-blue-900";
                } else {
                  buttonClass += " border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm cursor-pointer";
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(ex.id, opt)}
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

        {ex.type === 'sentence-reorder' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 mb-4">{t('reorderInstructions')}</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setAnswers(prev => ({ ...prev, [ex.id]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userAnswer.trim()) {
                  handleAnswer(ex.id, userAnswer);
                }
              }}
              disabled={isAnswered}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-700 transition-all focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
              placeholder={t('typeOrderedSentence')}
            />
            {isAnswered && (
              <div className={`mt-2 flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {isCorrect ? t('correct') : t('incorrect')}
                </span>
              </div>
            )}
            {!isAnswered && (
              <button
                onClick={() => handleAnswer(ex.id, userAnswer)}
                disabled={!userAnswer.trim()}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('checkAnswer')}
              </button>
            )}
          </div>
        )}

        {ex.type === 'correction' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 mb-4">{t('correctionInstructions')}</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setAnswers(prev => ({ ...prev, [ex.id]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userAnswer.trim()) {
                  handleAnswer(ex.id, userAnswer);
                }
              }}
              disabled={isAnswered}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-700 transition-all focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
              placeholder={t('typeCorrectedSentence')}
            />
            {isAnswered && (
              <div className={`mt-2 flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {isCorrect ? t('correct') : t('incorrect')}
                </span>
              </div>
            )}
            {!isAnswered && (
              <button
                onClick={() => handleAnswer(ex.id, userAnswer)}
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
            <p className="mt-1 text-sm text-slate-600">{ex.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setIndex((v) => Math.max(0, v - 1))}
          disabled={index === 0}
          className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
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

