import { getTranslations } from 'next-intl/server';
import FeedbackForm from '@/components/FeedbackForm';

export default async function ResourcesPage({ params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources' });

  const youtube = [
    { label: 'USCIS 128 Questions Listening Practice', url: 'https://www.youtube.com/results?search_query=uscis+128+questions+listening' },
    { label: 'Civics Test Practice (Official USCIS)', url: 'https://www.youtube.com/@USCIS' }
  ];

  const official = [
    { label: 'USCIS Civics Test (2020/2025) Overview', url: 'https://www.uscis.gov/citizenship/find-study-materials-and-resources/2020-version-of-the-civics-test' },
    { label: 'USCIS Study Materials', url: 'https://www.uscis.gov/citizenship/find-study-materials-and-resources' }
  ];

  const community = [
    { label: 'r/USCIS Community', url: 'https://www.reddit.com/r/USCIS/' }
  ];

  return (
    <div>
      <h1 className="mb-6 sm:mb-8 text-center text-headline text-primary">{t('title')}</h1>

      <Section title={t('youtube')} items={youtube} />
      <Section title={t('official')} items={official} />
      <Section title={t('community')} items={community} />

      <div id="feedback" className="mt-8 sm:mt-10 lg:mt-12">
        <FeedbackForm />
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: { label: string; url: string }[] }) {
  return (
    <section className="mb-6 sm:mb-8 rounded-xl glass-card modern-shadow p-4 sm:p-6">
      <h2 className="mb-3 sm:mb-4 text-subtitle text-primary">{title}</h2>
      <ul className="space-y-2 sm:space-y-3">
        {items.map((it) => (
          <li key={it.url}>
            <a 
              className="touch-target inline-block text-body text-primary smooth-hover hover:opacity-80 hover:underline active:opacity-70" 
              href={it.url} 
              target="_blank" 
              rel="noreferrer"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}


