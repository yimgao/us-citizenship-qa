# Error Reporting Configuration

This project includes error reporting functionality that can be configured to use Sentry or simple console logging.

## Features

- Automatic error reporting in production
- Console logging in development
- Support for Sentry integration (optional)
- Contextual error information
- User context tracking

## Default Behavior

By default, errors are logged to the console:
- **Development**: All errors are logged with full context
- **Production**: Errors are logged to console (or Sentry if configured)

## Configuration

### Disable Error Reporting

Set the environment variable to disable error reporting:

```env
NEXT_PUBLIC_ERROR_REPORTING_ENABLED=false
```

### Enable Sentry (Optional)

To use Sentry for production error tracking:

1. Install Sentry:

```bash
npm install --save @sentry/nextjs
```

2. Initialize Sentry:

```bash
npx @sentry/wizard@latest -i nextjs
```

This will:
- Install the Sentry SDK
- Create `sentry.client.config.ts` and `sentry.server.config.ts`
- Update `next.config.ts` with Sentry webpack plugin
- Create `.sentryclirc` if needed

3. Set your Sentry DSN in environment variables:

```env
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
```

4. The error reporter will automatically detect and use Sentry if available.

## Usage

### In Components

The error reporter is already integrated in `app/error.tsx`. For custom error handling:

```typescript
import { errorReporter } from '@/shared/utils/errorReporting';

try {
  // Your code
} catch (error) {
  errorReporter.reportError(error, {
    component: 'MyComponent',
    action: 'userAction',
    // ... additional context
  });
}
```

### Setting User Context

```typescript
import { errorReporter } from '@/shared/utils/errorReporting';

// Set user information for error reports
errorReporter.setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'john_doe',
});

// Clear user context
errorReporter.setUser(null);
```

### Reporting Messages

```typescript
import { errorReporter } from '@/shared/utils/errorReporting';

// Report a warning
errorReporter.reportMessage('Something unusual happened', 'warning', {
  component: 'MyComponent',
});

// Report an info message
errorReporter.reportMessage('User action completed', 'info', {
  action: 'button_click',
});
```

## Files

- `src/shared/utils/errorReporting.ts` - Error reporting utility
- `app/error.tsx` - Global error boundary with error reporting

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_ERROR_REPORTING_ENABLED` | `true` | Enable/disable error reporting |
| `NEXT_PUBLIC_SENTRY_DSN` | (none) | Sentry DSN (if using Sentry) |


