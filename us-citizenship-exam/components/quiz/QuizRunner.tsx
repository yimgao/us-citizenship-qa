"use client";
import { useEffect, useMemo, useState } from 'react';
import { useQuizStore } from '@/lib/store';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTTS } from '@/lib/useTTS';
import type { Locale } from '@/lib/questions';

type Question = {
  id: string;
  category: string;
  text: string;
  options: string[];
  answer: number;
};

export default function QuizRunner({ 
  questions, 
  storageKey, 
  mode = 'practice' 
}: { 
  questions: Question[]; 
  storageKey: string;
  mode?: 'practice' | 'test';
}) {
  const [index, setIndex] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all'|'wrong'|'starred'>('all');
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const { answersByQuestionId, setAnswer, setAllAnswers, reset, starredIds, toggleStar } = useQuizStore();
  const isTestMode = mode === 'test';
  const PASS_THRESHOLD = 12;

  // Extract locale from storageKey (format: "locale:mode:category")
  const locale = useMemo(() => {
    const loc = storageKey.split(':')[0];
    return (loc === 'en' || loc === 'es' || loc === 'zh') ? loc : 'en';
  }, [storageKey]) as Locale;

  const tts = useTTS(locale);

  // Stop TTS when question changes
  useEffect(() => {
    tts.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Load persisted answers
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${storageKey}:answers`);
      if (raw) {
        const data = JSON.parse(raw);
        setAllAnswers(data);
        setAnsweredQuestions(new Set(Object.keys(data)));
      }
    } catch {}
  }, [setAllAnswers, storageKey]);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}:answers`, JSON.stringify(answersByQuestionId));
    } catch {}
  }, [answersByQuestionId, storageKey]);

  const score = useMemo(() => {
    let correct = 0;
    for (const q of questions) {
      const sel = answersByQuestionId[q.id];
      if (sel != null && Number(sel) === q.answer) correct += 1;
    }
    return { correct, total: questions.length };
  }, [answersByQuestionId, questions]);

  const passed = score.correct >= PASS_THRESHOLD;

  const handleAnswer = (questionId: string, answerIndex: string) => {
    // In test mode, allow changing answers; in practice mode, lock after first answer
    if (!isTestMode && answeredQuestions.has(questionId)) return;
    setAnswer(questionId, answerIndex);
    if (!answeredQuestions.has(questionId)) {
      setAnsweredQuestions(new Set([...answeredQuestions, questionId]));
    }
  };
  // On submit in any mode, record incorrect ids for flashcards filters
  useEffect(() => {
    if (submitted) {
      const incorrect = questions.filter(q => {
        const sel = answersByQuestionId[q.id];
        return !(sel != null && Number(sel) === q.answer);
      }).map(q => q.id);
      useQuizStore.getState().setIncorrect(incorrect);
    }
  }, [submitted]);

  const t = useTranslations('quiz');

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-slate-600">{t('noQuestions')}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm animate-fade-in">
          <div className="text-center">
            <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full animate-scale-in ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`} style={{ animationDelay: '0.1s' }}>
              {passed ? (
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2 className={`mt-4 text-headline animate-slide-up ${
              passed ? 'text-green-700' : 'text-red-700'
            }`} style={{ animationDelay: '0.2s' }}>
              {passed ? t('pass') : t('fail')}
            </h2>
            <p className="mt-2 text-body-lg text-slate-600 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {isTestMode ? (
                passed ? t('passMessage', { correct: score.correct, total: score.total }) : 
                         t('failMessage', { correct: score.correct, total: score.total })
              ) : (
                t('score', { correct: score.correct, total: score.total })
              )}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => {
                  reset();
                  setSubmitted(false);
                  setIndex(0);
                  setAnsweredQuestions(new Set());
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white btn-press transition-colors active:bg-blue-700 hover:bg-blue-700 touch-action-manipulation"
              >
                <RotateCcw className="h-5 w-5" />
                {t('tryAgain')}
              </button>
              <a
                href={`/${storageKey.split(':')[0]}`}
                className="min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 btn-press transition-colors active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
              >
                <Home className="h-5 w-5" />
                {t('backHome')}
              </a>
            </div>
          </div>
          {/* Review list for both modes */}
          <div className="mt-8">
            {/* Review filters */}
            <ReviewFilters filter={reviewFilter} onChange={setReviewFilter} />
            <ul className="mt-3 space-y-3">
              {questions.filter((qq) => {
                const sel = answersByQuestionId[qq.id];
                const isCorrectSel = sel != null && Number(sel) === qq.answer;
                const starred = starredIds.has(qq.id);
                if (reviewFilter === 'wrong') return !isCorrectSel;
                if (reviewFilter === 'starred') return starred;
                return true;
              }).map((qq) => {
                const sel = answersByQuestionId[qq.id];
                const isCorrectSel = sel != null && Number(sel) === qq.answer;
                return (
                  <li key={qq.id} className={`rounded-xl border p-4 ${isCorrectSel ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                    <p className="text-lg font-medium leading-relaxed">{qq.text}</p>
                    <p className={`${isCorrectSel ? 'text-green-700' : 'text-red-700'}`}>
                      Your answer: {sel != null ? qq.options[Number(sel)] : '—'}
                    </p>
                    {!isCorrectSel && (
                      <p className="text-slate-700">Correct: {qq.options[qq.answer]}</p>
                    )}
                    <button
                      onClick={() => toggleStar(qq.id)}
                      className="mt-2 rounded border px-3 py-1 text-xs hover:bg-slate-50"
                    >
                      {starredIds.has(qq.id) ? '★ Unstar' : '☆ Star'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const selected = answersByQuestionId[q.id];
  const isAnswered = answeredQuestions.has(q.id);
  const pct = ((index + 1) / questions.length) * 100;
  const selectedIndex = selected ? Number(selected) : null;
  const isCorrect = selectedIndex !== null && selectedIndex === q.answer;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm sm:text-base font-medium text-slate-600">
            {t('questionCount', { current: index + 1, total: questions.length })}
          </span>
          {isTestMode && (
            <span className="text-xs sm:text-sm text-slate-500">
              {t('needToPass', { min: PASS_THRESHOLD })}
            </span>
          )}
          <span className="text-sm sm:text-base font-medium text-slate-600">
            {t('percent', { percent: Math.round(pct) })}
          </span>
        </div>
        <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-sm">
        <div className="mb-4 sm:mb-6 flex items-start justify-between gap-4">
          <h2 className="flex-1 text-title leading-relaxed text-slate-900">{q.text}</h2>
          {tts.isSupported && (
            <button
              onClick={() => {
                if (tts.state === 'speaking') {
                  tts.stop();
                } else {
                  tts.speak(q.text);
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
          {q.options.map((opt, i) => {
            const key = String(i);
            const wasSelected = selected === key;
            const isCorrectAnswer = i === q.answer;
            let buttonClass = "w-full rounded-xl border-2 px-4 sm:px-6 py-4 sm:py-3 text-base sm:text-sm text-left font-medium transition-all min-h-[52px] touch-action-manipulation";

            // In practice mode, show feedback immediately; in test mode, only show selection
            if (isTestMode) {
              if (wasSelected) {
                buttonClass += " bg-blue-50 border-blue-500 text-blue-900 active:bg-blue-100";
              } else {
                buttonClass += " border-slate-200 bg-white text-slate-700 active:bg-blue-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm cursor-pointer";
              }
            } else {
              // Practice mode with immediate feedback
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
                  buttonClass += " bg-blue-50 border-blue-500 text-blue-900 active:bg-blue-100";
                } else {
                  buttonClass += " border-slate-200 bg-white text-slate-700 active:bg-blue-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm cursor-pointer";
                }
              }
            }

            return (
              <div key={i} className="relative">
                <button
                  disabled={!isTestMode && isAnswered}
                  onClick={() => handleAnswer(q.id, key)}
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

      {/* Navigation */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <button
          onClick={() => setIndex((v) => Math.max(0, v - 1))}
          disabled={index === 0}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('previous')}
        </button>

        {/* In test mode, allow moving without answering; in practice mode, require answer */}
        {isTestMode ? (
          <button
            onClick={() => {
              if (index < questions.length - 1) {
                setIndex((v) => v + 1);
              } else {
                setSubmitted(true);
              }
            }}
            className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors active:bg-blue-700 hover:bg-blue-700 touch-action-manipulation"
          >
            {index < questions.length - 1 ? (
              <>
                {t('next')}
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              t('viewResults')
            )}
          </button>
        ) : (
          <>
            {isAnswered && (
              <button
                onClick={() => {
                  if (index < questions.length - 1) {
                    setIndex((v) => v + 1);
                  } else {
                    setSubmitted(true);
                  }
                }}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors active:bg-blue-700 hover:bg-blue-700 touch-action-manipulation"
              >
                {index < questions.length - 1 ? (
                  <>
                    {t('next')}
                    <ArrowRight className="h-5 w-5" />
                  </>
                ) : (
                  t('viewResults')
                )}
              </button>
            )}

            {!isAnswered && index < questions.length - 1 && (
              <button
                onClick={() => setIndex((v) => Math.min(questions.length - 1, v + 1))}
                disabled={true}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-100 px-6 py-3 font-semibold text-slate-400 transition-colors cursor-not-allowed"
              >
                {t('next')}
                <ArrowRight className="h-5 w-5" />
              </button>
            )}

            {answeredQuestions.size === questions.length && !isAnswered && (
              <button
                onClick={() => setSubmitted(true)}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-colors active:bg-green-700 hover:bg-green-700 touch-action-manipulation"
              >
                {t('viewResults')}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ReviewFilters({ filter, onChange }: { filter: 'all'|'wrong'|'starred'; onChange: (f: 'all'|'wrong'|'starred') => void }) {
  const base = "rounded border px-3 py-1 text-xs";
  return (
    <div className="flex items-center gap-2">
      <button className={`${base} ${filter==='all' ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50'}`} onClick={() => onChange('all')}>All</button>
      <button className={`${base} ${filter==='wrong' ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50'}`} onClick={() => onChange('wrong')}>Wrong</button>
      <button className={`${base} ${filter==='starred' ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50'}`} onClick={() => onChange('starred')}>Starred</button>
    </div>
  );
}
