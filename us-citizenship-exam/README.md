# U.S. Citizenship Exam Study Hub

A comprehensive study platform for U.S. citizenship exam preparation, featuring quiz practice, flashcards, glossary, and grammar exercises in multiple languages (English, Spanish, Chinese).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Internationalization**: next-intl
- **State Management**: Zustand
- **Data Storage**: localStorage (client-side persistence)

## Project Structure

This project follows a **modular architecture** for better maintainability and scalability:

```
us-citizenship-exam/
├── src/
│   ├── core/              # Core infrastructure
│   │   ├── types/         # Shared type definitions
│   │   ├── constants/     # Application constants
│   │   ├── services/      # Data and storage services
│   │   └── store/         # Zustand state management
│   ├── shared/            # Shared utilities and hooks
│   │   ├── hooks/         # Reusable React hooks
│   │   ├── utils/         # Utility functions
│   │   └── ui/            # Shared UI components
│   └── modules/           # Feature modules
│       ├── quiz/          # Quiz module
│       ├── flashcards/    # Flashcards module
│       ├── glossary/      # Glossary module
│       └── grammar/       # Grammar module
├── app/                   # Next.js App Router pages
├── components/            # Legacy components (layout, ui)
├── lib/                   # Adapter layer (backward compatibility)
└── data/                  # Static JSON data files
```

## Module Architecture

Each feature module follows a consistent structure:

```
modules/[feature]/
├── types/           # Module-specific types
├── services/         # Module-specific services (if needed)
├── hooks/           # Module-specific hooks
├── components/      # Module components
│   └── [Component]/
│       ├── [Component].tsx
│       └── index.tsx
└── index.ts         # Module exports
```

### Import Paths

Use the following import paths:

```typescript
// Core infrastructure
import { QuestionService } from '@/core/services/data/questionService';
import { StorageService } from '@/core/services/storage/storageService';
import { useAppStore } from '@/core/store';
import type { Locale, Question } from '@/core/types';

// Shared utilities
import { useTTS } from '@/shared/hooks/useTTS';
import { cn } from '@/shared/utils/cn';

// Feature modules
import { QuizRunner } from '@/modules/quiz';
import { FlashcardViewer } from '@/modules/flashcards';
import { GlossaryViewer } from '@/modules/glossary';
import { GrammarViewer, GrammarPractice } from '@/modules/grammar';
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Testing

### Unit Tests

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### E2E Tests

```bash
npm run test:e2e
```

Run E2E tests with UI:

```bash
npm run test:e2e:ui
```

## Code Quality

### Linting

```bash
npm run lint
```

### Bundle Analysis

Analyze bundle size:

```bash
npm run analyze
```

## CI/CD

The project uses GitHub Actions for continuous integration. The CI pipeline includes:

- **Lint**: ESLint code quality checks
- **Unit Tests**: Jest test suite with coverage
- **Build**: Next.js production build verification
- **E2E Tests**: Playwright end-to-end tests
- **Data Validation**: JSON data file validation

See `.github/workflows/ci.yml` for the complete CI configuration.

## Error Reporting

Error reporting is integrated into the application. Errors are automatically tracked and can be monitored through:

- Development: Console logging
- Production: Error tracking service (configurable)

See `docs/ERROR_REPORTING.md` for configuration details.

## Performance Monitoring

Performance metrics are tracked using:

- **Web Vitals**: Core Web Vitals (LCP, FID, CLS) tracking
- **Vercel Analytics**: Automatic performance monitoring in production
- **Custom Metrics**: Component render time and resource load tracking

Performance utilities are available in `src/shared/utils/performance.ts`.

## Features

- **Quiz Practice**: Multiple-choice questions with practice and test modes
- **Flashcards**: Interactive flashcard study with swipe gestures
- **Glossary**: Bilingual/multilingual term definitions
- **Grammar Practice**: Grammar rules and exercises
- **Multi-language Support**: English, Spanish, and Chinese
- **Text-to-Speech**: Audio pronunciation support
- **Progress Tracking**: Local storage for quiz answers and progress
- **Error Reporting**: Integrated error tracking and reporting
- **Performance Monitoring**: Web Vitals tracking with Vercel Analytics
- **CI/CD**: Automated testing and deployment via GitHub Actions

## Architecture Principles

1. **Modularity**: Each feature is self-contained in its own module
2. **Type Safety**: Full TypeScript coverage with strict types
3. **Reusability**: Shared hooks, utilities, and components
4. **Separation of Concerns**: Clear separation between UI, logic, and data
5. **Backward Compatibility**: Adapter layer maintains compatibility with legacy code

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-intl Documentation](https://next-intl.dev/)
