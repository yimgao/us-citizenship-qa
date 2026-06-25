import { GeistSans, GeistMono } from 'geist/font';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const LOCALES = ['en', 'es', 'zh'];

const JSON_LD: Record<string, object> = {
  en: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Citizenship Prep',
    description: 'Free, multi-lingual practice for the U.S. naturalization civics test. Interactive quizzes, flashcards, grammar lessons, and glossary.',
    url: 'https://us-citizenship-qa.vercel.app/en',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Person', name: 'yimgao' },
    inLanguage: ['en', 'es', 'zh'],
  },
  es: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Citizenship Prep',
    description: 'Práctica gratuita y multilingüe para el examen de civismo de naturalización de EE. UU. Cuestionarios interactivos, tarjetas didácticas, lecciones de gramática y glosario.',
    url: 'https://us-citizenship-qa.vercel.app/es',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    inLanguage: ['en', 'es', 'zh'],
  },
  zh: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Citizenship Prep',
    description: '免费的美国入籍公民知识模拟练习。互动测验、闪卡、语法课程和词汇表，支持中文、英文和西班牙文。',
    url: 'https://us-citizenship-qa.vercel.app/zh',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    inLanguage: ['en', 'es', 'zh'],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) notFound();

  const messages = await getMessages();
  const jsonLd = JSON_LD[locale as keyof typeof JSON_LD] ?? JSON_LD.en;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${GeistSans.className} ${GeistMono.variable} flex min-h-dvh flex-col bg-bg text-fg antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
