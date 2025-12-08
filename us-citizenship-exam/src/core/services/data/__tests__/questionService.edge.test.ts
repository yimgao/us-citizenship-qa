/**
 * Edge case tests for QuestionService
 */

import { QuestionService } from '../questionService';

describe('QuestionService Edge Cases', () => {
  describe('loadQuestions', () => {
    it('should handle empty question arrays', async () => {
      // This would require mocking empty data
      const result = await QuestionService.loadQuestions('en', 'gov', 'trial');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle all category correctly', async () => {
      const result = await QuestionService.loadQuestions('en', 'all', 'trial');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('loadQuestionsPaged', () => {
    it('should handle offset beyond total', async () => {
      const result = await QuestionService.loadQuestionsPaged('en', 'gov', 10000, 10);
      expect(result.items).toEqual([]);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it('should handle zero limit', async () => {
      const result = await QuestionService.loadQuestionsPaged('en', 'gov', 0, 0);
      expect(result.items).toEqual([]);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it('should handle very large limit', async () => {
      const result = await QuestionService.loadQuestionsPaged('en', 'gov', 0, 1000000);
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items.length).toBeLessThanOrEqual(result.total);
    });
  });
});
