import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Naturalization Practice Hub',
  description: 'Practice for the U.S. naturalization test'
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isValid = ['en', 'es', 'zh'].includes(locale);
  if (!isValid) return notFound();

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Navbar locale={locale as 'en'|'es'|'zh'} />
      <main id="main-content" className="min-h-[calc(100vh-3.5rem)] page-transition" tabIndex={-1}>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 safe-area-inset-x">
          {children}
        </div>
      </main>
      <Footer />
      <Analytics />
    </NextIntlClientProvider>
  );
}


