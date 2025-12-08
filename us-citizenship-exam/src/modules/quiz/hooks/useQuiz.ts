/**
 * Main hook for managing quiz state and logic
 *
 * @param options - Configuration options for the quiz
 * @param options.questions - Array of questions to display
 * @param options.storageKey - Key for localStorage persistence (format: "locale:mode:category")
 * @param options.mode - Quiz mode ('practice' or 'test')
 * @returns Quiz state and control functions
 *
 * @example
 * ```typescript
 * const {
 *   currentQuestion,
 *   score,
 *   handleAnswer,
 *   goToNext,
 *   reset,
 * } = useQuiz({ questions, storageKey: 'en:practice:gov', mode: 'practice' });
 * ```
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAppStore } from '@/core/store';
import { useTTS } from '@/shared/hooks/useTTS';
import { useQuizStorage } from './useQuizStorage';
import { useQuizProgress } from './useQuizProgress';
import type { Question, Locale } from '@/core/types';
import type { QuizMode, QuizStorageData } from '../types/quiz.types';

export interface UseQuizOptions {
  questions: Question[];
  storageKey: string;
  mode: QuizMode;
}

export function useQuiz({ questions, storageKey, mode }: UseQuizOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'starred'>('all');
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  const {
    answersByQuestionId,
    setAnswer: setStoreAnswer,
    setAllAnswers,
    reset: resetStore,
    starredIds,
    toggleStar,
    setIncorrect,
  } = useAppStore();

  const isTestMode = mode === 'test';

  // Extract locale from storageKey (format: "locale:mode:category")
  const locale = useMemo(() => {
    const loc = storageKey.split(':')[0];
    return (loc === 'en' || loc === 'es' || loc === 'zh' ? loc : 'en') as Locale;
  }, [storageKey]);

  const tts = useTTS(locale);

  // Stop TTS when question changes
  useEffect(() => {
    tts.stop();
  }, [currentIndex, tts]);

  // Load persisted answers
  const handleLoadStorage = useCallback(
    (data: QuizStorageData) => {
      setAllAnswers(data.answers);
      setAnsweredQuestions(new Set(data.answeredQuestions));
    },
    [setAllAnswers]
  );

  useQuizStorage(storageKey, answersByQuestionId, handleLoadStorage);

  // Calculate progress and score
  const score = useQuizProgress(questions, answersByQuestionId);

  // Handle answer selection
  const handleAnswer = useCallback(
    (questionId: string, answerIndex: string) => {
      // In test mode, allow changing answers; in practice mode, lock after first answer
      if (!isTestMode && answeredQuestions.has(questionId)) return;
      setStoreAnswer(questionId, answerIndex);
      if (!answeredQuestions.has(questionId)) {
        setAnsweredQuestions(new Set([...answeredQuestions, questionId]));
      }
    },
    [isTestMode, answeredQuestions, setStoreAnswer]
  );

  // Record incorrect answers on submit
  useEffect(() => {
    if (submitted) {
      const incorrect = questions
        .filter((q) => {
          const sel = answersByQuestionId[q.id];
          return !(sel != null && Number(sel) === q.answer);
        })
        .map((q) => q.id);
      setIncorrect(incorrect);
    }
  }, [submitted, questions, answersByQuestionId, setIncorrect]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((v) => v + 1);
    } else {
      setSubmitted(true);
    }
  }, [currentIndex, questions.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((v) => Math.max(0, v - 1));
  }, []);

  const submit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const reset = useCallback(() => {
    resetStore();
    setSubmitted(false);
    setCurrentIndex(0);
    setAnsweredQuestions(new Set());
  }, [resetStore]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return {
    // State
    currentIndex,
    submitted,
    reviewFilter,
    answeredQuestions,
    currentQuestion,
    progress,
    score,
    isTestMode,

    // Store state
    answersByQuestionId,
    starredIds,

    // Actions
    setCurrentIndex,
    setSubmitted,
    setReviewFilter,
    handleAnswer,
    toggleStar,
    goToNext,
    goToPrevious,
    submit,
    reset,

    // TTS
    tts,
  };
}
