/**
 * Error reporting utility
 * Supports Sentry (if configured) or console logging as fallback
 */

interface ErrorContext {
  [key: string]: unknown;
}

/**
 * Sentry SDK interface
 * Matches the structure of @sentry/nextjs SDK
 */
interface SentrySDK {
  captureException: (error: Error, options?: { contexts?: { custom?: ErrorContext } }) => void;
  captureMessage: (message: string, options?: { level?: 'error' | 'warning' | 'info'; contexts?: { custom?: ErrorContext } }) => void;
  setUser: (user: { id?: string; email?: string; username?: string } | null) => void;
}

/**
 * Window interface with optional Sentry SDK
 */
interface WindowWithSentry extends Window {
  Sentry?: SentrySDK;
}

class ErrorReporter {
  private isDevelopment: boolean;
  private isEnabled: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    // Enable error reporting in production by default
    // Can be disabled by setting NEXT_PUBLIC_ERROR_REPORTING_ENABLED=false
    this.isEnabled = process.env.NEXT_PUBLIC_ERROR_REPORTING_ENABLED !== 'false';
  }

  /**
   * Report an error with optional context
   */
  reportError(error: Error, context?: ErrorContext): void {
    if (!this.isEnabled) {
      return;
    }

    // In development, always log to console
    if (this.isDevelopment) {
      console.error('[Error Reporter]', error, context);
      return;
    }

    // In production, try to use Sentry if available
    if (typeof window !== 'undefined') {
      const windowWithSentry = window as unknown as WindowWithSentry;
      if (windowWithSentry.Sentry) {
        try {
          windowWithSentry.Sentry.captureException(error, {
            contexts: {
              custom: context || {},
            },
          });
          return;
        } catch (sentryError) {
          console.error('[Error Reporter] Failed to report to Sentry:', sentryError);
        }
      }
    }

    // Fallback: log to console in production if Sentry is not available
    console.error('[Error Reporter]', error, context);
  }

  /**
   * Report a message (non-error)
   */
  reportMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext): void {
    if (!this.isEnabled) {
      return;
    }

    if (this.isDevelopment) {
      console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log']('[Error Reporter]', message, context);
      return;
    }

    // In production, try to use Sentry if available
    if (typeof window !== 'undefined') {
      const windowWithSentry = window as unknown as WindowWithSentry;
      if (windowWithSentry.Sentry) {
        try {
          windowWithSentry.Sentry.captureMessage(message, {
            level: level === 'error' ? 'error' : level === 'warning' ? 'warning' : 'info',
            contexts: {
              custom: context || {},
            },
          });
          return;
        } catch (sentryError) {
          console.error('[Error Reporter] Failed to report to Sentry:', sentryError);
        }
      }
    }

    // Fallback
    console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log']('[Error Reporter]', message, context);
  }

  /**
   * Set user context for error reports
   */
  setUser(user: { id?: string; email?: string; username?: string } | null): void {
    if (!this.isEnabled) {
      return;
    }

    if (typeof window !== 'undefined') {
      const windowWithSentry = window as unknown as WindowWithSentry;
      if (windowWithSentry.Sentry) {
        try {
          windowWithSentry.Sentry.setUser(user);
        } catch (error) {
          console.error('[Error Reporter] Failed to set user context:', error);
        }
      }
    }
  }
}

// Export singleton instance
export const errorReporter = new ErrorReporter();

// Export type for convenience
export type { ErrorContext };


