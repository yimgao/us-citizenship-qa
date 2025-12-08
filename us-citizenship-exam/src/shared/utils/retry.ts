/**
 * Retry utility for async operations
 * Retries a function with exponential backoff
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

/**
 * Retry an async function with exponential backoff
 *
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @param options.maxAttempts - Maximum number of retry attempts (default: 3)
 * @param options.initialDelay - Initial delay in milliseconds (default: 1000)
 * @param options.maxDelay - Maximum delay in milliseconds (default: 10000)
 * @param options.backoffMultiplier - Multiplier for exponential backoff (default: 2)
 * @returns Promise that resolves with the function result
 * @throws The last error if all retries fail
 *
 * @example
 * ```typescript
 * // Basic usage with default options
 * const data = await retry(() => fetchData());
 *
 * // Custom retry configuration
 * const result = await retry(
 *   () => apiCall(),
 *   { maxAttempts: 5, initialDelay: 500 }
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | unknown;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on the last attempt
      if (attempt === opts.maxAttempts) {
        break;
      }

      // Wait before retrying with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
    }
  }

  throw lastError;
}
