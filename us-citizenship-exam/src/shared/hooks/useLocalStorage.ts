/**
 * LocalStorage hook
 * Provides type-safe localStorage access with React state synchronization
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '@/core/services/storage/storageService';

/**
 * Hook for managing localStorage with React state
 *
 * @param key - localStorage key to store/retrieve the value
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [storedValue, setValue, removeValue]
 *
 * @example
 * ```typescript
 * const [value, setValue, removeValue] = useLocalStorage('my-key', 'default');
 * setValue('new value');
 * removeValue();
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = StorageService.getItem<T>(key);
      return item ?? initialValue;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        StorageService.setItem(key, valueToStore);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      StorageService.removeItem(key);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Error removing localStorage key "${key}":`, error);
      }
    }
  }, [key, initialValue]);

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue) as T;
          setStoredValue(newValue);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Error parsing storage event for key "${key}":`, error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue] as const;
}
