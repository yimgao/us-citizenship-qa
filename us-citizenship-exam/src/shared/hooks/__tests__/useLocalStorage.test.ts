/**
 * Tests for useLocalStorage hook
 */

import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';
import { StorageService } from '@/core/services/storage/storageService';

// Mock StorageService
jest.mock('@/core/services/storage/storageService');

describe('useLocalStorage', () => {
  const mockGetItem = StorageService.getItem as jest.MockedFunction<typeof StorageService.getItem>;
  const mockSetItem = StorageService.setItem as jest.MockedFunction<typeof StorageService.setItem>;
  const mockRemoveItem = StorageService.removeItem as jest.MockedFunction<
    typeof StorageService.removeItem
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should return initial value when key does not exist', () => {
    mockGetItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('should load stored value when key exists', () => {
    const storedValue = 'stored-value';
    mockGetItem.mockReturnValue(storedValue);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe(storedValue);
    expect(mockGetItem).toHaveBeenCalledWith('test-key');
  });

  it('should update value and persist to localStorage', () => {
    mockGetItem.mockReturnValue(null);
    mockSetItem.mockReturnValue(true);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(mockSetItem).toHaveBeenCalledWith('test-key', 'new-value');
  });

  it('should handle function updater', () => {
    mockGetItem.mockReturnValue(5);
    mockSetItem.mockReturnValue(true);

    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(6);
    expect(mockSetItem).toHaveBeenCalledWith('test-key', 6);
  });

  it('should remove value from localStorage', () => {
    mockGetItem.mockReturnValue('stored');
    mockRemoveItem.mockReturnValue(true);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('initial');
    expect(mockRemoveItem).toHaveBeenCalledWith('test-key');
  });

  it('should handle different data types', () => {
    // String
    mockGetItem.mockReturnValue(null);
    const { result: stringResult } = renderHook(() => useLocalStorage('string-key', 'default'));
    expect(stringResult.current[0]).toBe('default');

    // Number
    mockGetItem.mockReturnValue(null);
    const { result: numberResult } = renderHook(() => useLocalStorage('number-key', 0));
    expect(numberResult.current[0]).toBe(0);

    // Boolean
    mockGetItem.mockReturnValue(null);
    const { result: boolResult } = renderHook(() => useLocalStorage('bool-key', false));
    expect(boolResult.current[0]).toBe(false);

    // Object
    mockGetItem.mockReturnValue(null);
    const { result: objResult } = renderHook(() => useLocalStorage('obj-key', { a: 1 }));
    expect(objResult.current[0]).toEqual({ a: 1 });

    // Array
    mockGetItem.mockReturnValue(null);
    const { result: arrayResult } = renderHook(() => useLocalStorage('array-key', [1, 2, 3]));
    expect(arrayResult.current[0]).toEqual([1, 2, 3]);
  });

  it('should sync with storage events from other tabs', () => {
    mockGetItem.mockReturnValue(null);
    mockSetItem.mockReturnValue(true);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    // Simulate storage event from another tab
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('updated-from-other-tab'),
        oldValue: null,
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe('updated-from-other-tab');
  });

  it('should ignore storage events for different keys', () => {
    mockGetItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'other-key',
        newValue: JSON.stringify('other-value'),
        oldValue: null,
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe('initial');
  });

  it('should handle SSR environment', () => {
    const originalWindow = global.window;
    // @ts-expect-error - intentionally removing window for SSR test
    delete global.window;

    const { result } = renderHook(() => useLocalStorage('test-key', 'ssr-initial'));

    expect(result.current[0]).toBe('ssr-initial');

    global.window = originalWindow;
  });

  it('should handle storage errors gracefully', () => {
    mockGetItem.mockReturnValue(null);
    mockSetItem.mockReturnValue(false);
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    // Should still update state even if storage fails
    expect(result.current[0]).toBe('new-value');

    consoleSpy.mockRestore();
  });
});
