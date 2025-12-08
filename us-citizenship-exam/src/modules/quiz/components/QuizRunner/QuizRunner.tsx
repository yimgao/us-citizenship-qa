/**
 * Main Quiz Runner component
 * Orchestrates quiz flow using modular hooks and components
 */

'use client';

import { useTranslations } from 'next-intl';
import { useQuiz } from '../../hooks/useQuiz';
import type { Question } from '@/core/types';
import type { QuizMode } from '../../types/quiz.types';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { QuizNavigation } from './QuizNavigation';

export interface QuizRunnerProps {
  questions: Question[];
  storageKey: string;
  mode?: QuizMode;
}

export function QuizRunner({ questions, storageKey, mode = 'practice' }: QuizRunnerProps) {
  const t = useTranslations('quiz');

  const {
    currentIndex,
    submitted,
    reviewFilter,
    answeredQuestions,
    currentQuestion,
    score,
    isTestMode,
    answersByQuestionId,
    starredIds,
    setReviewFilter,
    handleAnswer,
    toggleStar,
    goToNext,
    goToPrevious,
    submit,
    reset,
    tts,
  } = useQuiz({ questions, storageKey, mode });

  // Extract locale from storageKey
  const locale = storageKey.split(':')[0];

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-secondary">{t('noQuestions')}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <QuizResults
        questions={questions}
        score={score}
        isTestMode={isTestMode}
        answers={answersByQuestionId}
        starredIds={starredIds}
        reviewFilter={reviewFilter}
        onFilterChange={setReviewFilter}
        onToggleStar={toggleStar}
        onReset={reset}
        locale={locale}
      />
    );
  }

  const isAnswered = answeredQuestions.has(currentQuestion.id);
  const allAnswered = answeredQuestions.size === questions.length;

  return (
    <div className="mx-auto max-w-2xl">
      <QuizProgress
        current={currentIndex + 1}
        total={questions.length}
        isTestMode={isTestMode}
      />

      <QuizQuestion
        question={currentQuestion}
        selected={answersByQuestionId[currentQuestion.id]}
        isAnswered={isAnswered}
        isTestMode={isTestMode}
        onAnswer={handleAnswer}
        tts={tts}
      />

      <QuizNavigation
        currentIndex={currentIndex}
        total={questions.length}
        isAnswered={isAnswered}
        isTestMode={isTestMode}
        allAnswered={allAnswered}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onSubmit={submit}
      />
    </div>
  );
}
