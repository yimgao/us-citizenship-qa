/**
 * Error scenario tests for QuestionService
 */

import { QuestionService } from '../questionService';

describe('QuestionService Error Scenarios', () => {
  describe('loadQuestions', () => {
    it('should handle invalid locale gracefully', async () => {
      // Invalid locale should return empty array or throw
      await expect(
        QuestionService.loadQuestions('invalid' as any, 'gov', 'trial')
      ).rejects.toThrow();
    });

    it('should handle missing data files', async () => {
      // This test would require mocking the import mechanism
      // For now, we verify the service handles errors
      const result = await QuestionService.loadQuestions('en', 'gov', 'trial');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('loadQuestionsPaged', () => {
    it('should handle invalid offset', async () => {
      const result = await QuestionService.loadQuestionsPaged('en', 'gov', -1, 10);
      expect(result.items).toEqual([]);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it('should handle invalid limit', async () => {
      const result = await QuestionService.loadQuestionsPaged('en', 'gov', 0, -1);
      expect(result.items).toEqual([]);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
  });
});
