/**
 * Tests for useQuizStorage hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useQuizStorage } from '../useQuizStorage';
import { StorageService } from '@/core/services/storage/storageService';
import type { QuizStorageData } from '../../types/quiz.types';

// Mock StorageService
jest.mock('@/core/services/storage/storageService');

describe('useQuizStorage', () => {
  const mockGetItem = StorageService.getItem as jest.MockedFunction<typeof StorageService.getItem>;
  const mockSetItem = StorageService.setItem as jest.MockedFunction<typeof StorageService.setItem>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should load persisted answers on mount', async () => {
    const storageKey = 'test:quiz:storage';
    const mockStoredData: QuizStorageData = {
      answers: { '1': '0', '2': '1' },
      answeredQuestions: ['1', '2'],
    };

    mockGetItem.mockReturnValue(mockStoredData);

    const onLoad = jest.fn();

    renderHook(() => useQuizStorage(storageKey, {}, onLoad));

    await waitFor(() => {
      expect(mockGetItem).toHaveBeenCalledWith(`${storageKey}:answers`);
      expect(onLoad).toHaveBeenCalledWith({
        answers: mockStoredData.answers,
        answeredQuestions: ['1', '2'],
      });
    });
  });

  it('should not call onLoad when no stored data exists', async () => {
    const storageKey = 'test:quiz:storage';
    mockGetItem.mockReturnValue(null);

    const onLoad = jest.fn();

    renderHook(() => useQuizStorage(storageKey, {}, onLoad));

    await waitFor(() => {
      expect(mockGetItem).toHaveBeenCalled();
      expect(onLoad).not.toHaveBeenCalled();
    });
  });

  it('should persist answers when they change', async () => {
    const storageKey = 'test:quiz:storage';
    const answers = { '1': '0', '2': '1' };

    mockGetItem.mockReturnValue(null);

    const { rerender } = renderHook(
      ({ answers }) => useQuizStorage(storageKey, answers, jest.fn()),
      {
        initialProps: { answers: {} },
      }
    );

    // Initial render should not persist (empty answers)
    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalled();
    });

    jest.clearAllMocks();

    // Update answers
    rerender({ answers });

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith(`${storageKey}:answers`, {
        answers,
        answeredQuestions: ['1', '2'],
      });
    });
  });

  it('should handle storage key changes', async () => {
    const onLoad = jest.fn();
    mockGetItem.mockReturnValue(null);

    const { rerender } = renderHook(
      ({ storageKey }) => useQuizStorage(storageKey, {}, onLoad),
      {
        initialProps: { storageKey: 'key1' },
      }
    );

    await waitFor(() => {
      expect(mockGetItem).toHaveBeenCalledWith('key1:answers');
    });

    jest.clearAllMocks();

    rerender({ storageKey: 'key2' });

    await waitFor(() => {
      expect(mockGetItem).toHaveBeenCalledWith('key2:answers');
    });
  });

  it('should handle empty answers object', async () => {
    const storageKey = 'test:quiz:storage';
    mockGetItem.mockReturnValue(null);

    renderHook(() => useQuizStorage(storageKey, {}, jest.fn()));

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith(`${storageKey}:answers`, {
        answers: {},
        answeredQuestions: [],
      });
    });
  });

  it('should extract answeredQuestions from answers keys', async () => {
    const storageKey = 'test:quiz:storage';
    const answers = {
      'q1': '0',
      'q2': '1',
      'q3': '2',
    };

    mockGetItem.mockReturnValue(null);

    renderHook(() => useQuizStorage(storageKey, answers, jest.fn()));

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith(`${storageKey}:answers`, {
        answers,
        answeredQuestions: ['q1', 'q2', 'q3'],
      });
    });
  });
});
