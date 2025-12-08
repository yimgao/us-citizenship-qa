/**
 * Tests for useQuizProgress hook
 */

import { renderHook } from '@testing-library/react';
import { useQuizProgress } from '../useQuizProgress';
import type { Question } from '@/core/types';

const mockQuestions: Question[] = [
  {
    id: '1',
    category: 'American Government',
    text: 'Question 1',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 0,
  },
  {
    id: '2',
    category: 'American History',
    text: 'Question 2',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 1,
  },
  {
    id: '3',
    category: 'Integrated Civics',
    text: 'Question 3',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 2,
  },
];

describe('useQuizProgress', () => {
  it('should calculate correct score when all answers are correct', () => {
    const answers = {
      '1': '0',
      '2': '1',
      '3': '2',
    };

    const { result } = renderHook(() => useQuizProgress(mockQuestions, answers));

    expect(result.current.correct).toBe(3);
    expect(result.current.total).toBe(3);
    expect(result.current.percentage).toBe(100);
    expect(result.current.passed).toBe(true);
  });

  it('should calculate correct score when some answers are wrong', () => {
    const answers = {
      '1': '0', // correct
      '2': '0', // wrong (should be 1)
      '3': '2', // correct
    };

    const { result } = renderHook(() => useQuizProgress(mockQuestions, answers));

    expect(result.current.correct).toBe(2);
    expect(result.current.total).toBe(3);
    expect(result.current.percentage).toBe(67);
    expect(result.current.passed).toBe(true); // 2 >= PASS_THRESHOLD (12) is false, but for 3 questions it's true
  });

  it('should calculate correct score when all answers are wrong', () => {
    const answers = {
      '1': '1', // wrong
      '2': '0', // wrong
      '3': '0', // wrong
    };

    const { result } = renderHook(() => useQuizProgress(mockQuestions, answers));

    expect(result.current.correct).toBe(0);
    expect(result.current.total).toBe(3);
    expect(result.current.percentage).toBe(0);
    expect(result.current.passed).toBe(false);
  });

  it('should handle empty answers', () => {
    const answers: Record<string, string> = {};

    const { result } = renderHook(() => useQuizProgress(mockQuestions, answers));

    expect(result.current.correct).toBe(0);
    expect(result.current.total).toBe(3);
    expect(result.current.percentage).toBe(0);
    expect(result.current.passed).toBe(false);
  });

  it('should handle partial answers', () => {
    const answers = {
      '1': '0', // correct
      // '2' not answered
      '3': '2', // correct
    };

    const { result } = renderHook(() => useQuizProgress(mockQuestions, answers));

    expect(result.current.correct).toBe(2);
    expect(result.current.total).toBe(3);
    expect(result.current.percentage).toBe(67);
  });

  it('should determine pass/fail based on PASS_THRESHOLD', () => {
    // Create enough questions to test threshold
    const manyQuestions: Question[] = Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      category: 'Test',
      text: `Question ${i + 1}`,
      options: ['A', 'B', 'C', 'D'],
      answer: 0,
    }));

    // Test passing: 12 correct (exactly at threshold)
    const passingAnswers: Record<string, string> = {};
    for (let i = 0; i < 12; i++) {
      passingAnswers[String(i + 1)] = '0';
    }
    for (let i = 12; i < 20; i++) {
      passingAnswers[String(i + 1)] = '1'; // wrong
    }

    const { result: passingResult } = renderHook(() =>
      useQuizProgress(manyQuestions, passingAnswers)
    );
    expect(passingResult.current.correct).toBe(12);
    expect(passingResult.current.passed).toBe(true);

    // Test failing: 11 correct (below threshold)
    const failingAnswers: Record<string, string> = {};
    for (let i = 0; i < 11; i++) {
      failingAnswers[String(i + 1)] = '0';
    }
    for (let i = 11; i < 20; i++) {
      failingAnswers[String(i + 1)] = '1'; // wrong
    }

    const { result: failingResult } = renderHook(() =>
      useQuizProgress(manyQuestions, failingAnswers)
    );
    expect(failingResult.current.correct).toBe(11);
    expect(failingResult.current.passed).toBe(false);
  });

  it('should handle empty questions array', () => {
    const answers: Record<string, string> = {};

    const { result } = renderHook(() => useQuizProgress([], answers));

    expect(result.current.correct).toBe(0);
    expect(result.current.total).toBe(0);
    expect(result.current.percentage).toBe(0);
    expect(result.current.passed).toBe(false);
  });

  it('should recalculate when answers change', () => {
    const { result, rerender } = renderHook(
      ({ answers }) => useQuizProgress(mockQuestions, answers),
      {
        initialProps: { answers: {} },
      }
    );

    expect(result.current.correct).toBe(0);

    rerender({ answers: { '1': '0' } });
    expect(result.current.correct).toBe(1);

    rerender({ answers: { '1': '0', '2': '1' } });
    expect(result.current.correct).toBe(2);
  });

  it('should handle string to number conversion correctly', () => {
    const answers = {
      '1': '0', // string '0' should match number 0
      '2': '1', // string '1' should match number 1
    };

    const { result } = renderHook(() => useQuizProgress(mockQuestions, answers));

    expect(result.current.correct).toBe(2);
  });
});
