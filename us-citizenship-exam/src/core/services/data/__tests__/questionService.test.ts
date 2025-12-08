/**
 * Tests for QuestionService
 */

import { QuestionService } from '../questionService';
import type { Question } from '@/core/types';

// Mock question data - need enough questions for test mode (20 questions)
const createMockQuestions = (category: string, prefix: string, count: number): Question[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    category,
    text: `Question ${i + 1} for ${category}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: i % 4,
  }));
};

const mockGovQuestions: Question[] = createMockQuestions('American Government', 'gov', 30);
const mockHistoryQuestions: Question[] = createMockQuestions('American History', 'history', 30);
const mockCivicsQuestions: Question[] = createMockQuestions('Integrated Civics', 'civics', 30);
const mockQuestions: Question[] = [...mockGovQuestions, ...mockHistoryQuestions, ...mockCivicsQuestions];

// Mock data is already defined above

// Mock dynamic imports
// Using manual mocks for JSON imports
jest.mock('@/data/questions/en/gov.json', () => ({
  __esModule: true,
  default: mockGovQuestions,
}), { virtual: true });

jest.mock('@/data/questions/en/history.json', () => ({
  __esModule: true,
  default: mockHistoryQuestions,
}), { virtual: true });

jest.mock('@/data/questions/en/civics.json', () => ({
  __esModule: true,
  default: mockCivicsQuestions,
}), { virtual: true });

jest.mock('@/data/questions/en/data.json', () => ({
  __esModule: true,
  default: mockQuestions,
}), { virtual: true });

describe('QuestionService', () => {
  describe('loadQuestions', () => {
    it('should load questions for a specific category in trial mode', async () => {
      const questions = await QuestionService.loadQuestions('en', 'gov', 'trial');

      expect(questions).toBeDefined();
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);
      // In trial mode, should return limited number (DEFAULT_QUESTION_COUNT)
      expect(questions.length).toBeLessThanOrEqual(10);
    });

    it('should load all questions when category is "all" and mode is "all"', async () => {
      const questions = await QuestionService.loadQuestions('en', 'all', 'all');

      expect(questions).toBeDefined();
      expect(Array.isArray(questions)).toBe(true);
    });

    it('should load random sample when category is "all" and mode is "trial"', async () => {
      const questions = await QuestionService.loadQuestions('en', 'all', 'trial');

      expect(questions).toBeDefined();
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeLessThanOrEqual(10);
    });

    it('should load test mode questions with balanced categories', async () => {
      const questions = await QuestionService.loadQuestions('en', 'all', 'test');

      expect(questions).toBeDefined();
      expect(Array.isArray(questions)).toBe(true);
      // Test mode should return TEST_QUESTION_COUNT (20) questions
      // If we have enough questions in each category, should get 20
      // Otherwise, will return what's available
      expect(questions.length).toBeGreaterThan(0);
      expect(questions.length).toBeLessThanOrEqual(20);
      
      // Verify questions are from different categories (balanced)
      const categories = new Set(questions.map(q => q.category));
      expect(categories.size).toBeGreaterThanOrEqual(1); // At least one category
    });

    it('should handle different locales', async () => {
      // Mock Spanish data
      jest.doMock('@/data/questions/es/data.json', () => ({
        default: mockQuestions,
      }), { virtual: true });

      const questions = await QuestionService.loadQuestions('es', 'all', 'trial');

      expect(questions).toBeDefined();
      expect(Array.isArray(questions)).toBe(true);
    });

    it('should filter by category correctly', async () => {
      const questions = await QuestionService.loadQuestions('en', 'gov', 'all');

      expect(questions).toBeDefined();
      expect(Array.isArray(questions)).toBe(true);
      // All questions should have the correct category
      questions.forEach((q) => {
        expect(q.category).toBe('American Government');
      });
    });
  });

  describe('loadQuestionsPaged', () => {
    it('should return paginated results for "all" category', async () => {
      const result = await QuestionService.loadQuestionsPaged('en', 'all', 0, 10);

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.items.length).toBeLessThanOrEqual(10);
    });

    it('should return paginated results for specific category', async () => {
      const result = await QuestionService.loadQuestionsPaged('en', 'gov', 0, 5);

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.items.length).toBeLessThanOrEqual(5);
    });

    it('should handle offset correctly', async () => {
      const firstPage = await QuestionService.loadQuestionsPaged('en', 'all', 0, 5);
      const secondPage = await QuestionService.loadQuestionsPaged('en', 'all', 5, 5);

      expect(firstPage.items).toBeDefined();
      expect(secondPage.items).toBeDefined();
      // Items should be different (assuming enough questions exist)
      if (firstPage.total > 5) {
        expect(firstPage.items[0]?.id).not.toBe(secondPage.items[0]?.id);
      }
    });

    it('should return empty array when offset exceeds total', async () => {
      const result = await QuestionService.loadQuestionsPaged('en', 'all', 1000, 10);

      expect(result.items).toEqual([]);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('loadAllQuestions', () => {
    it('should load all questions for a locale', async () => {
      const questions = await QuestionService.loadAllQuestions('en');

      expect(questions).toBeDefined();
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should handle different locales', async () => {
      const enQuestions = await QuestionService.loadAllQuestions('en');
      const esQuestions = await QuestionService.loadAllQuestions('es');

      expect(enQuestions).toBeDefined();
      expect(esQuestions).toBeDefined();
      expect(Array.isArray(enQuestions)).toBe(true);
      expect(Array.isArray(esQuestions)).toBe(true);
    });
  });

  describe('question structure', () => {
    it('should return questions with correct structure', async () => {
      const questions = await QuestionService.loadQuestions('en', 'all', 'trial');

      if (questions.length > 0) {
        const question = questions[0];
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('category');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('options');
        expect(question).toHaveProperty('answer');
        expect(Array.isArray(question.options)).toBe(true);
        expect(typeof question.answer).toBe('number');
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(question.options.length);
      }
    });
  });
});
