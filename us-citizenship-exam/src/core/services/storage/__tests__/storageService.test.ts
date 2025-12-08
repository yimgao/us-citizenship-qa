/**
 * Tests for StorageService
 */

import { StorageService } from '../storageService';

describe('StorageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getItem', () => {
    it('should return parsed value when item exists', () => {
      const testData = { name: 'test', value: 123 };
      localStorage.setItem('test-key', JSON.stringify(testData));

      const result = StorageService.getItem<typeof testData>('test-key');

      expect(result).toEqual(testData);
    });

    it('should return default value when item does not exist', () => {
      const defaultValue = { default: true };
      const result = StorageService.getItem('non-existent-key', defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it('should return null when item does not exist and no default provided', () => {
      const result = StorageService.getItem('non-existent-key');

      expect(result).toBeNull();
    });

    it('should return default value when JSON parse fails', () => {
      localStorage.setItem('invalid-json', 'invalid json string');
      const defaultValue = { error: true };

      const result = StorageService.getItem('invalid-json', defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it('should handle different data types', () => {
      // String
      localStorage.setItem('string-key', JSON.stringify('test string'));
      expect(StorageService.getItem<string>('string-key')).toBe('test string');

      // Number
      localStorage.setItem('number-key', JSON.stringify(42));
      expect(StorageService.getItem<number>('number-key')).toBe(42);

      // Boolean
      localStorage.setItem('boolean-key', JSON.stringify(true));
      expect(StorageService.getItem<boolean>('boolean-key')).toBe(true);

      // Array
      localStorage.setItem('array-key', JSON.stringify([1, 2, 3]));
      expect(StorageService.getItem<number[]>('array-key')).toEqual([1, 2, 3]);

      // Object
      localStorage.setItem('object-key', JSON.stringify({ a: 1, b: 2 }));
      expect(StorageService.getItem<{ a: number; b: number }>('object-key')).toEqual({ a: 1, b: 2 });
    });

    it('should return default value in SSR environment', () => {
      // Mock SSR environment by temporarily removing localStorage
      const originalLocalStorage = global.window.localStorage;
      // @ts-expect-error - intentionally removing localStorage for SSR test
      delete global.window.localStorage;
      
      const defaultValue = { ssr: true };
      const result = StorageService.getItem('test-key', defaultValue);

      expect(result).toEqual(defaultValue);

      // Restore localStorage
      global.window.localStorage = originalLocalStorage;
    });
  });

  describe('setItem', () => {
    it('should successfully set item in localStorage', () => {
      const testData = { name: 'test', value: 123 };
      const result = StorageService.setItem('test-key', testData);

      expect(result).toBe(true);
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(testData));
    });

    it('should handle different data types', () => {
      // String
      expect(StorageService.setItem('string-key', 'test')).toBe(true);
      expect(localStorage.getItem('string-key')).toBe('"test"');

      // Number
      expect(StorageService.setItem('number-key', 42)).toBe(true);
      expect(localStorage.getItem('number-key')).toBe('42');

      // Boolean
      expect(StorageService.setItem('boolean-key', true)).toBe(true);
      expect(localStorage.getItem('boolean-key')).toBe('true');

      // Array
      expect(StorageService.setItem('array-key', [1, 2, 3])).toBe(true);
      expect(localStorage.getItem('array-key')).toBe('[1,2,3]');

      // Object
      expect(StorageService.setItem('object-key', { a: 1 })).toBe(true);
      expect(localStorage.getItem('object-key')).toBe('{"a":1}');
    });

    it('should return false in SSR environment', () => {
      // Mock SSR environment by temporarily removing localStorage
      const originalLocalStorage = global.window.localStorage;
      // @ts-expect-error - intentionally removing localStorage for SSR test
      delete global.window.localStorage;

      const result = StorageService.setItem('test-key', { test: true });

      expect(result).toBe(false);

      // Restore localStorage
      global.window.localStorage = originalLocalStorage;
    });

    it('should handle localStorage quota exceeded error', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });

      const result = StorageService.setItem('test-key', { large: 'data' });

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      Storage.prototype.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('removeItem', () => {
    it('should successfully remove item from localStorage', () => {
      localStorage.setItem('test-key', 'test-value');
      
      const result = StorageService.removeItem('test-key');

      expect(result).toBe(true);
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should return true even if item does not exist', () => {
      const result = StorageService.removeItem('non-existent-key');

      expect(result).toBe(true);
    });

    it('should return false in SSR environment', () => {
      // Mock SSR environment by temporarily removing localStorage
      const originalLocalStorage = global.window.localStorage;
      // @ts-expect-error - intentionally removing localStorage for SSR test
      delete global.window.localStorage;

      const result = StorageService.removeItem('test-key');

      expect(result).toBe(false);

      // Restore localStorage
      global.window.localStorage = originalLocalStorage;
    });
  });

  describe('clear', () => {
    it('should successfully clear all items from localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');

      const result = StorageService.clear();

      expect(result).toBe(true);
      expect(localStorage.length).toBe(0);
    });

    it('should return false in SSR environment', () => {
      // Mock SSR environment by temporarily removing localStorage
      const originalLocalStorage = global.window.localStorage;
      // @ts-expect-error - intentionally removing localStorage for SSR test
      delete global.window.localStorage;

      const result = StorageService.clear();

      expect(result).toBe(false);

      // Restore localStorage
      global.window.localStorage = originalLocalStorage;
    });
  });

  describe('type safety', () => {
    it('should maintain type safety with TypeScript', () => {
      interface TestType {
        id: string;
        count: number;
      }

      const testData: TestType = { id: '123', count: 42 };
      StorageService.setItem<TestType>('typed-key', testData);

      const result = StorageService.getItem<TestType>('typed-key');

      expect(result).toEqual(testData);
      if (result) {
        // TypeScript should know result is TestType here
        expect(typeof result.id).toBe('string');
        expect(typeof result.count).toBe('number');
      }
    });
  });
});
