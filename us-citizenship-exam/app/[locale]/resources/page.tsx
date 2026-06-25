import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ExternalLink, Youtube, Building2, Users } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';
type Props = {
  params: Promise<{ locale: string }>;
};

const RESOURCE_SECTIONS = [
  {
    key: 'youtube',
    icon: Youtube,
    links: [
      { href: 'https://www.youtube.com/playlist?list=PLQh_xDxLtt1JZRw3NY4SgKqDNp6t86IFK', label: 'USCIS 100 Civics Questions — ESL Listening' },
      { href: 'https://www.youtube.com/playlist?list=PLQh_xDxLtt1Jj4z3dMZoQ8gFnzR6x5kRb', label: 'N-400 Interview Vocabulary & Grammar' },
      { href: 'https://www.youtube.com/playlist?list=PLQh_xDxLtt1K4zZZ5oXGx6f6fg7Vt8GkL', label: 'US Citizenship Practice Interviews' },
    ],
  },
  {
    key: 'official',
    icon: Building2,
    links: [
      { href: 'https://www.uscis.gov/citizenship', label: 'USCIS Citizenship Resource Center' },
      { href: 'https://www.uscis.gov/citizenship/find-study-materials-and-resources', label: 'USCIS Study Materials' },
      { href: 'https://www.uscis.gov/sites/default/files/document/questions-and-answers/100q.pdf', label: 'USCIS 100 Civics Questions (PDF)' },
      { href: 'https://www.uscis.gov/citizenship-resource-center/n-400-instructions', label: 'N-400 Application Instructions' },
    ],
  },
  {
    key: 'community',
    icon: Users,
    links: [
      { href: 'https://www.usa.gov/citizenship', label: 'USA.gov — Citizenship' },
      { href: 'https://www.voanews.com/z/3618', label: 'VOA Learning English — Civics' },
      { href: 'https://www.english-grammar-revolution.com/', label: 'English Grammar Revolution' },
      { href: 'https://www.usalearns.org/citizenship', label: 'USA Learns — Citizenship Course' },
    ],
  },
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; desc: string }> = {
    en: { title: 'Resources — Citizenship Prep', desc: 'Listening and study resources for the U.S. naturalization test.' },
    es: { title: 'Recursos — Citizenship Prep', desc: 'Recursos de estudio para el examen de naturalización.' },
    zh: { title: '学习资源 — Citizenship Prep', desc: '入籍考试听力与学习资源。' },
  };
  const m = meta[locale as 'en' | 'es' | 'zh'] ?? meta.en;
  return { title: m.title, description: m.desc };
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  const activeLocale = (['en', 'es', 'zh'].includes(locale) ? locale : 'en') as 'en' | 'es' | 'zh';
  const t = await getTranslations({ locale: activeLocale, namespace: 'resources' });

  return (
    <div className="flex flex-col gap-10 py-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-display font-bold text-fg">{t('title')}</h1>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        {RESOURCE_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <section key={section.key} className="rounded-2xl border-2 border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-bg">
                  <Icon size={20} className="text-primary" />
                </div>
                <h2 className="text-title font-bold text-fg">{t(section.key)}</h2>
              </div>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-body font-semibold text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
                    >
                      {link.label}
                      <ExternalLink
                        size={14}
                        className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* FeedbackForm */}
      <FeedbackForm locale={activeLocale} />
    </div>
  );
}
