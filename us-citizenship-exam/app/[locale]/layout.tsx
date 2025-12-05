import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Naturalization Practice Hub',
  description: 'Practice for the U.S. naturalization test'
};

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body suppressHydrationWarning className={`bg-slate-50 text-slate-900 antialiased ${inter.className} ${inter.variable} font-sans`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar locale={locale as 'en'|'es'|'zh'} />
          <main className="min-h-[calc(100vh-3.5rem)] px-4 py-8 safe-area-inset-x">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}


