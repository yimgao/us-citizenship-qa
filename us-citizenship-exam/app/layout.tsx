import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Citizenship Prep — Free U.S. Naturalization Practice',
  description:
    'Free, fun practice for the U.S. naturalization civics test. Quizzes, flashcards, grammar, and glossary — in English, Spanish, and Chinese.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
