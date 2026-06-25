'use client';

import { FileText, BookOpen, GraduationCap, Bookmark, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ICONS = { FileText, BookOpen, GraduationCap, Bookmark } as const;

interface Feature {
  title: string;
  description: string;
  href: string;
  icon: keyof typeof ICONS;
  color: string;
}

interface FeatureGridProps {
  locale: string;
  features: Feature[];
}

export default function FeatureGrid({ locale, features }: FeatureGridProps) {
  return (
    <section className="py-8 sm:py-12">
      <h2 className="text-display font-bold text-fg">Pick your study mode</h2>
      <p className="mt-1 text-body-lg text-muted-foreground">
        Four ways to prepare for the civics test. Mix and match.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {features.map((f) => {
          const Icon = ICONS[f.icon];
          return (
            <Link
              key={f.href}
              href={`/${locale}${f.href}`}
              className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-white p-5 transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
            >
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: f.color }}
              >
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <h3 className="text-title font-bold text-fg">{f.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{f.description}</p>
              </div>
              <ArrowRight size={18} className="mt-3 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
