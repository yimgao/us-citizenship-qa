/**
 * Error scenario tests for StorageService
 */

import { StorageService } from '../storageService';

describe('StorageService Error Scenarios', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getItem', () => {
    it('should return defaultValue when localStorage is unavailable', () => {
      // Mock localStorage as unavailable
      const originalLocalStorage = (global as any).window.localStorage;
      delete (global as any).window.localStorage;

      const result = StorageService.getItem('test-key', 'default');
      expect(result).toBe('default');

      // Restore
      (global as any).window.localStorage = originalLocalStorage;
    });

    it('should return defaultValue when item is corrupted', () => {
      localStorage.setItem('corrupted-key', 'invalid-json{');
      const result = StorageService.getItem('corrupted-key', 'default');
      expect(result).toBe('default');
    });
  });

  describe('setItem', () => {
    it('should return false when localStorage is unavailable', () => {
      const originalLocalStorage = (global as any).window.localStorage;
      delete (global as any).window.localStorage;

      const result = StorageService.setItem('test-key', 'value');
      expect(result).toBe(false);

      // Restore
      (global as any).window.localStorage = originalLocalStorage;
    });

    it('should handle quota exceeded errors', () => {
      // Mock localStorage.setItem to throw quota error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      const result = StorageService.setItem('test-key', 'value');
      expect(result).toBe(false);

      localStorage.setItem = originalSetItem;
    });
  });

  describe('removeItem', () => {
    it('should return false when localStorage is unavailable', () => {
      const originalLocalStorage = (global as any).window.localStorage;
      delete (global as any).window.localStorage;

      const result = StorageService.removeItem('test-key');
      expect(result).toBe(false);

      // Restore
      (global as any).window.localStorage = originalLocalStorage;
    });
  });

  describe('clear', () => {
    it('should return false when localStorage is unavailable', () => {
      const originalLocalStorage = (global as any).window.localStorage;
      delete (global as any).window.localStorage;

      const result = StorageService.clear();
      expect(result).toBe(false);

      // Restore
      (global as any).window.localStorage = originalLocalStorage;
    });
  });
});
